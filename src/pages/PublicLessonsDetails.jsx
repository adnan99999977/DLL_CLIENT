import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Lock, Heart, Bookmark, Eye, Flag, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import LoadingPage from "../components/shared/LoadingPage";
import Swal from "sweetalert2";
import useAxios from "../api/useAxios";
import toast from "react-hot-toast";

/* ================= API FUNCTIONS ================= */
const getLessonDetails = async (axiosApi, id) => {
  const res = await axiosApi.get(`/lessons/${id}`);
  if (!res.data) throw new Error("Lesson not found");
  return res.data;
};

const getRelatedLessons = async (
  axiosApi,
  category,
  emotionalTone,
  currentId
) => {
  const res = await axiosApi.get(
    `/lessons?category=${category}&emotionalTone=${emotionalTone}`
  );
  // Exclude current lesson & limit to 6
  return res.data.filter((l) => l._id !== currentId).slice(0, 6);
};

const PublicLessonsDetails = () => {
  const { id } = useParams();
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [relatedLessons, setRelatedLessons] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const axiosApi = useAxios();

  /* ================= HELPER ================= */
  const formatDateTime = (date) =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(date));

  /* ================= FETCH LESSON ================= */
  const {
    data: lesson,
    isLoading: lessonLoading,
    isError: lessonError,
  } = useQuery({
    queryKey: ["lesson", id],
    queryFn: () => getLessonDetails(axiosApi, id),
    enabled: !!id,
  });

  /* Increment view count on mount */

  /* ================= FETCH COMMENTS ================= */
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () =>
      axiosApi.get(`/comments?lessonId=${id}`).then((res) => res.data),
    enabled: !!id,
    refetchInterval: 3000,
  });

  /* ================= MUTATIONS ================= */
  const addCommentMutation = useMutation({
    mutationFn: (data) => axiosApi.post("/comments", data),
    onMutate: async (newComment) => {
      await queryClient.cancelQueries(["comments", id]);

      const previousComments = queryClient.getQueryData(["comments", id]);

      queryClient.setQueryData(["comments", id], (old = []) => [
        ...old,
        { ...newComment, _id: Math.random().toString(36).substring(2) },
      ]);

      return { previousComments };
    },
    onError: (err, newComment, context) => {
      queryClient.setQueryData(["comments", id], context.previousComments);
      toast.error("Failed to add comment");
    },
    onSettled: () => {
      queryClient.invalidateQueries(["comments", id]);
    },
  });

  /* ================= RELATED LESSONS ================= */
  const fetchRelatedLessons = async () => {
    if (!lesson) return;
    const data = await getRelatedLessons(
      axiosApi,
      lesson.category,
      lesson.emotionalTone,
      lesson._id
    );
    setRelatedLessons(data);
  };

  /* ================= STATE BASED ON LESSON ================= */
  useEffect(() => {
    if (lesson && user) {
      setIsLiked(lesson.likes?.includes(user._id));
      setIsFavorited(lesson.favorites?.includes(user._id));
      fetchRelatedLessons();
    }
  }, [lesson, user]);

  /* ================= LOADING / ERROR ================= */
  if (lessonLoading || !user) return <LoadingPage />;
  if (lessonError || !lesson)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Lesson not found
      </div>
    );

  /* ================= LOCK CHECK ================= */
  const isLocked = lesson.accessLevel === "Premium" && !user.isPremium;

  /* ================= ENGAGEMENT ================= */
  const viewsCount = lesson.viewsCount || Math.floor(Math.random() * 100);

  /* ================= HANDLERS ================= */
  const handleFavorite = async () => {
    if (!user || isFavorited) return;

    try {
      const res = await axiosApi.post("/favorites", {
        userId: user._id,
        lessonId: lesson._id,
        lessonTitle: lesson.title,
        lessonDescription: lesson.description,
        lessonImage: lesson.userImage,
      });

      // If added successfully
      await axiosApi.patch(`/lessons/${lesson._id}/favorite`);
      setIsFavorited(true);
      queryClient.invalidateQueries(["lesson", id]);
      toast.success("Added to favorites!");
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message === "Already favorited") {
        toast.error("You already added this lesson to favorites!");
      } else {
        toast.error("Failed to add favorite!");
      }
    }
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      await axiosApi.patch(`/lessons/${lesson._id}/like`);
      setIsLiked(true);
      toast.success('Liked Story')
      queryClient.invalidateQueries(["lesson", id]);
    } catch (err) {
      console.error(err);
      alert("Failed to like");
    }
  };

  const handleReport = async () => {
    const { value: reason } = await Swal.fire({
      title: "Report this lesson",
      input: "select",
      inputOptions: {
        "Inappropriate Content": "Inappropriate Content",
        "Hate Speech or Harassment": "Hate Speech or Harassment",
        "Misleading or False Information": "Misleading or False Information",
        "Spam or Promotional Content": "Spam or Promotional Content",
        "Sensitive or Disturbing Content": "Sensitive or Disturbing Content",
        Other: "Other",
      },
      inputPlaceholder: "Select a reason",
      showCancelButton: true,
    });

    if (reason) {
      try {
        await axiosApi.post("/lessonsReports", {
          lessonId: id,
          lessonTitle: lesson.title,
          reporterUserId: user._id,
          reporterEmail: user.email,
          reporterUserName: user.userName,
          reason: [reason],
          timestamp: new Date().toISOString(),
        });
        Swal.fire(
          "Reported!",
          "Thank you for reporting. We will review it soon.",
          "success"
        );
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to report this lesson.", "error");
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: lesson.title,
          text: lesson.description,
          url: window.location.href,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to share");
      }
    } else {
      alert("Sharing not supported in this browser");
    }
  };

  const handleComments = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const data = {
      lessonId: id,
      userId: user._id,
      userName: user.userName,
      userImage: user.userImage,
      commentText: comment,
      createdAt: new Date(),
    };
    addCommentMutation.mutate(data);
  };

  /* ================= RENDER ================= */
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {isLocked ? (
        <div className="relative rounded-2xl shadow-xl overflow-hidden">
          <img
            src={lesson.userImage || "/default-lesson.png"}
            alt={lesson.title}
            className="w-full h-72 object-cover blur-md brightness-75"
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white text-center p-6">
            <Lock size={40} className="mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Premium Lesson - Upgrade to view
            </h2>
            <Link
              to="/dashboard/pricing"
              className="px-6 py-2 bg-yellow-500 text-black font-semibold rounded-xl hover:bg-yellow-400 transition"
            >
              Upgrade to Premium
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <img
            src={lesson.userImage || "/default-lesson.png"}
            alt={lesson.title}
            className="w-full h-72 object-cover"
          />
          <div className="p-6 space-y-5">
            {/* Title & Description */}
            <h1 className="text-3xl font-extrabold text-gray-900">
              {lesson.title}
            </h1>
            <p className="text-gray-700 leading-relaxed">
              {lesson.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>📌 {lesson.category}</span>
              <span>🎭 {lesson.emotionalTone}</span>
              <span>🗓 Created: {formatDateTime(lesson.createdAt)}</span>
              <span>🗓 Updated: {formatDateTime(lesson.updatedAt)}</span>
              <span>Visibility: {lesson.visibility}</span>
              <span>
                ⏱{" "}
                {lesson.readingTime ||
                  Math.ceil(lesson.description.split(" ").length / 200)}{" "}
                min read
              </span>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <img
                src={lesson.creatorPhotoURL || "/default-avatar.png"}
                alt={lesson.creatorName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{lesson.creatorName}</p>
                <p className="text-xs text-gray-500">{lesson.creatorEmail}</p>
                <p className="text-xs text-gray-400">
                  Total Lessons: {lesson.totalLessonsCreated || 1}
                </p>
              </div>
            </div>

            {/* Engagement */}
            <div className="flex flex-wrap items-center gap-5 pt-4 text-slate-500">
              <button onClick={handleLike} className="flex items-center gap-1">
                <Heart className="size-6" />
                <span>{lesson.likesCount || 0}</span>
              </button>

              <button
                onClick={handleFavorite}
                className={`flex items-center gap-1 ${
                  isFavorited ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isFavorited}
              >
                <Bookmark className="size-6" />
                <span>{lesson.favoritesCount || 0}</span>
              </button>

              <div className="group flex items-center gap-1 cursor-pointer">
                <Eye className="size-5 transition-all duration-300 group-hover:text-blue-500 group-hover:scale-105" />
                <span className="text-sm">{viewsCount}</span>
              </div>
              <button
                onClick={handleReport}
                className="ml-auto group flex items-center gap-1 cursor-pointer"
              >
                <Flag className="size-5 transition-all duration-300 group-hover:text-red-600 group-hover:scale-110" />
                <span className="text-sm">Report</span>
              </button>
              <button
                onClick={handleShare}
                className="group flex items-center gap-1 cursor-pointer"
              >
                <Share2 className="size-5 transition-all duration-300 group-hover:text-indigo-600 group-hover:scale-110" />
                <span className="text-sm">Share</span>
              </button>
            </div>

            {/* Comments */}
            <div className="pt-6 border-t space-y-3">
              <h2 className="font-semibold text-lg">Comments</h2>
              {commentsLoading ? (
                <LoadingPage />
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="bg-gray-100 p-2 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={user.photoURL || "./default-avatar.png"}
                        className="w-8 h-8 rounded-full"
                        alt=""
                      />
                      <p className="text-sm font-semibold">{c.userName}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-gray-700 text-sm">{c.commentText}</p>
                      <p className="text-gray-600 pr-3 text-[12px]">
                        {formatDateTime(c.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <form onSubmit={handleComments}>
                <textarea
                  placeholder="Write a comment..."
                  className="w-full border p-2 rounded mt-2"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white hover:bg-blue-700 rounded mt-2"
                >
                  Send
                </button>
              </form>
            </div>

            {/* Related Lessons */}
            <div className="pt-6 border-t">
              <h2 className="font-semibold text-lg mb-4">Related Lessons</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {relatedLessons.map((l) => (
                  <Link
                    key={l._id}
                    to={`/public-lessons-details/${l._id}`}
                    className="bg-white shadow rounded-lg overflow-hidden hover:shadow-lg transition"
                  >
                    <img
                      src={l.userImage || "/default-lesson.png"}
                      alt={l.title}
                      className="w-full h-36 object-cover"
                    />
                    <div className="p-3">
                      <p className="font-semibold">{l.title}</p>
                      <p className="text-xs text-gray-500">{l.category}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicLessonsDetails;
