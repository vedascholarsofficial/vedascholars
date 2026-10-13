const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('crypto');
const { loadConfig } = require('../src/config/env');

const strongSecret = () => crypto.randomBytes(48).toString('hex');
const base = () => ({ JWT_SECRET: strongSecret(), MONGO_URI: 'mongodb://127.0.0.1/test' });

test('rejects a missing JWT_SECRET', () => {
    assert.throws(() => loadConfig({ MONGO_URI: 'mongodb://x' }), /JWT_SECRET is required/);
});

test('rejects a short JWT_SECRET', () => {
    assert.throws(() => loadConfig({ ...base(), JWT_SECRET: 'abc123' }), /at least 32 characters/);
});

test('rejects placeholder-looking secrets even when long enough', () => {
    assert.throws(
        () => loadConfig({ ...base(), JWT_SECRET: 'your_super_secret_jwt_key_change_this_now_please' }),
        /placeholder/
    );
});

test('rejects a missing MONGO_URI', () => {
    assert.throws(() => loadConfig({ JWT_SECRET: strongSecret() }), /MONGO_URI is required/);
});

test('production requires https CLIENT_URL and API_PUBLIC_URL', () => {
    assert.throws(() => loadConfig({ ...base(), NODE_ENV: 'production' }), /CLIENT_URL is required/);
    assert.throws(
        () =>
            loadConfig({
                ...base(),
                NODE_ENV: 'production',
                CLIENT_URL: 'http://www.vedascholars.com',
                API_PUBLIC_URL: 'https://api.vedascholars.com',
            }),
        /CLIENT_URL must use https/
    );
});

test('error messages never include secret values', () => {
    const secret = 'short-but-secret';
    try {
        loadConfig({ JWT_SECRET: secret, MONGO_URI: 'mongodb://user:pass@host/db' });
        assert.fail('should throw');
    } catch (error) {
        assert.ok(!error.message.includes(secret));
        assert.ok(!error.message.includes('user:pass'));
    }
});

test('valid production config loads with a CORS allow-list defaulting to CLIENT_URL', () => {
    const config = loadConfig({
        ...base(),
        NODE_ENV: 'production',
        CLIENT_URL: 'https://www.vedascholars.com/',
        API_PUBLIC_URL: 'https://api.vedascholars.com',
    });
    assert.deepEqual(config.corsOrigins, ['https://www.vedascholars.com']);
    assert.equal(config.googleEnabled, false);
    assert.equal(config.jwtExpiresIn, '7d');
});
