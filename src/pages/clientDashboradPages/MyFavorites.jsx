import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Eye } from "lucide-react";
import useCurrentUserFav from "../../hooks/useCurrentUserFav";
import LoadingPage from "../../components/shared/LoadingPage";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../api/useAxios";

const MyFavorites = () => {
  const [categoryFilter, setCategoryFilter] = useState("");
  const [toneFilter, setToneFilter] = useState("");
  const { favorites, loading, error } = useCurrentUserFav();
  const axiosApi = useAxios();
  const filteredFavorites = favorites.filter((fav) => {
    return (
      (!categoryFilter || fav.lessonCategory === categoryFilter) &&
      (!toneFilter || fav.lessonTone === toneFilter)
    );
  });
   
  const handleDeleteFav = async (id) => {

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  });

  if (result.isConfirmed) {
    try {
      await axiosApi.delete(`/favorites/${id}`);
      Swal.fire({
        title: "Deleted!",
        text: "Your favorite lesson has been deleted.",
        icon: "success"
      });
      window.location.reload(); 
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete favorite.",
        icon: "error"
      });
    }
  }
};

  if (loading) return <LoadingPage />;

  if (error)
    return (
      <div className="text-center p-10 text-xl font-semibold text-red-600">
        Failed to load favorites
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <h1 className="text-4xl font-extrabold text-purple-800 mb-2">
          My Favorites ⭐
        </h1>
        <p className="text-gray-600">View your saved lessons in one place.</p>
      </motion.div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto flex flex-wrap gap-4 mb-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="">All Categories</option>
          <option>Personal Growth</option>
          <option>Career</option>
          <option>Mindset</option>
          <option>Relationships</option>
        </select>

        <select
          value={toneFilter}
          onChange={(e) => setToneFilter(e.target.value)}
          className="rounded-xl border p-3"
        >
          <option value="">All Tones</option>
          <option>Motivational</option>
          <option>Sad</option>
          <option>Realization</option>
          <option>Gratitude</option>
        </select>
      </div>

      {/* Table */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-purple-100 text-purple-800">
            <tr>
              <th className="px-6 py-3 text-left">Title</th>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-left">Tone</th>
              <th className="px-6 py-3 text-left">Added</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredFavorites.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No favorites found
                </td>
              </tr>
            ) : (
              filteredFavorites.map((fav) => (
                <tr key={fav._id} className="border-b hover:bg-purple-50">
                  <td className="px-6 py-4">{fav.lessonTitle}</td>
                  <td className="px-6 py-4">{fav.lessonCategory}</td>
                  <td className="px-6 py-4">{fav.lessonTone}</td>
                  <td className="px-6 py-4">
                    {new Date(fav.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 flex justify-center gap-4">
                    <button
                      onClick={() => handleDeleteFav(fav._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>

                    <Link
                      to={`/public-lessons-details/${fav.lessonId}`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      <Eye size={20} />
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyFavorites;
