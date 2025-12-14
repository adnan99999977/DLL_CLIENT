import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAxios from "../../api/useAxios";

const UpdateLesson = () => {
  const { id } = useParams(); // URL theke lesson ID
  const navigate = useNavigate();
  const axiosApi = useAxios();

  const [lessonData, setLessonData] = useState({
    title: "",
    description: "",
    category: "",
    emotionalTone: "",
    creatorName: "",
    creatorEmail: "",
  });

  const [loading, setLoading] = useState(true);

  // GET lesson by ID from backend
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await axiosApi.get(`/lessons/${id}`);
        setLessonData({
          ...res.data,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to fetch lesson data",
        });
        setLoading(false);
      }
    };
    fetchLesson();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLessonData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Remove _id if exists
      const { _id, ...dataToUpdate } = lessonData;

      await axiosApi.patch(`/lessons/${id}`, dataToUpdate);

      Swal.fire({
        icon: "success",
        title: "Lesson Updated",
        text: "Your lesson has been updated successfully!",
      });
      navigate("/dashboard/my-lessons");
    } catch (err) {
      console.error(err.response?.data || err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Failed to update lesson",
      });
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold">Update Lesson</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        {/* Creator Name */}
        <div>
          <label className="block font-semibold mb-1">User Name</label>
          <input
            type="text"
            name="creatorName"
            value={lessonData.creatorName || ""}
            disabled
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Creator Email */}
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="creatorEmail"
            value={lessonData.creatorEmail || ""}
            disabled
            className="w-full border p-2 rounded bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold mb-1">Lesson Title</label>
          <input
            type="text"
            name="title"
            value={lessonData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={lessonData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded h-32"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-semibold mb-1">Category</label>
          <select
            name="category"
            value={lessonData.category}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option>Personal Growth</option>
            <option>Career</option>
            <option>Relationships</option>
            <option>Mindset</option>
            <option>Mistakes Learned</option>
          </select>
        </div>

        {/* Emotional Tone */}
        <div>
          <label className="block font-semibold mb-1">Emotional Tone</label>
          <select
            name="emotionalTone"
            value={lessonData.emotionalTone}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          >
            <option>Motivational</option>
            <option>Sad</option>
            <option>Realization</option>
            <option>Gratitude</option>
          </select>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Update Lesson
        </button>
      </form>
    </div>
  );
};

export default UpdateLesson;
