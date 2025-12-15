import React from "react";
import { motion } from "framer-motion";
import { Calendar, User, ChevronRight } from "lucide-react";
import useDbData from "../../hooks/useDbData";
import { Link } from "react-router-dom";

export default function PrivetLessons() {
  const { lessons, formatDateTime } = useDbData();
  const filteredLessons = lessons.filter(
    (lesson) => lesson.visibility === "Private"
  );
  return (
    <div className="min-h-screen  p-10 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-6xl"
      >
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4 tracking-tight">
          Private Lessons
        </h1>
        <p className="text-gray-600 text-lg mb-10">
          Beautiful, modern, professional lesson cards with images and clean
          layout.
        </p>

        {filteredLessons?.length === 0 ? (
          <p className="text-gray-600 text-lg mb-10">
            No added lesson at privet section yet
          </p>
        ) : (
          <div className="grid md:grid-cols-3  gap-10">
            {filteredLessons.map((lesson, i) => (
              <motion.div
                key={lesson._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl  overflow-hidden group cursor-pointer border border-gray-200"
              >
                <div className="h-40 w-full overflow-hidden">
                  <img
                    src={lesson.userImage}
                    alt={lesson.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition-all duration-500"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">
                    {lesson.title}
                  </h2>
                  <p className="text-sm text-indigo-600 font-medium mb-1">
                    {lesson.category}
                  </p>

                  <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {lesson.description}
                  </p>

                  <div className="flex flex-col items-center justify-between text-gray-500 text-sm mt-3">
                    <div className="flex items-center gap-2">
                      <User size={16} /> {lesson.creatorName}
                    </div>
                    <div className="flex text-sm items-center gap-2">
                      <Calendar size={16} />
                      {formatDateTime(lesson.createdAt)}
                    </div>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Link
                      to={`/public-lessons-details/${lesson._id}`}
                      className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium flex items-center gap-2 hover:bg-gray-700 transition"
                    >
                      See Details <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
