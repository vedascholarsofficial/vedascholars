const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String },
    description: { type: String },
    courses: [
        {
            name: { type: String },
            skillsRequired: [String]
        }
    ],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('University', universitySchema);
