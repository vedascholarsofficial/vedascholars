// Shared setup: an in-memory MongoDB, a JSON email transport (no real email)
// and a strong random JWT secret. Env vars are set before app modules load.
const crypto = require('crypto');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = crypto.randomBytes(48).toString('hex');
process.env.EMAIL_TRANSPORT = 'json';
process.env.EMAIL_USER = 'test-sender@vedascholars.test';
process.env.CLIENT_URL = 'http://localhost:3000';
process.env.API_PUBLIC_URL = 'http://localhost:5000';
// The registration tests exercise the optional sign-up path. signup.test.js
// covers the production default, where sign-up is closed.
process.env.PUBLIC_SIGNUP_ENABLED = 'true';
delete process.env.GOOGLE_CLIENT_ID;
delete process.env.GOOGLE_CLIENT_SECRET;
delete process.env.GEMINI_API_KEY;

let mongod;

const startDb = async () => {
    mongod = await MongoMemoryServer.create();
    process.env.MONGO_URI = mongod.getUri();
    await mongoose.connect(process.env.MONGO_URI);
};

const stopDb = async () => {
    await mongoose.disconnect();
    if (mongod) await mongod.stop();
};

const clearDb = async () => {
    const collections = await mongoose.connection.db.collections();
    await Promise.all(collections.map((c) => c.deleteMany({})));
};

const makeApp = () => {
    require('../src/config/env').resetConfig();
    return require('../src/app').createApp();
};

const createUser = async ({ role = 'student', email, password = 'CorrectHorse1', verified = true, ...extra } = {}) => {
    const User = require('../src/models/User');
    return User.create({
        name: `${role} user`,
        email: email || `${role}-${crypto.randomBytes(4).toString('hex')}@example.test`,
        password: await bcrypt.hash(password, 4),
        role,
        isVerified: verified,
        ...extra,
    });
};

const tokenFor = (user) => require('../src/utils/token').generateToken(user);

const outbox = () => require('../src/services/emailService').outbox;

module.exports = { startDb, stopDb, clearDb, makeApp, createUser, tokenFor, outbox };
