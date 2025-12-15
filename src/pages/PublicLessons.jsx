import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import useCurrentUser from "../hooks/useCurrentUser";
import LoadingPage from "../components/shared/LoadingPage";
import useAxios from "../api/useAxios";

const PublicLessons = () => {
  const axiosApi = useAxios();
  const { user } = useCurrentUser();

  // ----- Hooks at the top -----
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [toneFilter, setToneFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 8;

  const {
    data: lessons = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await axiosApi.get("/lessons");
      return res.data;
    },
  });

  // ----- Memoized filtered + sorted lessons -----
  const filteredLessons = useMemo(() => {
    return lessons
      .filter((l) => l.visibility !== "Private")
      .filter(
        (l) =>
          (categoryFilter === "All" || l.category === categoryFilter) &&
          (toneFilter === "All" || l.emotionalTone === toneFilter) &&
          l.title.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortOption === "Newest")
          return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortOption === "Most Saved")
          return (b.savedCount || 0) - (a.savedCount || 0);
        return 0;
      });
  }, [lessons, search, categoryFilter, toneFilter, sortOption]);

  // Get unique categories & tones
  const categories = useMemo(
    () => ["All", ...new Set(lessons.map((l) => l.category))],
    [lessons]
  );
  const tones = useMemo(
    () => ["All", ...new Set(lessons.map((l) => l.emotionalTone))],
    [lessons]
  );

  // ----- Pagination calculation -----
  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);
  const paginatedLessons = filteredLessons.slice(
    (currentPage - 1) * lessonsPerPage,
    currentPage * lessonsPerPage
  );

  // ----- Early returns -----
  if (isLoading) return <LoadingPage />;
  if (isError) return <div>Error loading lessons</div>;

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6 text-center">
        Explore Life Lessons
      </h1>

      {/* Search + Filters + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
        <input
          type="text"
          placeholder="Search by title..."
          className="px-4 py-2 border rounded-lg flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 border rounded-lg"
          value={toneFilter}
          onChange={(e) => setToneFilter(e.target.value)}
        >
          {tones.map((tone) => (
            <option key={tone} value={tone}>
              {tone}
            </option>
          ))}
        </select>

        <select
          className="px-4 py-2 border rounded-lg"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="Newest">Newest</option>
          <option value="Most Saved">Most Saved</option>
        </select>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {paginatedLessons.map((lesson) => {
          const isLocked =
            lesson.accessLevel === "Premium" && !user?.isPremium;

          return (
            <div
              key={lesson._id}
              className="relative flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
            >
              {/* 🔒 LOCK OVERLAY (UI ONLY) */}
              {isLocked && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 text-white text-center px-4">
                  <Lock size={36} className="mb-2" />
                  <p className="text-sm font-semibold">
                    Premium Content
                  </p>
                  <p className="text-xs opacity-90 mt-1">
                    Upgrade to unlock this lesson
                  </p>
                </div>
              )}

              <div
                className={`w-full h-44 overflow-hidden ${
                  isLocked ? "filter blur-sm brightness-75" : ""
                }`}
              >
                {lesson.userImage ? (
                  <img
                    src={lesson.userImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-semibold">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between">
                <h2
                  className={`font-semibold text-lg text-gray-800 mb-2 cursor-pointer hover:text-blue-600 ${
                    isLocked
                      ? "cursor-not-allowed blur-sm brightness-75"
                      : ""
                  }`}
                >
                  {lesson.title}
                </h2>
                <p
                  className={`text-gray-500 text-sm mb-3 ${
                    isLocked ? "blur-sm brightness-75" : ""
                  }`}
                >
                  {lesson.description.slice(0, 100)}...
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {lesson.category}
                  </span>
                  {lesson.accessLevel === "Premium" && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                      <Lock size={14} /> Premium
                    </span>
                  )}
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={lesson.creatorPhotoURL || "/default-avatar.png"}
                      alt={lesson.creatorName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-600 text-sm">
                      {lesson.creatorName}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {isLocked ? (
                  <Link to="/dashboard/pricing">
                    <button className="w-full py-2 rounded-xl font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition-colors">
                      Upgrade to Premium
                    </button>
                  </Link>
                ) : (
                  <Link to={`/public-lessons-details/${lesson._id}`}>
                    <button className="w-full py-2 rounded-xl font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors">
                      See Details
                    </button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg border ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicLessons;
