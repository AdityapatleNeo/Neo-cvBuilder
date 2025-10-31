const Resume = require('../models/Resume.js')

exports.createResume = async (req, res) => {
  try {
    const resume = new Resume(req.body);
    const saved = await resume.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error creating resume:", error);
    res.status(500).json({ message: "Failed to create resume" });
  }
};

exports.getAllResumes = async (req, res) => {
  try {
    const resumes = await Resume.find();
    res.status(200).json(resumes);
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ message: "Failed to fetch resumes" });
  }
};

exports.getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: "Resume not found" });
    res.status(200).json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ message: "Failed to fetch resume" });
  }
};

exports.updateResume = async (req, res) => {
  try {
    const updated = await Resume.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Resume not found" });
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating resume:", error);
    res.status(500).json({ message: "Failed to update resume" });
  }
};

exports.deleteResume = async (req, res) => {
  try {
    const deleted = await Resume.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Resume not found" });
    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ message: "Failed to delete resume" });
  }
};
