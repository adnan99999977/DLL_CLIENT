import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingPage from "../../components/shared/LoadingPage";
import useAxios from "../../api/useAxios";

const ReportedLessons = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalData, setModalData] = useState(null);
  const axiosApi = useAxios();

  // Fetch reported lessons
  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axiosApi.get("/reported-lessons");
      setReports(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch reported lessons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const openModal = (lesson) => setModalData(lesson);
  const closeModal = () => setModalData(null);

  const handleDelete = async (lessonId) => {
    if (!window.confirm("Are you sure you want to delete this lesson?")) return;
    try {
      await axiosApi.delete(`/lessons/${lessonId}`);
      setReports((prev) => prev.filter((l) => l.lessonId !== lessonId));
      closeModal();
      alert("Lesson deleted");
    } catch (err) {
      console.error(err);
      alert("Failed to delete lesson");
    }
  };

  const handleIgnore = async (lessonId) => {
    try {
      await axiosApi.patch(`/lessonsReports/${lessonId}/ignore`);
      setReports((prev) => prev.filter((l) => l.lessonId !== lessonId));
      closeModal();
      alert("Reports ignored");
    } catch (err) {
      console.error(err);
      alert("Failed to ignore reports");
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen space-y-6">
      <h1 className="text-3xl font-bold text-center">🚨 Reported / Flagged Lessons</h1>

      {reports.length === 0 ? (
        <p className="text-center text-gray-500">No reported lessons found</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Lesson</th>
                <th className="px-6 py-3 text-center">Reports</th>
                <th className="px-6 py-3 text-center">Details</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((lesson) => (
                <motion.tr key={lesson.lessonId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <td className="px-6 py-4 font-medium">{lesson.lessonTitle}</td>
                  <td className="px-6 py-4 text-center text-red-600 font-bold">{lesson.count}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => openModal(lesson)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      View Reasons
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleIgnore(lesson.lessonId)}
                      className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.lessonId)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modalData && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <h2 className="text-xl font-bold mb-4">{modalData.lessonTitle}</h2>
              {modalData.reasons?.length === 0 ? (
                <p className="text-gray-500">No reasons found</p>
              ) : (
                <ul className="space-y-2 max-h-96 overflow-y-auto">
                  {modalData.reasons.map((r, idx) => (
                    <li key={idx} className="border p-2 rounded">
                      <p className="text-sm font-medium">{r.userEmail}</p>
                      <p className="text-xs text-gray-600">{r.reason}</p>
                    </li>
                  ))}
                </ul>
              )}
              <button onClick={closeModal} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportedLessons;
