import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineEye, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import useCurrentUser from "../../hooks/useCurrentUser";
import { Link, useNavigate } from "react-router-dom";
import LoadingPage from "../../components/shared/LoadingPage";
import Swal from "sweetalert2";
import useAxios from "../../api/useAxios";

const MyLessons = () => {
  const axiosApi = useAxios();
  const { user, loading, error, lessons } = useCurrentUser();
  const navigate = useNavigate();

  const toggleVisibility = async (id) => {
    try {
      const res = await axiosApi.patch(`/lessons/${id}/toggle-visibility`);
      if (res.data.modifiedCount > 0) {
        // Hard reload the page to reflect changes
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const toggleAccess = async (id) => {
    if (!user.isPremium) {
      navigate("/dashboard/pricing");
      return;
    }
    try {
      const res = await axiosApi.patch(`/lessons/${id}/toggle-access`);
      if (res.data.modifiedCount > 0) {
        // Hard reload the page to reflect changes
        window.location.reload();
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Stats
  const stats = {
    total: lessons.length,
    public: lessons.filter((l) => l.visibility === "Public").length,
    premium: lessons.filter((l) => l.accessLevel === "Premium").length,
    reactions: lessons.reduce((acc, l) => acc + (l.likesCount || 0), 0),
    favorites: lessons.reduce((acc, l) => acc + (l.favoritesCount || 0), 0),
  };

  const handleDeleteLesson = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axiosApi.delete(`/lessons/${id}`);
        Swal.fire({
          title: "Deleted!",
          text: "Your lesson has been deleted.",
          icon: "success",
        });
        window.location.reload();
      } catch (err) {
        console.error(err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete lesson.",
          icon: "error",
        });
      }
    }
  };

  if (loading)
    return (
      <div>
        <LoadingPage />
      </div>
    );
  if (error)
    return (
      <div className="text-center p-10 text-xl font-semibold text-red-600">
        Error: Failed to fetch user data.
      </div>
    );
  if (!user)
    return (
      <div className="text-center p-10 text-xl font-semibold text-gray-600">
        Please log in to view your profile.
      </div>
    );

  return (
    <>
      {lessons.length === 0 ? (
        <p className="text-gray-800 text-xl">No lesson add yet</p>
      ) : (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mb-2">
            My Lessons
          </h1>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Manage lessons, track stats, and spotlight premium content.
          </p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
            {[
              { title: "Total", value: stats.total, color: "text-indigo-600" },
              { title: "Public", value: stats.public, color: "text-green-600" },
              {
                title: "Premium",
                value: stats.premium,
                color: "text-purple-600",
              },
              {
                title: "Reactions",
                value: stats.reactions,
                color: "text-yellow-600",
              },
              {
                title: "Favorites",
                value: stats.favorites,
                color: "text-pink-600",
              },
            ].map((s, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-xl p-3 sm:p-4 shadow-md flex flex-col items-start justify-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 150 }}
              >
                <p className="text-xs sm:text-sm text-gray-500">{s.title}</p>
                <p className={`text-xl sm:text-2xl font-bold ${s.color}`}>
                  {s.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Lessons Table */}
          <div className=" mt-10  shadow-lg ">
            <table className="min-w-full cursor-pointer text-left table-auto">
              <thead className="bg-blue-100">
                <tr>
                  <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                    Title
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                    Category
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                    Access
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                    Visibility
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                    ReviewStatus
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                    Created
                  </th>
                  <th className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {lessons.map((lesson) => (
                    <motion.tr
                      key={lesson._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      whileHover={{ scale: 1.02, backgroundColor: "#f0f5ff" }}
                      className="border-b  last:border-0 text-xs sm:text-sm"
                    >
                      <td className="px-3 sm:px-4 py-2 font-semibold">
                        {lesson.title}
                      </td>
                      <td className="px-3 sm:px-4 py-2 text-gray-600">
                        {lesson.category}
                      </td>
                      <td className="px-3 sm:px-4 py-2">
                        <span
                          onClick={() => toggleAccess(lesson._id)}
                          className={`cursor-pointer px-2 py-1 rounded-full text-white font-semibold text-xs sm:text-sm ${
                            lesson.accessLevel === "Premium"
                              ? "bg-purple-600"
                              : "bg-blue-600"
                          }`}
                        >
                          {lesson.accessLevel}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2">
                        <span
                          onClick={() => toggleVisibility(lesson._id)}
                          className={`cursor-pointer px-2 py-1 rounded-full font-semibold text-xs sm:text-sm ${
                            lesson.visibility === "Public"
                              ? "bg-green-600 text-white"
                              : "bg-blue-400 text-white"
                          }`}
                        >
                          {lesson.visibility}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-2">
                        <span
                          className={`cursor-pointer px-2 py-1 rounded-full font-semibold text-xs sm:text-sm ${
                            lesson.reviewStatus === "pending"
                              ? "bg-yellow-600 text-white"
                              : "bg-green-400 text-white"
                          }`}
                        >
                          {lesson.reviewStatus}
                        </span>
                      </td>

                      <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                        <p>{formatDateTime(lesson.createdAt)}</p>
                      </td>
                      <td className="px-3 sm:px-4 py-2 flex gap-2 text-xs sm:text-sm">
                        <Link to={`/public-lessons-details/${lesson._id}`}>
                          <motion.div whileHover={{ scale: 1.2 }}>
                            <HiOutlineEye className="cursor-pointer text-gray-600" />
                          </motion.div>
                        </Link>

                        <Link to={`/dashboard/update-lesson/${lesson._id}`}>
                          <motion.div whileHover={{ scale: 1.2 }}>
                            <HiOutlinePencil className="cursor-pointer text-indigo-600" />
                          </motion.div>
                        </Link>

                        <motion.div whileHover={{ scale: 1.2 }}>
                          <HiOutlineTrash
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDeleteLesson(lesson._id)}
                          />
                        </motion.div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default MyLessons;
