import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import API from "../../api/axios";

export default function Queries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "Pending", "Resolved"

  const fetchQueries = async () => {
    setLoading(true);
    try {
      const res = await API.get("/admin/queries");
      setQueries(res.data.queries || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch student queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleResolve = async (id) => {
    try {
      const res = await API.patch(`/admin/queries/${id}/resolve`);
      toast.success(res.data.message || "Query resolved successfully");
      // Update local state
      setQueries(queries.map(q => q._id === id ? { ...q, status: "Resolved" } : q));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resolve query");
    }
  };

  const filteredQueries = queries.filter(q => {
    if (filter === "all") return true;
    return q.status === filter;
  });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Contact Queries</h1>
        <p className="text-gray-500 text-sm mt-1">
          Track and resolve queries/messages sent to the placement cell by students.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { key: "all", label: "All" },
          { key: "Pending", label: "Pending" },
          { key: "Resolved", label: "Resolved" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition
              ${filter === tab.key
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab.label} ({queries.filter(q => tab.key === "all" || q.status === tab.key).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500 text-sm">Loading queries...</div>
      ) : filteredQueries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-gray-500 text-sm">
          No queries found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredQueries.map((query) => (
            <div
              key={query._id}
              className={`bg-white rounded-xl border p-5 space-y-3 shadow-sm transition
                ${query.status === "Pending" ? "border-yellow-200 bg-yellow-50/10" : "border-gray-200"}`}
            >
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
                      ${query.category === "Resume Upload Issue" ? "bg-red-50 text-red-700 border border-red-100" :
                        query.category === "Job Application Error" ? "bg-orange-50 text-orange-700 border border-orange-100" :
                        query.category === "Eligibility Query" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                        "bg-gray-50 text-gray-700 border border-gray-100"}`}
                    >
                      {query.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                      ${query.status === "Pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : "bg-green-50 text-green-700 border border-green-200"}`}
                    >
                      {query.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base">{query.subject}</h3>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(query.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Sender Details */}
              <div className="text-xs text-gray-500 flex gap-4">
                <p><strong>From:</strong> {query.name}</p>
                <p><strong>Email:</strong> <a href={`mailto:${query.email}`} className="text-indigo-600 hover:underline">{query.email}</a></p>
              </div>

              {/* Message */}
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 border border-gray-100 whitespace-pre-wrap">
                {query.message}
              </p>

              {/* Actions */}
              {query.status === "Pending" && (
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => handleResolve(query._id)}
                    className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-indigo-700 transition"
                  >
                    Mark as Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
