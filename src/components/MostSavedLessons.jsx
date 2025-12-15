import React from "react";
import useCurrentUserFav from "../hooks/useCurrentUserFav";
import { Bookmark } from "lucide-react";

const STATIC_LESSONS = [
  {
    _id: "static-1",
    title: "Building Daily Habits That Stick",
    category: "Self Growth",
    tone: "Motivational",
    userImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe",
    savedCount: 120,
  },
  {
    _id: "static-2",
    title: "Managing Stress in a Fast-Paced World",
    category: "Mental Health",
    tone: "Calm",
    userImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    savedCount: 98,
  },
  {
    _id: "static-3",
    title: "Effective Communication for Real Life",
    category: "Life Skills",
    tone: "Practical",
    userImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    savedCount: 75,
  },
];

const MostSavedLessons = () => {
  const { allFavorites } = useCurrentUserFav();

  let lessonsArray = [];

  if (Array.isArray(allFavorites) && allFavorites.length > 0) {
    const lessonMap = {};

    allFavorites.forEach((fav) => {
      const id = fav.lessonId;
      if (!lessonMap[id]) {
        lessonMap[id] = {
          _id: id,
          title: fav.lessonTitle,
          category: fav.lessonCategory,
          tone: fav.lessonTone,
          userImage:
            fav.lessonImage || "https://via.placeholder.com/400x200",
          savedCount: 1,
        };
      } else {
        lessonMap[id].savedCount += 1;
      }
    });

    lessonsArray = Object.values(lessonMap).sort(
      (a, b) => b.savedCount - a.savedCount
    );
  } else {
    lessonsArray = STATIC_LESSONS;
  }

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Most Saved Lessons
        </h2>
        <p className="text-gray-500 mt-2">
          Lessons learners loved and saved the most
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {lessonsArray.slice(0, 3).map((lesson) => (
          <div
            key={lesson._id}
            className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative">
              <img
                src={lesson.userImage}
                alt={lesson.title}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
                {lesson.category}
              </span>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {lesson.title}
              </h3>

              <span className="text-white font-semibold inline bg-blue-400 text-sm px-2 py-1 rounded-full">
                {lesson.tone}
              </span>

              <div className="mt-4 flex items-center gap-2 text-gray-700">
                <Bookmark className="size-5" />
                {lesson.savedCount} Saves
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MostSavedLessons;
