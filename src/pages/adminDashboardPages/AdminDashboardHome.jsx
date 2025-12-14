import { motion } from "framer-motion";
import {
  UserIcon,
  BookOpenIcon,
  FlagIcon,
  StarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import LoadingPage from "../../components/shared/LoadingPage";
import useDbData from "../../hooks/useDbData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardHome = () => {
  const { dbUser, lessons, reports, loading } = useDbData();

  if (loading) return <LoadingPage />;

  // ===== General Stats =====
  const totalUsers = dbUser?.length ?? 0;
  const totalLessons = lessons?.length ?? 0;
  const totalReports = reports?.length ?? 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const newLessonsToday = lessons.filter(
    (lesson) => new Date(lesson.createdAt) >= today
  ).length;

  // ===== Top Contributors =====
  const contributorMap = {};
  lessons.forEach((lesson) => {
    const email = lesson.creatorEmail || lesson.creatorName;
    if (!contributorMap[email]) {
      contributorMap[email] = { count: 1, img: lesson.creatorPhotoURL };
    } else {
      contributorMap[email].count += 1;
    }
  });

  const topContributors = Object.keys(contributorMap)
    .map((email) => ({
      name: email,
      lessons: contributorMap[email].count,
      img: contributorMap[email].img || "/default-avatar.png",
    }))
    .sort((a, b) => b.lessons - a.lessons)
    .slice(0, 4);

  // ===== Lesson Growth Chart (Last 7 Days) =====
  const lessonCounts = Array(7).fill(0);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Sunday
  weekStart.setHours(0, 0, 0, 0);

  lessons.forEach((lesson) => {
    const created = new Date(lesson.createdAt);
    const diff = Math.floor((created - weekStart) / (1000 * 60 * 60 * 24));
    if (diff >= 0 && diff < 7) lessonCounts[diff] += 1;
  });

  const lessonGrowthData = {
    labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        label: "Lessons Created",
        data: lessonCounts,
        fill: true,
        backgroundColor: "rgba(99, 102, 241, 0.2)",
        borderColor: "rgba(99, 102, 241, 1)",
        tension: 0.3,
      },
    ],
  };

  // ===== User Growth Chart (Static Example) =====
  const userGrowthData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "New Users",
        data: [5, 12, 9, 20, 15, 25, 18],
        fill: true,
        backgroundColor: "rgba(16, 185, 129, 0.2)",
        borderColor: "rgba(16, 185, 129, 1)",
        tension: 0.3,
      },
    ],
  };

  const cards = [
    {
      icon: <UserIcon className="w-10 h-10 text-blue-500" />,
      title: "Total Users",
      value: totalUsers,
    },
    {
      icon: <BookOpenIcon className="w-10 h-10 text-green-500" />,
      title: "Total Public Lessons",
      value: totalLessons,
    },
    {
      icon: <FlagIcon className="w-10 h-10 text-red-500" />,
      title: "Reported Lessons",
      value: totalReports,
    },
    {
      icon: <StarIcon className="w-10 h-10 text-yellow-500" />,
      title: "Top Contributors",
      value: topContributors.length,
    },
    {
      icon: <CalendarIcon className="w-10 h-10 text-purple-500" />,
      title: "New Lessons Today",
      value: newLessonsToday,
    },
  ];

  return (
    <div className="p-6 min-h-screen">
      {/* Title */}
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-indigo-700 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Admin Dashboard
      </motion.h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.05 }}
            className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-5 flex flex-col gap-3"
          >
            {card.icon}
            <p className="text-gray-500">{card.title}</p>
            <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Lesson Growth (Last 7 Days)
          </h2>
          <Line data={lessonGrowthData} />
        </div>

        <div className="bg-white/80 shadow-lg rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">User Growth (Monthly)</h2>
          <Line data={userGrowthData} />
        </div>
      </div>

      {/* Top Contributors */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Most Active Contributors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {topContributors.map((u, i) => (
            <div key={i} className="bg-white rounded-xl p-7 text-center">
              <div className="w-15 overflow-hidden h-15 mx-auto  rounded-full flex items-center justify-center bg-cover font-bold">
                <img className="w-full h-full" src={u.img || "/default-avatar.png"} alt="" />
              </div>
              <p className="mt-2 font-semibold">{u.name}</p>
              <p className="text-sm text-gray-500">{u.lessons} Lessons</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardHome;
