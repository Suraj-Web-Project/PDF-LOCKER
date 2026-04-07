const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    dob: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String },
    summary: { type: String },
    education: { type: String },
    experience: { type: String },
    projects: { type: String },
    skills: { type: String },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);