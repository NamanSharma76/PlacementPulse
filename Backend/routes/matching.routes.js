const express = require("express");
const router = express.Router();
const {
  evaluateMatchingForJob,
  getStudentMatchScoreForJob,
} = require("../controllers/matching.controller");
const { protect, adminOnly, studentOnly } = require("../middleware/auth.middleware");

router.post("/evaluate/:jobId", protect, adminOnly, evaluateMatchingForJob);
router.get("/job/:jobId/my-score", protect, studentOnly, getStudentMatchScoreForJob);

module.exports = router;
