import React from "react";
import useCurrentUserFav from "../hooks/useCurrentUserFav";
import { all } from "axios";
import { Bookmark } from "lucide-react";

const MostSavedLessons = () => {
  const { allFavorites, loading } = useCurrentUserFav();

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!allFavorites || allFavorites.length === 0)
    return <p className="text-center py-10">No favorites found.</p>;

  // Aggregate lessons by lessonId to get saved count
  const lessonMap = {};
  allFavorites.forEach((fav) => {
    const id = fav.lessonId;
    if (!lessonMap[id]) {
      lessonMap[id] = {
        _id: id,
        title: fav.lessonTitle,
        category: fav.lessonCategory,
        tone: fav.lessonTone,
        userImage: fav.lessonImage || "https://via.placeholder.com/400x200",
        savedCount: 1,
      };
    } else {
      lessonMap[id].savedCount += 1;
    }
  });

  // Convert to array & sort by savedCount desc
  const lessonsArray = Object.values(lessonMap).sort(
    (a, b) => b.savedCount - a.savedCount
  );

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Most Saved Lessons
        </h2>
        <p className="text-gray-500 mt-2">
          Lessons learners loved and saved the most
        </p>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-3 gap-8">
        {lessonsArray.map((lesson) => (
          <div
            key={lesson._id}
            className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={lesson.userImage}
                alt={lesson.title}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Category Tag */}
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
                {lesson.category}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {lesson.title}
              </h3>

              <span className="text-white font-semibold inline  bg-blue-400 text-sm p-1 rounded-full line-clamp-3">
                {lesson.tone}
              </span>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm flex gap-3 text-gray-700">
                  <Bookmark className="size-5" />
                  {lesson.savedCount} Saves
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MostSavedLessons;
