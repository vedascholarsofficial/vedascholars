// Central environment validation. The server refuses to start with missing or
// weak security configuration instead of silently falling back to defaults.

const PLACEHOLDER_PATTERN = /(your[_-]?|change[_-]?me|placeholder|example|secret[_-]?key|fallback|xxx)/i;
const MIN_SECRET_LENGTH = 32;

const splitList = (value) =>
    (value || '')
        .split(',')
        .map((item) => item.trim().replace(/\/$/, ''))
        .filter(Boolean);

const validateSecret = (name, value, errors) => {
    if (!value) {
        errors.push(`${name} is required.`);
    } else if (value.length < MIN_SECRET_LENGTH) {
        errors.push(`${name} must be at least ${MIN_SECRET_LENGTH} characters.`);
    } else if (PLACEHOLDER_PATTERN.test(value)) {
        errors.push(`${name} looks like a placeholder value. Generate a random secret.`);
    }
};

const validateUrl = (name, value, errors, production) => {
    try {
        const url = new URL(value);
        if (production && url.protocol !== 'https:') {
            errors.push(`${name} must use https in production.`);
        }
    } catch {
        errors.push(`${name} must be a valid absolute URL.`);
    }
};

// Returns a frozen config object or throws with every problem listed.
// Error messages name variables only, never their values.
const loadConfig = (env = process.env) => {
    const errors = [];
    const production = env.NODE_ENV === 'production';

    validateSecret('JWT_SECRET', env.JWT_SECRET, errors);

    if (!env.MONGO_URI) errors.push('MONGO_URI is required.');

    const clientUrl = (env.CLIENT_URL || (production ? '' : 'http://localhost:3000')).replace(/\/$/, '');
    const apiPublicUrl = (env.API_PUBLIC_URL || (production ? '' : 'http://localhost:5000')).replace(/\/$/, '');
    if (!clientUrl) errors.push('CLIENT_URL is required in production.');
    else validateUrl('CLIENT_URL', clientUrl, errors, production);
    if (!apiPublicUrl) errors.push('API_PUBLIC_URL is required in production.');
    else validateUrl('API_PUBLIC_URL', apiPublicUrl, errors, production);

    const corsOrigins = splitList(env.CORS_ORIGINS);
    if (corsOrigins.length === 0 && clientUrl) corsOrigins.push(clientUrl);

    const googleEnabled = Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET);
    if (googleEnabled && PLACEHOLDER_PATTERN.test(env.GOOGLE_CLIENT_SECRET)) {
        errors.push('GOOGLE_CLIENT_SECRET looks like a placeholder value.');
    }

    const trustProxyHops = Number.parseInt(env.TRUST_PROXY_HOPS || '0', 10);
    if (Number.isNaN(trustProxyHops) || trustProxyHops < 0) {
        errors.push('TRUST_PROXY_HOPS must be a non-negative integer.');
    }

    if (errors.length > 0) {
        const error = new Error(`Invalid server configuration:\n- ${errors.join('\n- ')}`);
        error.configErrors = errors;
        throw error;
    }

    return Object.freeze({
        production,
        jwtSecret: env.JWT_SECRET,
        jwtExpiresIn: env.JWT_EXPIRES_IN || '7d',
        mongoUri: env.MONGO_URI,
        clientUrl,
        apiPublicUrl,
        corsOrigins,
        googleEnabled,
        trustProxyHops,
        // Self-service sign-up (email registration and first-time Google
        // sign-in) is closed unless explicitly enabled. Existing accounts can
        // still sign in.
        publicSignupEnabled: env.PUBLIC_SIGNUP_ENABLED === 'true',
        geminiEnabled: Boolean(env.GEMINI_API_KEY) && !PLACEHOLDER_PATTERN.test(env.GEMINI_API_KEY),
        emailEnabled: Boolean(env.EMAIL_USER && env.EMAIL_PASS),
    });
};

let cachedConfig;
const getConfig = () => {
    if (!cachedConfig) cachedConfig = loadConfig();
    return cachedConfig;
};

// Test helper: re-read process.env after a test changes it.
const resetConfig = () => {
    cachedConfig = undefined;
};

module.exports = { loadConfig, getConfig, resetConfig, MIN_SECRET_LENGTH };
