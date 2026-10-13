require('dotenv').config();
const { getConfig } = require('./config/env');

// Fail fast on missing or weak configuration before connecting to anything.
try {
    getConfig();
} catch (error) {
    console.error(error.message);
    process.exit(1);
}

const { createApp } = require('./app');
const connectDB = require('./config/db');

const start = async () => {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    createApp().listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};

start();
