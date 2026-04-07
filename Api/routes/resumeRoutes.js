const express = require("express");
const router = express.Router();

// Import both generateResume and the new emailResume controllers
const { generateResume, emailResume } = require("../controllers/resumeController");
const { checkTimeLimit, getStatus } = require("../middleware/timeMiddleware");

// Time status check route
router.get("/status", getStatus);

// Existing download route
router.post("/resume/download", checkTimeLimit, generateResume);

// NEW: Email route
router.post("/resume/email", checkTimeLimit, emailResume);

module.exports = router;