import React, { useEffect, useState } from "react";
import useAxios from "../api/useAxios";

const FeaturedLessons = () => {
  const [lessons, setLessons] = useState([]);
  const axiosApi = useAxios();

  useEffect(() => {
    axiosApi
      .get("/featured-lessons")
      .then((res) => setLessons(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Featured Life Lessons
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
              <img
                src={lesson.userImage}
                alt={lesson.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                {lesson.category}
              </span>
              {lesson.accessLevel === "Premium" && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-gray-800 text-xs font-semibold px-2 py-1 rounded">
                  Premium
                </span>
              )}
            </div>

            <h3 className="text-xl font-semibold mb-2">{lesson.title}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-4">
              {lesson.description}
            </p>

            <div className="flex items-center gap-3">
              <img
                src={lesson.creatorPhotoURL}
                alt={lesson.creatorName}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="text-gray-700 text-sm font-medium">
                {lesson.creatorName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedLessons;
