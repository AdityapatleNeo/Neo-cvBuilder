
const express = require('express')
const {createResume,getAllResumes,getResumeById,updateResume,deleteResume} = require('../controllers/resumeController.js')


const router = express.Router();
router.post("/", createResume);
router.get("/", getAllResumes);
router.get("/:id", getResumeById);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

module.exports = router
