const nodemailer = require('nodemailer');

// Messages captured by the JSON transport (EMAIL_TRANSPORT=json), used by
// tests so no real email is ever sent.
const outbox = [];

let transporter;
const getTransporter = () => {
    if (transporter) return transporter;
    if (process.env.EMAIL_TRANSPORT === 'json') {
        transporter = nodemailer.createTransport({ jsonTransport: true });
    } else if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    } else {
        return null;
    }
    return transporter;
};

// Sends a plain-text email. Returns true on success, false otherwise.
// Never logs message bodies (they contain OTPs and reset links).
const sendEmail = async ({ to, subject, text }) => {
    const transport = getTransporter();
    if (!transport) {
        console.warn('Email not sent: EMAIL_USER / EMAIL_PASS are not configured.');
        return false;
    }
    try {
        const message = { from: process.env.EMAIL_USER || 'no-reply@localhost', to, subject, text };
        await transport.sendMail(message);
        if (process.env.EMAIL_TRANSPORT === 'json') outbox.push(message);
        return true;
    } catch (error) {
        console.error('Email send error:', error.code || error.name || 'unknown');
        return false;
    }
};

module.exports = { sendEmail, outbox };
