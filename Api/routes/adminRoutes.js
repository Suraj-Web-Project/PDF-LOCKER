const express = require("express");
const router = express.Router();

const {
  getResumes,
  updateResume,
  deleteResume,
} = require("../controllers/adminController");

router.get("/resumes", getResumes);
router.put("/resumes/:id", updateResume);
router.delete("/resumes/:id", deleteResume);

module.exports = router;