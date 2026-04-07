const Resume = require("../models/Resume");

const getResumes = async (req, res) => {
  const resumes = await Resume.find().sort({ createdAt: -1 });
  res.json(resumes);
};

const updateResume = async (req, res) => {
  const updated = await Resume.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

const deleteResume = async (req, res) => {
  await Resume.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

module.exports = { getResumes, updateResume, deleteResume };