import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import useCurrentUser from "../hooks/useCurrentUser";
import LoadingPage from "../components/shared/LoadingPage";
import useAxios from "../api/useAxios";

const PublicLessons = () => {
  const axiosApi = useAxios();
  const { user } = useCurrentUser();

  const { data: lessons, isLoading, isError } = useQuery({
    queryKey: ["lessons"],
    queryFn: async () => {
      const res = await axiosApi.get("/lessons");
      return res.data;
    },
  });

  if (isLoading || !user) return <LoadingPage />;
  if (isError) return <div>Error loading lessons</div>;

  const filteredLessons = lessons
    .filter((l) => l.visibility !== "Private")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="px-6 py-12 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12 text-center">
        Explore Life Lessons
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredLessons.map((lesson) => {
          const isLocked = lesson.accessLevel === "Premium" && !user.isPremium;
          return (
            <div key={lesson._id} className="relative flex flex-col bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300">
              <div className={`w-full h-44 overflow-hidden ${isLocked ? "filter blur-sm brightness-75" : ""}`}>
                {lesson.userImage ? <img src={lesson.userImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 font-semibold">No Image</div>}
              </div>

              <div className="flex-1 p-5 flex flex-col justify-between">
                <h2 className={`font-semibold text-lg text-gray-800 mb-2 cursor-pointer hover:text-blue-600 ${isLocked ? "cursor-not-allowed blur-sm brightness-75" : ""}`}>
                  {lesson.title}
                </h2>
                <p className={`text-gray-500 text-sm mb-3 ${isLocked ? "blur-sm brightness-75" : ""}`}>{lesson.description.slice(0, 100)}...</p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{lesson.category}</span>
                  {lesson.accessLevel === "Premium" && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-semibold flex items-center gap-1"><Lock size={14} /> Premium</span>}
                </div>
              </div>

              <div className="p-5 border-t border-gray-100 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={lesson.creatorPhotoURL || "/default-avatar.png"} alt={lesson.creatorName} className="w-8 h-8 rounded-full object-cover" />
                    <span className="text-gray-600 text-sm">{lesson.creatorName}</span>
                  </div>
                  <span className="text-gray-400 text-xs">{new Date(lesson.createdAt).toLocaleDateString()}</span>
                </div>

                {isLocked ? (
                  <Link to="/dashboard/pricing">
                    <button className="w-full py-2 rounded-xl font-semibold bg-yellow-500 text-white hover:bg-yellow-600 transition-colors">Upgrade to Premium</button>
                  </Link>
                ) : (
                  <Link to={`/public-lessons-details/${lesson._id}`}>
                    <button className="w-full py-2 rounded-xl font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors">See Details</button>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};



export default PublicLessons;
