import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  User,
  Star,
  Heart,
  BookOpen,
  Crown,
  Eye,
  Calendar,
  Mail,
  Edit2,
} from "lucide-react";
import useCurrentUser from "../../hooks/useCurrentUser";
import LoadingPage from "../../components/shared/LoadingPage";
import useAxios from "../../api/useAxios";

const Profile = () => {
  const axiosApi = useAxios();
  const { user, loading, error, lessons } = useCurrentUser();
  console.log(user);
  const [userData, setUserData] = useState(null);
  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhoto, setNewPhoto] = useState("");

  const fileInputRef = useRef(null);
  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  // Update userData when user or lessons change
  useEffect(() => {
    if (!user) return;

    setUserData({
      name: user.name,
      email: user.email,
      photoURL: user.photoURL,
      role: user.role || "user",
      isPremium: user.isPremium || false,
      joinedDate: user.createdAt ? new Date(user.createdAt) : new Date(),
      totalLessons: lessons?.length || 0,
      totalLikes: lessons?.reduce((a, l) => a + (l.likesCount || 0), 0) || 0,
      totalFavorites:
        lessons?.reduce((a, l) => a + (l.favoritesCount || 0), 0) || 0,
      totalViews: lessons?.reduce((a, l) => a + (l.viewsCount || 0), 0) || 0,
      lessons: lessons || [],
    });

    setNewName(user.name || "");
    setNewPhoto(user.photoURL || "");
  }, [user, lessons]);

  // Loading & error handling
  if (loading) return <LoadingPage />;
  if (error)
    return (
      <div className="text-center p-10 text-xl font-semibold text-red-600">
        Error: Failed to fetch user data.
      </div>
    );
  if (!userData)
    return (
      <div className="text-center p-10 text-xl font-semibold text-gray-600">
        Please log in to view your profile.
      </div>
    );

  const sortedLessons = [...userData.lessons].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Update name
  const handleNameUpdate = async () => {
    try {
      setUserData({ ...userData, name: newName });
      setEditName(false);
      await axiosApi.patch(`/users/${user._id}`, { userName: newName });
      alert("Name updated successfully!");
    } catch (err) {
      console.error("Failed to update name:", err);
      alert("Failed to update name");
    }
  };

  // Update photo
  const handlePhotoUpdate = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Image = reader.result;
      setNewPhoto(base64Image);
      setUserData({ ...userData, photoURL: base64Image });

      try {
        await axiosApi.patch(`/users/${user._id}`, { userImage: base64Image });
        alert("Photo updated successfully!");
      } catch (err) {
        console.error("Failed to update photo:", err);
        alert("Failed to update photo");
      }
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-6"
      >
        {/* Avatar */}
        <div className="relative group w-36 h-36 mx-auto">
          <img
            src={newPhoto || userData?.photoURL || "/default-avatar.png"}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
          />

          <div
            onClick={triggerFileSelect}
            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
          >
            <Edit2 className="text-white drop-shadow-md" size={24} />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpdate}
          />
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            {editName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="rounded-xl border p-2"
                />
                <button
                  onClick={handleNameUpdate}
                  className="bg-indigo-600 text-white px-3 py-1 rounded-xl"
                >
                  Save
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-gray-800">
                  {userData.name}
                </h1>
                <button onClick={() => setEditName(true)}>
                  <Edit2 size={16} className="text-indigo-600" />
                </button>
              </>
            )}

            {userData.isPremium ? (
              <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded-full">
                <Crown size={14} /> Premium
              </span>
            ) : (
              <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 text-xs rounded-full">
                Free
              </span>
            )}
          </div>

          <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1">
            <Mail size={14} /> {userData.email}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-gray-600">
            <span className="flex items-center gap-1">
              <User size={16} /> Role: {userData.role}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={16} /> Joined {formatDate(userData.joinedDate)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* STATS */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
      >
        <StatCard
          icon={<BookOpen />}
          label="Lessons"
          value={userData.totalLessons}
        />
        <StatCard icon={<Heart />} label="Likes" value={userData.totalLikes} />
        <StatCard
          icon={<Star />}
          label="Favorites"
          value={userData.totalFavorites}
        />
        <StatCard icon={<Eye />} label="Views" value={userData.totalViews} />
      </motion.div>

      {/* Lessons */}
      <div className="max-w-6xl mx-auto mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Your Public Lessons
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {sortedLessons.length > 0 ? (
            sortedLessons.map((lesson) => (
              <motion.div
                key={lesson._id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group"
              >
                <div className="relative">
                  <img
                    src={lesson.userImage || "/default-avatar.png"}
                    alt={lesson.title}
                    className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {lesson.category} • {lesson.emotionalTone}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-gray-400 text-sm">
                    <span className="flex items-center gap-1">
                      <Heart size={14} /> {lesson.likesCount || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} /> {lesson.viewsCount || 0}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-3 text-center py-10 text-gray-500">
              You haven't added any lessons yet!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl shadow-md p-5 text-center hover:shadow-lg transition">
    <div className="flex justify-center text-indigo-600 mb-2">{icon}</div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default Profile;
