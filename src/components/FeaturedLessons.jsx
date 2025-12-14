import React from "react";

// Static Featured Lessons Data
const lessons = [
  {
    title: "Boosting Creativity Through Daily Practices",
    description:
      "Creativity isn’t a talent reserved for a few—it’s a skill you can train. This lesson explores techniques like idea journaling, divergent thinking, curiosity exercises, and reducing mental clutter. With the right mindset and habits, you can unlock your inner creativity and generate better ideas in your work and life.",
    category: "Creativity",
    emotionalTone: "Encouraging",
    userImage:
      "https://images.unsplash.com/photo-1740560052722-12abf8819817?q=80&w=1170&auto=format&fit=crop",
    accessLevel: "Free",
    creatorName: "Sophia Rivera",
    creatorPhotoURL:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800",
  },
  {
    title: "Breaking Negative Thought Patterns",
    description:
      "Your thoughts shape your actions and identity. This lesson teaches cognitive reframing, pattern interruption, and grounding techniques to help break harmful thinking loops. By understanding how negative thoughts form and learning practical ways to shift them, you can build a healthier mindset and regain emotional control.",
    category: "Mental Wellness",
    emotionalTone: "Healing",
    userImage:
      "https://images.unsplash.com/photo-1579756423483-7ad1f01ece5c?q=80&w=1170&auto=format&fit=crop",
    accessLevel: "Free",
    creatorName: "Liam Carter",
    creatorPhotoURL:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800",
  },
  {
    title: "Developing Strong Communication Skills",
    description:
      "Effective communication opens doors. This lesson covers clarity of speech, active listening, confidence building, and audience awareness. Discover practical exercises that help you express ideas better, reduce misunderstandings, and improve personal as well as professional relationships.",
    category: "Skills Development",
    emotionalTone: "Practical",
    userImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1170&auto=format&fit=crop",
    accessLevel: "Premium",
    creatorName: "Emma Blake",
    creatorPhotoURL:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800",
  },
];

const FeaturedLessons = () => {
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
