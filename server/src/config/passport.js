const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { getConfig } = require('./env');

const STATE_COOKIE = 'vs_oauth_state';
const STATE_TTL_SECONDS = 600;

const sign = (value) =>
    crypto.createHmac('sha256', `oauth-state:${getConfig().jwtSecret}`).update(value).digest('hex');

const readCookie = (req, name) => {
    const header = req.headers.cookie;
    if (typeof header !== 'string') return null;
    for (const part of header.split(';')) {
        const [key, ...rest] = part.trim().split('=');
        if (key === name) return decodeURIComponent(rest.join('='));
    }
    return null;
};

const stateCookieOptions = () =>
    `Path=/api/auth/google; HttpOnly; SameSite=Lax; Max-Age=${STATE_TTL_SECONDS}${
        getConfig().production ? '; Secure' : ''
    }`;

// Stateless CSRF protection for the OAuth round trip: a random nonce is sent
// as `state` and also stored in a signed, HttpOnly cookie. No server session
// (and no in-memory session store) is needed.
const cookieStateStore = {
    store(req, meta, callback) {
        const nonce = crypto.randomBytes(24).toString('hex');
        req.res.append('Set-Cookie', `${STATE_COOKIE}=${nonce}.${sign(nonce)}; ${stateCookieOptions()}`);
        callback(null, nonce);
    },
    verify(req, providedState, callback) {
        req.res.append('Set-Cookie', `${STATE_COOKIE}=; Path=/api/auth/google; HttpOnly; SameSite=Lax; Max-Age=0`);
        const cookie = readCookie(req, STATE_COOKIE);
        if (!cookie || typeof providedState !== 'string') {
            return callback(null, false, { message: 'Missing sign-in state.' });
        }
        const [nonce, signature] = cookie.split('.');
        const expected = sign(nonce || '');
        const valid =
            nonce === providedState &&
            typeof signature === 'string' &&
            signature.length === expected.length &&
            crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
        if (!valid) return callback(null, false, { message: 'Invalid sign-in state.' });
        callback(null, true);
    },
};

// Exported for tests. The role is never read from the request: every account
// created through Google is a student, and none is created while public
// sign-up is closed.
const handleGoogleProfile = async (profile) => {
    const primaryEmail = profile.emails && profile.emails[0];
    if (!primaryEmail || !primaryEmail.value) {
        return { user: null, info: { message: 'Google did not return an email address.' } };
    }
    if (primaryEmail.verified === false) {
        return { user: null, info: { message: 'Your Google email address is not verified.' } };
    }

    const email = primaryEmail.value.trim().toLowerCase();
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
        user = await User.findOne({ email: { $in: [email, primaryEmail.value.trim()] } });
    }

    if (user) {
        if (!user.googleId) {
            user.googleId = profile.id;
            user.isVerified = true; // Google has verified ownership of this email.
            await user.save();
        }
        return { user };
    }

    if (!getConfig().publicSignupEnabled) {
        return { user: null, info: { message: 'No account is registered with this Google email.' } };
    }

    const randomPassword = crypto.randomBytes(32).toString('hex');
    user = await User.create({
        googleId: profile.id,
        name: profile.displayName || email.split('@')[0],
        email,
        password: await bcrypt.hash(randomPassword, await bcrypt.genSalt(10)),
        isVerified: true,
        role: 'student',
    });
    return { user };
};

const configurePassport = () => {
    const config = getConfig();
    if (!config.googleEnabled) return passport;

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: `${config.apiPublicUrl}/api/auth/google/callback`,
                store: cookieStateStore,
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const { user, info } = await handleGoogleProfile(profile);
                    done(null, user || false, info);
                } catch (err) {
                    console.error('Google sign-in error:', err.name);
                    done(err);
                }
            }
        )
    );
    return passport;
};

module.exports = { configurePassport, handleGoogleProfile, cookieStateStore, passport };
