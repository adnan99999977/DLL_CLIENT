import React from "react";

const TopContributors = () => {
  const contributors = [
    {
      id: 1,
      name: "Adnan Zaber",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGVyc29ufGVufDB8fDB8fHww",
      lessonsContributed: 42,
      badge: " Top Contributor",
    },
    {
      id: 2,
      name: "SarKhan",
      photo: "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
      lessonsContributed: 35,
      badge: "Consistent",
    },
    {
      id: 3,
      name: "John Doe",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
      lessonsContributed: 28,
      badge: " Rising Star",
    },
    {
      id: 4,
      name: "Alex Smith",
      photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDJ8fHBlcnNvbnxlbnwwfHwwfHx8MA%3D%3D",
      lessonsContributed: 21,
      badge: "Quality Creator",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Top Contributors
        </h2>
        <p className="text-gray-500 mt-2">
          Creators who made the biggest impact this week
        </p>
      </div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        {contributors.map((user) => (
          <div
            key={user.id}
            className="group bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 relative overflow-hidden"
          >
            {/* Gradient ring */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition" />

            {/* Avatar */}
            <div className="relative z-10 flex justify-center">
              <img
                src={user.photo}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-105 transition"
              />
            </div>

            {/* Info */}
            <div className="relative z-10 text-center mt-4">
              <h3 className="text-lg font-bold text-gray-800">
                {user.name}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {user.lessonsContributed} Lessons Published
              </p>

              {/* Badge */}
              <span className="inline-block mt-3 px-4 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow">
                {user.badge}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopContributors;
