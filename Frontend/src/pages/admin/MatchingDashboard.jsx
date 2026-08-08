import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import API from "../../api/axios";
import ResumeViewer from "../../components/ResumeViewer";

export default function MatchingDashboard() {
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [viewingResume, setViewingResume] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await API.get("/admin/jobs");
      const activeJobs = res.data.data || [];
      setJobs(activeJobs);
      if (activeJobs.length > 0) {
        setSelectedJobId(activeJobs[0]._id);
        setSelectedJob(activeJobs[0]);
      }
    } catch (err) {
      toast.error("Failed to load jobs");
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleJobChange = (e) => {
    const id = e.target.value;
    setSelectedJobId(id);
    setSelectedJob(jobs.find(j => j._id === id));
    setCandidates([]);
  };

  const runEvaluation = async () => {
    if (!selectedJobId) return;
    setEvaluating(true);
    try {
      const res = await API.post(`/matching/evaluate/${selectedJobId}`);
      setCandidates(res.data.results || []);
      toast.success("Matching evaluation complete!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to evaluate candidates");
    } finally {
      setEvaluating(false);
    }
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 75) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Semantic Resume Matcher</h1>
        <p className="text-gray-500 text-sm mt-1">
          Select a job posting to run the matching engine and rank students based on their resume alignments.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Selector and JD Details */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4 shadow-sm">
            <h2 className="font-semibold text-gray-900 text-base">Select Position</h2>
            
            {loadingJobs ? (
              <p className="text-sm text-gray-500">Loading jobs...</p>
            ) : jobs.length === 0 ? (
              <p className="text-sm text-gray-500">No active jobs found. Post a job first!</p>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Company & Role</label>
                  <select
                    value={selectedJobId}
                    onChange={handleJobChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {jobs.map((job) => (
                      <option key={job._id} value={job._id}>
                        {job.companyName} — {job.jobRole}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedJob && (
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <p className="text-xs text-gray-500"><strong>CTC:</strong> ₹{selectedJob.ctc} LPA</p>
                    <p className="text-xs text-gray-500"><strong>Sector:</strong> {selectedJob.sector}</p>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-semibold">Job Description Preview:</p>
                      <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2.5 max-h-40 overflow-y-auto border border-gray-100 whitespace-pre-wrap">
                        {selectedJob.jobDescription || "No job description configured."}
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={runEvaluation}
                  disabled={evaluating || !selectedJobId}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg text-sm transition disabled:opacity-50"
                >
                  {evaluating ? "Evaluating Resumes..." : "🔍 Match Resumes"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Ranked Candidates */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm min-h-[300px] flex flex-col">
            <h2 className="font-semibold text-gray-900 text-base mb-4">Ranked Candidates</h2>

            {evaluating ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-3">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-gray-500 font-medium">Running semantic parsing & overlap analysis...</p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-center text-gray-400">
                <span className="text-4xl mb-2">📄</span>
                <p className="text-sm">Click "Match Resumes" on the left to evaluate student matches.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-xs text-gray-500 font-medium">
                  Found {candidates.length} candidate(s) evaluated
                </div>
                <div className="divide-y divide-gray-100">
                  {candidates.map((candidate, idx) => (
                    <div key={candidate.studentId} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      {/* Left: Rank & Basic Details */}
                      <div className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-gray-600">#{idx + 1}</span>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-900 text-sm">{candidate.name}</h3>
                          <div className="text-xs text-gray-500 flex flex-wrap gap-x-3 gap-y-1">
                            <span className="font-medium text-indigo-600">{candidate.branch}</span>
                            <span>Roll: {candidate.rollNo}</span>
                            <span>CGPA: {candidate.cgpa || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Skills & Missing gaps */}
                      <div className="flex-1 min-w-0 space-y-1.5 sm:px-4">
                        {candidate.matchedSkills?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[10px] font-semibold text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 shrink-0">Matches:</span>
                            {candidate.matchedSkills.slice(0, 4).map(s => (
                              <span key={s} className="text-[10px] text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">{s}</span>
                            ))}
                            {candidate.matchedSkills.length > 4 && (
                              <span className="text-[10px] text-gray-400">+{candidate.matchedSkills.length - 4} more</span>
                            )}
                          </div>
                        )}
                        {candidate.missingSkills?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100 shrink-0">Gaps:</span>
                            {candidate.missingSkills.slice(0, 4).map(s => (
                              <span key={s} className="text-[10px] text-orange-600/80 bg-orange-50/50 px-1.5 py-0.5 rounded border border-orange-100/30">{s}</span>
                            ))}
                            {candidate.missingSkills.length > 4 && (
                              <span className="text-[10px] text-gray-400">+{candidate.missingSkills.length - 4} more</span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Right: Score & View button */}
                      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                        <div className={`px-3 py-1 rounded-lg text-sm font-bold border ${getScoreBadgeColor(candidate.matchPercentage)}`}>
                          {candidate.matchPercentage}% Match
                        </div>
                        
                        {candidate.studentId && (
                          <button
                            onClick={() => {
                              // Reconstruct the resume URL path correctly from standard uploads
                              // Student profile has resumeUrl
                              API.get(`/admin/students/${candidate.studentId}`).then(res => {
                                if (res.data.data?.resumeUrl) {
                                  setViewingResume(res.data.data.resumeUrl);
                                } else {
                                  toast.error("No resume file uploaded for this student.");
                                }
                              }).catch(() => {
                                toast.error("Failed to load resume details.");
                              });
                            }}
                            className="text-xs text-indigo-600 hover:underline font-semibold"
                          >
                            View Resume
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {viewingResume && (
        <ResumeViewer url={viewingResume} onClose={() => setViewingResume(null)} />
      )}
    </div>
  );
}
