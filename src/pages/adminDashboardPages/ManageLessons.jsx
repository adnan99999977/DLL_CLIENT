import React, { useEffect, useState } from "react";
import LoadingPage from "../../components/shared/LoadingPage";
import useAxios from "../../api/useAxios";
import Swal from "sweetalert2";

const ManageLessons = () => {
  const axiosApi = useAxios();
  const [lessons, setLessons] = useState([]);
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [visibilityFilter, setVisibilityFilter] = useState("All");
  const [flaggedFilter, setFlaggedFilter] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    public: 0,
    private: 0,
    flagged: 0,
  });

  // Fetch all lessons
  const fetchLessons = async () => {
    try {
      const res = await axiosApi.get("/lessons");
      setLessons(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  // Filter lessons whenever filter changes
  useEffect(() => {
    let temp = [...lessons];

    if (categoryFilter !== "All") {
      temp = temp.filter((l) => l.category === categoryFilter);
    }
    if (visibilityFilter !== "All") {
      temp = temp.filter((l) => l.visibility === visibilityFilter);
    }
    if (flaggedFilter) {
      temp = temp.filter((l) => l.reportsCount > 0);
    }

    setFilteredLessons(temp);

    // Update stats
    const publicCount = lessons.filter((l) => l.visibility === "Public").length;
    const privateCount = lessons.filter((l) => l.visibility === "Private").length;
    const flaggedCount = lessons.filter((l) => l.reportsCount > 0).length;

    setStats({ public: publicCount, private: privateCount, flagged: flaggedCount });
  }, [lessons, categoryFilter, visibilityFilter, flaggedFilter]);

  // Delete lesson
  const deleteLesson = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the lesson.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axiosApi.delete(`/lessons/${id}`);
        setLessons(lessons.filter((l) => l._id !== id));
        Swal.fire("Deleted!", "Lesson has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete lesson", "error");
      }
    }
  };

  // Toggle featured
  const toggleFeatured = async (lesson) => {
    try {
      const updatedLesson = { ...lesson, featured: !lesson.featured };
      await axiosApi.patch(`/lessons/${lesson._id}`, { featured: updatedLesson.featured });
      setLessons(
        lessons.map((l) => (l._id === lesson._id ? updatedLesson : l))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Mark as reviewed
  const toggleReviewed = async (lesson) => {
    try {
      const updatedLesson = { ...lesson, reviewed: !lesson.reviewed };
      await axiosApi.patch(`/lessons/${lesson._id}`, { reviewed: updatedLesson.reviewed });
      setLessons(
        lessons.map((l) => (l._id === lesson._id ? updatedLesson : l))
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-6">
        Manage Lessons
      </h1>

      {/* Stats */}
      <div className="flex gap-4 mb-6 justify-center">
        <div className="px-4 py-2 bg-green-100 rounded">Public: {stats.public}</div>
        <div className="px-4 py-2 bg-yellow-100 rounded">Private: {stats.private}</div>
        <div className="px-4 py-2 bg-red-100 rounded">Flagged: {stats.flagged}</div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 justify-center">
        <select
          className="border px-3 py-1 rounded"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Motivation">Motivation</option>
          <option value="Education">Education</option>
          <option value="Health">Health</option>
          {/* add other categories as needed */}
        </select>

        <select
          className="border px-3 py-1 rounded"
          value={visibilityFilter}
          onChange={(e) => setVisibilityFilter(e.target.value)}
        >
          <option value="All">All Visibility</option>
          <option value="Public">Public</option>
          <option value="Private">Private</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={flaggedFilter}
            onChange={(e) => setFlaggedFilter(e.target.checked)}
          />
          Show Flagged Only
        </label>
      </div>

      {/* Lessons Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Visibility</th>
              <th className="px-4 py-2 text-left">Featured</th>
              <th className="px-4 py-2 text-left">Reviewed</th>
              <th className="px-4 py-2 text-left">Reports</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredLessons.length > 0 ? (
              filteredLessons.map((lesson) => (
                <tr key={lesson._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2">{lesson.title}</td>
                  <td className="px-4 py-2">{lesson.category}</td>
                  <td className="px-4 py-2">{lesson.visibility || "Public"}</td>
                  <td className="px-4 py-2">
                    <button
                      className={`px-2 py-1 rounded ${
                        lesson.featured ? "bg-yellow-500 text-white" : "bg-gray-200"
                      }`}
                      onClick={() => toggleFeatured(lesson)}
                    >
                      {lesson.featured ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      className={`px-2 py-1 rounded ${
                        lesson.reviewed ? "bg-green-500 text-white" : "bg-gray-200"
                      }`}
                      onClick={() => toggleReviewed(lesson)}
                    >
                      {lesson.reviewed ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="px-4 py-2">{lesson.reportsCount || 0}</td>
                  <td className="px-4 py-2 text-center flex gap-2 justify-center">
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => deleteLesson(lesson._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No lessons found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageLessons;
