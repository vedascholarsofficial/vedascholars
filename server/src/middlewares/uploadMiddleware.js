const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Uploaded résumés are only kept until they have been parsed; see
// userController.uploadResume, which deletes the file afterwards.
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Random name: no user id or client-supplied name on disk.
        cb(null, `resume-${crypto.randomBytes(16).toString('hex')}.pdf`);
    },
});

// The client-declared MIME type is only a first filter; the controller also
// checks the file's magic bytes before parsing it.
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf') {
        cb(null, true);
    } else {
        const error = new Error('Only PDF files can be uploaded.');
        error.statusCode = 400;
        cb(error, false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: fileFilter
});

module.exports = upload;
