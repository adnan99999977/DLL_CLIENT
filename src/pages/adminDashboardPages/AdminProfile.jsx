import React, { useEffect, useState, useRef } from "react";
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
import useDbData from "../../hooks/useDbData";
import LoadingPage from "../../components/shared/LoadingPage";
import useAxios from "../../api/useAxios";
import { Filler } from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Filler);


const AdminProfile = () => {
  const { user, loading, error } = useCurrentUser();
  const { dbUser, reports, lessons } = useDbData();

  const [userData, setUserData] = useState({
    name: "Admin",
    email: "admin@example.com",
    photoURL: "/default-avatar.png",
    role: "Admin",
    stats: {
      totalUsers: 0,
      totalLessons: 0,
      flaggedLessons: 0,
    },
  });

  const [editName, setEditName] = useState(false);
  const [newName, setNewName] = useState(userData.name);
  const [newPhoto, setNewPhoto] = useState(userData.photoURL);
  const fileInputRef = useRef(null);
  const triggerFileSelect = () => fileInputRef.current.click();
          const axiosApi = useAxios();


  useEffect(() => {
    if (!user) return;

    setUserData({
      name: user.userName || "Admin",
      email: user.email,
      photoURL: user.photoURL || "/default-avatar.png",
      role: "Admin",
      stats: {
        totalUsers: dbUser?.length || 0,
        totalLessons: lessons?.length || 0,
        flaggedLessons: reports?.length || 0,
      },
    });

    setNewName(user.userName || "Admin");
    setNewPhoto(user.photoURL || "/default-avatar.png");
  }, [user, dbUser, lessons, reports]);

  if (loading) return <LoadingPage />;
  if (error)
    return (
      <div className="text-center py-20 text-red-500">
        Failed to load admin data
      </div>
    );

  const handleNameUpdate = async () => {

    try {
      setUserData({ ...userData, name: newName });
      setEditName(false);

      await axiosApi.patch(`/users/${user._id}`, { userName: newName });
      alert("Name updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update name");
    }
  };

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
        console.error(err);
        alert("Failed to update photo");
      }
    };
    reader.readAsDataURL(file);
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-6 flex flex-col md:flex-row items-center gap-8"
      >
        {/* Avatar */}
        <div className="relative group w-40 h-40 mx-auto">
          <img
            src={newPhoto}
            alt="Admin"
            className="w-full h-full rounded-full border-4 border-blue-500 shadow-lg object-cover"
          />
          <div
            onClick={triggerFileSelect}
            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <Edit2 className="text-white" size={24} />
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
                  className="bg-blue-600 text-white px-3 py-1 rounded-xl"
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
                  <Edit2 size={16} className="text-blue-600" />
                </button>
              </>
            )}
            <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 text-xs rounded-full">
              <Crown size={14} /> Admin
            </span>
          </div>
          <p className="text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-1">
            <Mail size={14} /> {userData.email}
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-4 text-gray-600">
            <span className="flex items-center gap-1">
              <User size={16} /> Role: {userData.role}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-6 mt-8"
      >
        <StatCard
          icon={<User />}
          label="Total Users"
          value={userData.stats.totalUsers}
        />
        <StatCard
          icon={<BookOpen />}
          label="Total Lessons"
          value={userData.stats.totalLessons}
        />
        <StatCard
          icon={<Star />}
          label="Flagged Lessons"
          value={userData.stats.flaggedLessons}
        />
      </motion.div>

      {/* Recent Lessons */}
      <div className="max-w-5xl mx-auto mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
         All Lessons
        </h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {lessons && lessons.length > 0 ? (
            lessons.map((lesson) => (
              <motion.div
                key={lesson._id}
                whileHover={{ scale: 1.05 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group"
              >
                <img
                  src={lesson.userImage}
                  alt={lesson.title}
                  className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-1">
                    {lesson.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {lesson.category} • {lesson.emotionalTone}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="col-span-3 text-center py-10 text-gray-500">
              No lessons added yet!
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl shadow-md p-5 text-center hover:shadow-lg transition">
    <div className="flex justify-center text-blue-600 mb-2">{icon}</div>
    <p className="text-2xl font-bold text-gray-800">{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default AdminProfile;
