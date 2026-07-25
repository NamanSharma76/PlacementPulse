import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import API from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { JobDetailSkeleton } from "../../components/Skeleton";
export default function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const { user } = useAuth();

  const [matchData, setMatchData] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);

  useEffect(() => {
    fetchJob();
    fetchMatchScore();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await API.get(`/jobs/${id}`);
      setJob(res.data.data);
    } catch (err) {
      toast.error("Job not found");
      navigate("/student/jobs");
    } finally {
      setLoading(false);
    }
  };

  const fetchMatchScore = async () => {
    if (!user?.resumeUrl) return;
    setLoadingMatch(true);
    try {
      const res = await API.get(`/matching/job/${id}/my-score`);
      setMatchData(res.data.match);
    } catch (err) {
      console.error("Failed to load match score:", err);
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await API.post(`/jobs/${id}/apply`);
      toast.success("Application submitted successfully!");
      setApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

if (loading) return <JobDetailSkeleton />;

  if (!job) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <Toaster position="top-right" />

      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-gray-900">{job.companyName}</h1>
              {job.isDreamCompany && (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                  Dream Company
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1">{job.jobRole}</p>
          </div>

          {/* Apply Button */}
          {!user?.isVerified ? (
            <span className="shrink-0 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 px-4 py-2 rounded-lg">
              ⏳ Verification Pending
            </span>
          ) : job.eligible ? (
            <button
              onClick={handleApply}
              disabled={applying || applied}
              className="shrink-0 bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applied ? "Applied ✓" : applying ? "Applying..." : "Apply Now"}
            </button>
          ) : (
            <span className="shrink-0 text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2 rounded-lg">
              Not Eligible
            </span>
          )}
        </div>

        {/* Ineligibility reasons */}
        {!job.eligible && job.ineligibilityReasons?.length > 0 && (
          <div className="mt-3 p-3 bg-red-50 rounded-lg">
            <p className="text-xs font-medium text-red-700 mb-1">Why you're not eligible:</p>
            <ul className="space-y-0.5">
              {job.ineligibilityReasons.map((r, i) => (
                <li key={i} className="text-xs text-red-600">• {r}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Resume Match Analysis */}
      {user?.resumeUrl ? (
        loadingMatch ? (
          <div className="bg-white rounded-xl border border-slate-200/60 p-6 flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2.5 text-sm text-slate-500 font-medium">Analyzing resume match...</span>
          </div>
        ) : matchData ? (
          <div className="bg-gradient-to-r from-sky-50/70 to-emerald-50/70 rounded-xl border border-sky-100 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              {/* Score display */}
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-sm border border-sky-200 shrink-0">
                  <span className="text-lg font-bold text-sky-700">{matchData.matchPercentage}%</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base">Resume Match Analysis</h3>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {matchData.matchPercentage >= 70
                      ? "🎉 Great fit! Your resume aligns very well with this job."
                      : matchData.matchPercentage >= 40
                      ? "⚡ Good fit, but you have a few notable skill gaps."
                      : "💡 Consider polishing your resume or adding missing skills to improve alignment."}
                  </p>
                </div>
              </div>
            </div>

            {/* Badges of matches & gaps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-200/60">
              <div>
                <p className="text-xs font-semibold text-green-700 mb-2 flex items-center gap-1">
                  <span>✓</span> Shared Matching Skills
                </p>
                {matchData.matchedSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {matchData.matchedSkills.map(skill => (
                      <span key={skill} className="text-xs text-green-700 bg-green-50 border border-green-200/50 px-2.5 py-0.5 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No exact technical skill matches identified.</p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold text-orange-700 mb-2 flex items-center gap-1">
                  <span>⚠</span> Missing Skills / Gaps
                </p>
                {matchData.missingSkills?.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {matchData.missingSkills.map(skill => (
                      <span key={skill} className="text-xs text-orange-700 bg-orange-50 border border-orange-200/50 px-2.5 py-0.5 rounded-full font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No skill gaps identified. Perfect match!</p>
                )}
              </div>
            </div>
          </div>
        ) : null
      ) : (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-amber-800">Want to see your Resume Match score?</h4>
            <p className="text-xs text-amber-700">
              Upload your resume on your Profile page to automatically evaluate alignment and find skill gaps for this job posting.
            </p>
          </div>
          <button
            onClick={() => navigate("/student/profile")}
            className="shrink-0 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 px-3.5 py-2 rounded-lg transition"
          >
            Upload Resume
          </button>
        </div>
      )}

      {/* Job Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Job Details</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">CTC</p>
            <p className="font-medium text-gray-900 mt-0.5">₹{job.ctc} LPA</p>
          </div>
          <div>
            <p className="text-gray-500">Job Type</p>
            <p className="font-medium text-gray-900 mt-0.5">{job.jobType}</p>
          </div>
          <div>
            <p className="text-gray-500">Location</p>
            <p className="font-medium text-gray-900 mt-0.5">
              {job.location?.join(", ") || "TBD"}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Sector</p>
            <p className="font-medium text-gray-900 mt-0.5">{job.sector}</p>
          </div>
          <div>
            <p className="text-gray-500">Application Deadline</p>
            <p className="font-medium text-red-600 mt-0.5">
              {new Date(job.applicationDeadline).toLocaleString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit", hour12: true
              })}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Drive Date</p>
            <p className="font-medium text-gray-900 mt-0.5">
              {job.driveDate
                ? new Date(job.driveDate).toLocaleString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit", hour12: true
                  })
                : "To be announced"}
            </p>
          </div>
          {job.bond > 0 && (
            <div>
              <p className="text-gray-500">Bond</p>
              <p className="font-medium text-gray-900 mt-0.5">{job.bond} year(s)</p>
            </div>
          )}
          {job.stipend > 0 && (
            <div>
              <p className="text-gray-500">Stipend</p>
              <p className="font-medium text-gray-900 mt-0.5">₹{job.stipend}/month</p>
            </div>
          )}
        </div>

        {job.jobDescription && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-500 text-sm mb-1">Job Description</p>
            <p className="text-sm text-gray-700">{job.jobDescription}</p>
          </div>
        )}
      </div>

      {/* Eligibility Criteria */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Eligibility Criteria</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Minimum CGPA</p>
            <p className="font-medium text-gray-900 mt-0.5">
              {job.eligibility?.minCgpa || 0}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Allowed Branches</p>
            <p className="font-medium text-gray-900 mt-0.5">
              {job.eligibility?.allowedBranches?.join(", ")}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Max Active Backlogs</p>
            <p className="font-medium text-gray-900 mt-0.5">
              {job.eligibility?.maxActiveBacklogs ?? 0}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Max Total Backlogs</p>
            <p className="font-medium text-gray-900 mt-0.5">
              {job.eligibility?.maxTotalBacklogs ?? 0}
            </p>
          </div>

          {/* 10th Marks */}
          {job.eligibility?.min10thMarks > 0 && (
            <div>
              <p className="text-gray-500">Min 10th Marks</p>
              <p className="font-medium text-gray-900 mt-0.5">
                {job.eligibility.min10thMarks}%
              </p>
            </div>
          )}

          {/* 12th Marks */}
          {job.eligibility?.min12thMarks > 0 && (
            <div>
              <p className="text-gray-500">Min 12th Marks</p>
              <p className="font-medium text-gray-900 mt-0.5">
                {job.eligibility.min12thMarks}%
              </p>
            </div>
          )}

          <div>
            <p className="text-gray-500">Placed Students Allowed</p>
            <p className="font-medium text-gray-900 mt-0.5">
              {job.eligibility?.allowPlaced ? "Yes" : "No"}
            </p>
          </div>
        </div>
      </div>

      {/* Selection Rounds */}
      {job.rounds?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Selection Rounds</h2>
          <div className="space-y-3">
            {job.rounds.map((round, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-indigo-700">{i + 1}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{round.name}</p>
                  {round.venue && (
                    <p className="text-xs text-gray-500 mt-0.5">📍 {round.venue}</p>
                  )}
                  {round.date && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      📅 {new Date(round.date).toLocaleString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit", hour12: true
                      })}
                    </p>
                  )}
                  {round.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{round.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}