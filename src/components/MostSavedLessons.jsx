import React from "react";

const MostSavedLessons = () => {
  const lessons = [
    {
      id: 1,
      title: "Focus Is the New Superpower",
      shortDescription:
        "In a world full of notifications and distractions, the ability to focus deeply is what separates successful people from the average.",
      thumbnail:
        "https://images.unsplash.com/photo-1617791160536-598cf32026fb?q=80&w=1064&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      savedCount: 214,
      tag: " Mindset",
    },
    {
      id: 2,
      title: "Stop Comparing Your Chapter 1 With Someone’s Chapter 20",
      shortDescription:
        "Social media only shows highlights. Growth happens quietly. Move at your own pace and stay consistent.",
      thumbnail:
        "https://images.unsplash.com/photo-1661233128763-5fab5eacf696?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      savedCount: 187,
      tag: " Growth",
    },
    {
      id: 3,
      title: "Your Digital Footprint Is Your Reputation",
      shortDescription:
        "What you post, like, and comment online can help or hurt your future career. Think long-term, not just viral.",
      thumbnail:
        "https://images.unsplash.com/photo-1585703791267-902b05aee54f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDN8fHxlbnwwfHx8fHw%3D",
      savedCount: 162,
      tag: " Digital Life",
    },
    {
      id: 4,
      title: "Learn Skills, Not Just Degrees",
      shortDescription:
        "The internet rewards people who can build, solve, and create. Skills compound faster than certificates.",
      thumbnail:
        "https://images.unsplash.com/photo-1535231540604-72e8fbaf8cdb?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      savedCount: 198,
      tag: " Career",
    },
    {
      id: 5,
      title: "Silence Is Also a Response",
      shortDescription:
        "You don’t need to react to everything online. Protecting your mental energy is a form of self-respect.",
      thumbnail:
        "https://images.unsplash.com/photo-1695370993551-8ac683cd6134?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8QnVpbGRpbmclMjBFbW90aW9uYWwlMjBSZXNpbGllbmNlfGVufDB8fDB8fHww",
      savedCount: 141,
      tag: " Mental Health",
    },
    {
      id: 6,
      title: "Consistency Beats Motivation",
      shortDescription:
        "Motivation comes and goes. Small actions done daily win in the long run — especially in the digital world.",
      thumbnail:
        "https://images.unsplash.com/photo-1740560052722-12abf8819817?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      savedCount: 173,
      tag: " Discipline",
    },
  ];

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
        {lessons.map((lesson) => (
          <div
            key={lesson.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={lesson.thumbnail}
                alt={lesson.title}
                className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Tag */}
              <span className="absolute top-4 left-4 px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
                {lesson.tag}
              </span>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                {lesson.title}
              </h3>

              <p className="text-gray-500 text-sm line-clamp-3">
                {lesson.shortDescription}
              </p>

              {/* Footer */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  ❤️ {lesson.savedCount} Saves
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
