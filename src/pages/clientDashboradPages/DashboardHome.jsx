import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  BookOpen,
  PlusCircle,
  TrendingUp,
  Star,
  Grid,
  Bookmark,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import LoadingPage from "../../components/shared/LoadingPage";
import { Link } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";
import { AuthContext } from "../../auth/AuthContext";
import useCurrentUserFav from "../../hooks/useCurrentUserFav";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const DashboardHome = () => {
  const [chartView, setChartView] = useState("weekly");
  const { loading, lessons } = useCurrentUser();
  const { user } = useContext(AuthContext);
  const { favorites } = useCurrentUserFav();

  const stats = {
    totalLessons: lessons.length,
    totalFavorites: lessons.reduce(
      (acc, l) => acc + (l.favoritesCount || 0),
      0
    ),
    totalReactions: lessons.reduce((acc, l) => acc + (l.likesCount || 0), 0),
    totalViews: lessons.reduce((acc, l) => acc + (l.viewsCount || 0), 0),
    weeklyData: Array(7).fill(0),
    monthlyData: Array(4).fill(0),
    recentLessons: lessons.slice(-3).reverse(),
  };

  const now = new Date();
  lessons.forEach((lesson) => {
    const created = new Date(lesson.createdAt);
    const dayDiff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    const weekDiff = Math.floor(dayDiff / 7);
    if (dayDiff < 7) stats.weeklyData[6 - dayDiff] += 1;
    if (weekDiff < 4) stats.monthlyData[3 - weekDiff] += 1;
  });

  favorites?.forEach((fav) => {
  const created = new Date(fav.createdAt);
  const dayDiff = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  const weekDiff = Math.floor(dayDiff / 7);
  if (dayDiff < 7) stats.weeklyDataFavorites[6 - dayDiff] += 1;
  if (weekDiff < 4) stats.monthlyDataFavorites[3 - weekDiff] += 1;
});

  // ===== CHART DATA =====
  const chartData =
    chartView === "weekly"
      ? {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Lessons Added",
              data: stats.weeklyData,
              backgroundColor: "#8b5cf6",
              borderRadius: 10,
            },
          ],
        }
      : {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              label: "Lessons Added",
              data: stats.monthlyData,
              backgroundColor: "#7c3aed",
              borderRadius: 10,
            },
          ],
        };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text:
          chartView === "weekly"
            ? "Weekly Lesson Activity"
            : "Monthly Lesson Activity",
        font: { size: 16 },
      },
    },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
  };

  if (loading) {
    return (
      <div>
        <LoadingPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mb-10"
      >
        <h1 className="text-4xl font-extrabold text-purple-800">
          Welcome Back,{lessons[0]?.creatorName || user.displayName}! 🚀
        </h1>
        <p className="text-gray-600 mt-2">
          Track your lessons, favorites, premium content, and growth.
        </p>
      </motion.div>

      {/* STATS + QUICK ACTIONS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-5 gap-6 mb-12"
      >
        <StatCard
          icon={<BookOpen size={20} />}
          label="Total Lessons"
          value={lessons.length}
          color="from-indigo-500 to-purple-500"
        />
        <StatCard
          icon={<Heart size={20} />}
          label="Favorites"
          value={favorites?.length || 0}
          color="from-pink-500 to-rose-500"
        />

        {/* Quick Action Cards */}
        <Link to={"/dashboard/add-lesson"}>
          <QuickAction
            icon={<PlusCircle size={28} />}
            title="Create New"
            subtitle="Add a lesson"
            bgColor="from-purple-400 to-purple-600"
          />
        </Link>
        <Link to={"/dashboard/my-favorite"}>
          <QuickAction
            icon={<Bookmark size={28} />}
            title="View Favorites"
            subtitle="Saved lessons"
            bgColor="from-pink-400 to-rose-500"
          />
        </Link>
      </motion.div>

      {/* Recent Lessons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto mb-12"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-purple-800">
            Recently Added Lessons
          </h2>
          <TrendingUp className="text-purple-600" size={24} />
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {stats.recentLessons.map((lesson) => (
            <motion.div
              key={lesson._id}
              whileHover={{ y: -10, scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl shadow-lg p-5 cursor-pointer hover:shadow-2xl hover:bg-purple-50 transition-all duration-300"
            >
              <h3 className="font-semibold text-lg text-purple-700 mb-1">
                {lesson?.title}
              </h3>
              <span className="inline-block text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-700">
                {lesson?.category}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Chart + mini stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-6 mb-12"
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4">
            <MiniStat
              label="Total Lessons"
              value={lessons?.length}
              color="bg-indigo-500"
            />


            

            
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setChartView("weekly")}
              className={`px-4 py-1 rounded-full font-semibold ${
                chartView === "weekly"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setChartView("monthly")}
              className={`px-4 py-1 rounded-full font-semibold ${
                chartView === "monthly"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Monthly
            </button>
          </div>
        </div>
        <Bar data={chartData} options={chartOptions} />
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -3 }}
    className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-xl cursor-pointer transition-transform `}
  >
    <div className="flex  flex-col ">
      <div className="bg-white/20 p-3 w-[45px] rounded-xl">{icon}</div>
      <div className="pl-2">
        <h3 className="text-2xl font-bold">{value}</h3>
        <p className="text-sm opacity-90">{label}</p>
      </div>
    </div>
  </motion.div>
);

const QuickAction = ({ icon, title, subtitle, bgColor }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className={`bg-gradient-to-br ${bgColor} rounded-2xl p-5 flex flex-col items-start cursor-pointer shadow-lg transition-all `}
  >
    <div className="p-2 bg-white/20 rounded-xl mb-3">{icon}</div>
    <h3 className="text-white font-semibold text-lg">{title}</h3>
    <p className="text-white/80 text-sm">{subtitle}</p>
  </motion.div>
);

/* Mini Stat Card */
const MiniStat = ({ label, value, color }) => (
  <div
    className={`px-4 py-2 rounded-xl text-white ${color} font-semibold shadow-md text-sm`}
  >
    {label}: {value}
  </div>
);

export default DashboardHome;
