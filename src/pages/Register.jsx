import React, { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import { useForm } from "react-hook-form";
import useImageUpload from "../hooks/useImageUpload";
import useAxios from "../api/useAxios";

const Register = () => {
  const { imageURL, isUploading, fileName, uploadFile } = useImageUpload();
      const axiosApi = useAxios();


  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { setUser, updateUser, registerUser, signInViaGoogle } =
    useContext(AuthContext);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleGoogle = async () => {
  try {
    const result = await signInViaGoogle();
    const user = result.user;

    // DB-ready user object
    const googleUserData = {
      uid: user.uid,                     // Firebase UID
      name: user.displayName || "No Name",
      email: user.email,
      photoURL: user.photoURL,
      role: "user",                      // lowercase
      plan: "free",                      // lowercase
      isPremium: false,
      totalLessons: 0,
      totalFavorites: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Check if user already exists in DB
    const res = await axiosApi.post("/users/google", googleUserData);

    console.log("✅ Google user DB response:", res.data);
    alert("Google login successful!");

    // Optionally set user to context/localStorage
    localStorage.setItem("user", JSON.stringify(res.data.user));

  } catch (error) {
    console.error("❌ Google login failed:", error.response?.data || error);
  }
};

  const handleRegister = async (data) => {
  if (!imageURL) {
    alert(
      isUploading
        ? "Image is still uploading. Please wait."
        : "Please upload a profile image first!"
    );
    return;
  }

  try {
    const { confirmPassword, ...userData } = data;

    // 1️⃣ Create user in Firebase Auth
    const userCredential = await registerUser(userData.email, userData.password);
    const currentUser = userCredential.user;

    // 2️⃣ Update Firebase Profile
    await updateUser(currentUser, {
      displayName: userData.userName,
      photoURL: imageURL,
    });

    // 3️⃣ DB-ready user object
    const registrationData = {
      uid: currentUser.uid,
      name: userData.userName,
      email: userData.email,
      photoURL: imageURL,
      role: "user",
      plan: "free",
      isPremium: false,
      totalLessons: 0,
      totalFavorites: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 4️⃣ Save to DB
    const res = await axiosApi.post("/users", registrationData);

    console.log("✅ Registration DB response:", res.data);
    alert("Registration successful!");

    // Optionally set user in context/localStorage
    setUser({ ...currentUser, name: userData.userName, photoURL: imageURL });
    localStorage.setItem("user", JSON.stringify(res.data.user));

  } catch (err) {
    console.error("❌ Registration failed:", err.response?.data || err.message);
  }
};

  const password = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-3">
      <div className="card w-full max-w-sm shadow-xl bg-base-100 p-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Create an Account
        </h2>
        <p className="text-center mb-4 text-base-content/70">
          Join Digital Life Lessons today
        </p>

        {/* Google Signup */}
        <button
          onClick={handleGoogle}
          className="btn w-full bg-white border shadow-sm mb-4"
        >
          <FcGoogle size={22} /> Continue with Google
        </button>

        <div className="divider">OR</div>

        <form onSubmit={handleSubmit(handleRegister)}>
          {/* Name (অপরিবর্তিত) */}
          <label className="form-control w-full mb-3">
            <div className="label">
              <span className="label-text font-medium">Full Name</span>
            </div>
            <input
              {...register("userName", {
                required: "Full name is required",
                minLength: { value: 5, message: "Minimum 5 characters" },
                maxLength: { value: 15, message: "Minimum 15 characters" },
                pattern: {
                  value: /^[A-Za-z]+([ '-][A-Za-z]+)*$/,
                  message:
                    "Only letters, spaces, hyphens or apostrophes allowed",
                },
              })}
              type="text"
              placeholder="Your full name"
              className="border border-gray-300 p-2 rounded-md w-full"
            />
            {errors.userName && (
              <p className="text-red-400">{errors.userName.message}</p>
            )}
          </label>

          {/* Email (অপরিবর্তিত) */}
          <label className="form-control w-full mb-3">
            <div className="label">
              <span className="label-text font-medium">Email</span>
            </div>
            <input
              {...register("email", {
                required: "Email is required",
                maxLength: {
                  value: 40,
                  message: "Maximum 40 characters allowed",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
                  },
                },
              })}
              type="email"
              placeholder="you@example.com"
              className="border border-gray-300 p-2 rounded-md w-full"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </label>

          {/* Profile Picture: এখানে পরিবর্তন করা হয়েছে */}
          <div className="w-full mb-3">
            <label className="label">
              <span className="label-text font-medium">
                Profile Picture{" "}
                {isUploading && (
                  <span className="text-yellow-600 ml-2">(Uploading...)</span>
                )}
              </span>
            </label>

            <input
              type="file"
              {...register("userImage")}
              accept="image/*"
              className="hidden"
              id="profileImage"
              onChange={handleFileSelect} // ⭐ কাস্টম ফাংশন ব্যবহার করা হয়েছে
            />

            <div
              className={`flex items-center gap-4 p-2 border rounded-md transition-colors cursor-pointer 
                          ${
                            isUploading
                              ? "border-yellow-500 bg-yellow-50"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
              onClick={() => document.getElementById("profileImage").click()}
            >
              <span
                className={`truncate ${
                  isUploading ? "text-yellow-700" : "text-gray-700"
                }`}
              >
                {fileName}
              </span>
              {/* Optional: Add image preview if imageURL exists */}
              {imageURL && (
                <img
                  src={imageURL}
                  alt="Preview"
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Password (অপরিবর্তিত) */}
          {/* ... (বাকি JSX অপরিবর্তিত) ... */}

          {/* Password */}
          <div>
            <label className="form-control w-full mb-3 relative">
              <div className="relative">
                <span className="label-text text-gray-600 font-medium">
                  Password
                </span>
              </div>

              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 8, message: "Minimum 8 characters" },
                  maxLength: { value: 30, message: "Maximum 30 characters" },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,30}$/,
                    message:
                      "Password must contain uppercase, lowercase, number and special character",
                  },
                })}
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="border border-gray-300 p-2 rounded-md w-full pr-12"
              />
              {errors.password && (
                <p className="text-red-400">{errors.password.message}</p>
              )}

              <div
                className="absolute right-3 top-[44px] -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPass(!showPass)}
              >
                {showPass ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </div>
            </label>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="form-control w-full mb-3 relative">
              <div className="label">
                <span className="label-text font-medium">Confirm Password</span>
              </div>

              <input
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="border border-gray-300 p-2 rounded-md w-full pr-12"
              />
              {errors.confirmPassword && (
                <p className="text-red-400">{errors.confirmPassword.message}</p>
              )}

              <div
                className="absolute right-3 top-[44px] -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? (
                  <AiOutlineEyeInvisible size={22} />
                ) : (
                  <AiOutlineEye size={22} />
                )}
              </div>
            </label>
          </div>

          {/* Register Button: isUploading স্টেট দিয়ে disabled করা হয়েছে */}
          <button
            type="submit"
            className="btn btn-info w-full mt-2 text-white"
            disabled={isUploading}
          >
            {isUploading ? "Uploading Image..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-base-content/70">
          Already have an account?{" "}
          <Link to={"/log-in"} className="text-info font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
