const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload container natively
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Map disk storage config securely
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, `raw-resume-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Gated intercept blocking generic payloads
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Veda Scholars only accepts standard PDF formats for raw text extraction.'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Locked 5MB limit globally
    fileFilter: fileFilter
});

module.exports = upload;
