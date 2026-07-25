const Student = require("../models/Student.model");
const Job = require("../models/Job.model");
const { evaluateMatch } = require("../utils/matchingEngine.util");
const { asyncHandler } = require("../middleware/error.middleware");

// @desc    Evaluate all student resumes against a specific Job Description
// @route   POST /api/matching/evaluate/:jobId
// @access  Admin only
const evaluateMatchingForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job posting not found.",
    });
  }

  const jdText = job.jobDescription || "";
  if (!jdText.trim()) {
    return res.status(400).json({
      success: false,
      message: "This job posting does not have a job description configured.",
    });
  }

  // Get all active students
  const students = await Student.find({ isBlocked: false });

  // Evaluate matching for each student
  const results = students.map((student) => evaluateMatch(jdText, student));

  // Sort by match percentage in descending order
  results.sort((a, b) => b.matchPercentage - a.matchPercentage);

  res.json({
    success: true,
    job: {
      companyName: job.companyName,
      jobRole: job.jobRole,
    },
    results,
  });
});

// @desc    Get matching score of the logged-in student for a specific job
// @route   GET /api/matching/job/:jobId/my-score
// @access  Student only
const getStudentMatchScoreForJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Job posting not found.",
    });
  }

  const jdText = job.jobDescription || "";
  if (!jdText.trim()) {
    return res.status(400).json({
      success: false,
      message: "This job posting does not have a job description configured.",
    });
  }

  // Get current logged-in student
  const student = await Student.findById(req.user._id);
  if (!student) {
    return res.status(404).json({
      success: false,
      message: "Student profile not found.",
    });
  }

  // Evaluate matching
  const matchResult = evaluateMatch(jdText, student);

  res.json({
    success: true,
    match: matchResult,
  });
});

module.exports = {
  evaluateMatchingForJob,
  getStudentMatchScoreForJob,
};
