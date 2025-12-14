import { motion } from "framer-motion";
import { Lock, Star } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LoadingPage from "../../components/shared/LoadingPage";
import useAxios from "../../api/useAxios";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const AddLesson = () => {
  const { user } = useContext(AuthContext);
  const { uid, displayName, email, photoURL } = user;

  const [imageURL, setImageURL] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("Choose an image");
  const [newUser, setNewUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const axiosApi = useAxios();
  const queryClient = useQueryClient();

  // react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // fetch user info from backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        const res = await axiosApi.get(`/users?email=${email}`);
        setNewUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [email, axiosApi]);

  const isPremium = !!newUser?.isPremium;

  // mutation to add lesson
  const addLessonMutation = useMutation({
    mutationFn: async (lessonData) => {
      const res = await axiosApi.post("/lessons", lessonData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["lessons"]);
      queryClient.invalidateQueries(["myLessons"]);
      alert("✅ Lesson added successfully");
      reset();
      setImageURL(null);
      setFileName("Choose an image");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "❌ Failed to add lesson");
    },
  });

  // handle file upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "DLLimages");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dd1sxbdgc/image/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setImageURL(data.secure_url);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed. Try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // handle form submission
  const handleAddLesson = (data) => {
    if (!imageURL) {
      alert("Please upload a featured image for your lesson.");
      return;
    }

    const lessonData = {
      title: data.title,
      description: data.description,
      category: data.category,
      emotionalTone: data.emotionalTone,
      visibility: data.visibility,
      accessLevel: isPremium ? data.accessLevel : "Free",
      userImage: imageURL,
      creatorId: uid,
      creatorName: displayName,
      creatorEmail: email,
      creatorPhotoURL: photoURL,
      likesCount: 0,
      favoritesCount: 0,
      viewsCount: 0,
      reportsCount: 0,
      featured: false,
      reviewStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addLessonMutation.mutate(lessonData);
  };

  if (loadingUser) return <LoadingPage />;

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex justify-center px-4 py-8 sm:py-16"
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-8 sm:mb-12 text-center px-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-700 mb-2">
            Create a Life Lesson
          </h1>
          <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto">
            Share your insights and experiences with the world in a meaningful way.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          variants={fadeUp}
          className="backdrop-blur-xl bg-white/60 border border-white/30 shadow-2xl rounded-3xl p-6 sm:p-10 md:p-12 hover:shadow-3xl transition-shadow duration-300"
        >
          <form onSubmit={handleSubmit(handleAddLesson)} className="space-y-6 sm:space-y-8">
            {/* Title */}
            <div>
              <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-base sm:text-lg">
                Lesson Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                {...register("title", { required: "Lesson title is required" })}
                placeholder="The hard truth I learned too late..."
                className="w-full rounded-2xl border border-gray-200 p-3 sm:p-4 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm hover:shadow-md transition text-sm sm:text-base"
              />
              {errors.title && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-base sm:text-lg">
                Your Story <span className="text-red-600">*</span>
              </label>
              <textarea
                {...register("description", { required: "Description is required" })}
                placeholder="Write honestly. This is where the magic happens..."
                className="w-full rounded-2xl border border-gray-200 p-3 sm:p-4 min-h-[140px] sm:min-h-[180px] focus:ring-2 focus:ring-indigo-500 outline-none resize-none shadow-sm hover:shadow-md transition text-sm sm:text-base"
              />
              {errors.description && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Category & Tone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-base sm:text-lg">
                  Category <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("category", { required: "Category required" })}
                  className="w-full rounded-2xl border p-3 sm:p-4 shadow-sm hover:shadow-md transition text-sm sm:text-base"
                >
                  <option value="">Select category</option>
                  <option>Personal Growth</option>
                  <option>Career</option>
                  <option>Mindset</option>
                  <option>Relationships</option>
                  <option>Mistakes Learned</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-base sm:text-lg">
                  Emotional Tone <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("emotionalTone", { required: "Tone required" })}
                  className="w-full rounded-2xl border p-3 sm:p-4 shadow-sm hover:shadow-md transition text-sm sm:text-base"
                >
                  <option value="">Select tone</option>
                  <option>Motivational</option>
                  <option>Sad</option>
                  <option>Realization</option>
                  <option>Gratitude</option>
                </select>
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-base sm:text-lg">
                Featured Image
              </label>
              <input
                type="file"
                {...register("userImage")}
                accept="image/*"
                className="hidden"
                id="lessonImage"
                onChange={handleFileChange}
              />
              <div
                className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3 border border-gray-300 rounded-2xl hover:bg-indigo-50 cursor-pointer transition text-sm sm:text-base"
                onClick={() => document.getElementById("lessonImage").click()}
              >
                <span className="text-gray-700 truncate">{fileName}</span>
                {isUploading && <span className="text-gray-500">Uploading...</span>}
              </div>
            </div>

            {/* Visibility & Access */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-base sm:text-lg">
                  Visibility <span className="text-red-600">*</span>
                </label>
                <select
                  {...register("visibility", { required: "Visibility required" })}
                  className="w-full rounded-2xl border p-3 sm:p-4 shadow-sm hover:shadow-md transition text-sm sm:text-base"
                >
                  <option value="">Select visibility</option>
                  <option>Public</option>
                  <option>Private</option>
                </select>
              </div>

              <div className="relative">
                <label className="block font-semibold mb-1 sm:mb-2 text-gray-700 text-base sm:text-lg flex items-center gap-2">
                  Access Level
                  {!isPremium && <Lock size={16} className="text-red-500" />}
                  {isPremium && <Star size={16} className="text-yellow-400" />}
                </label>
                <select
                  {...register("accessLevel")}
                  disabled={!isPremium}
                  className={`w-full rounded-2xl border p-3 sm:p-4 shadow-sm hover:shadow-md transition text-sm sm:text-base ${
                    !isPremium ? "bg-gray-100 cursor-not-allowed text-gray-400" : ""
                  }`}
                >
                  <option>Free</option>
                  <option>Premium</option>
                </select>
                {!isPremium && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    Premium users can create premium lessons ⭐
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={addLessonMutation.isLoading || isUploading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full mt-6 sm:mt-10 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 sm:py-4 rounded-3xl font-bold text-base sm:text-lg shadow-lg hover:shadow-2xl transition"
            >
              {addLessonMutation.isLoading ? "Publishing..." : "Publish Lesson 🚀"}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AddLesson;
