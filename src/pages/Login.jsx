import React, { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AuthContext } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAxios from "../api/useAxios";

const Login = () => {
  const { signInViaGoogle, signInUser } = useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");
  const axiosApi = useAxios();

  // react hook form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  // google log in
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

  const handleLogIn = async (data) => {
    try {
      const response = await axiosApi.post("/login", {
        email: data.email,
        password: data.password,
      });

      setMessage(response.data.message);
      console.log("User data:", response.data.user);

      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Login failed");
    }
    signInUser(data.email, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-3">
      <div className="card w-full max-w-sm shadow-xl bg-base-100 p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Welcome Back </h2>
        <p className="text-center mb-4 text-base-content/70">
          Login to Digital Life Lessons
        </p>

        {/* Google Login */}
        <button
          onClick={handleGoogle}
          className="btn w-full bg-white border shadow-sm mb-4"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

        <div className="divider">OR</div>

        <form onSubmit={handleSubmit(handleLogIn)}>
          {/* Email */}
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
              className="border border-gray-300 p-2 rounded-md w-full pr-12"
            />
            {errors.email && (
              <p className="text-red-400">{errors.email.message}</p>
            )}
          </label>

          {/* Password */}
          <div>
            <label className="form-control w-full mb-3 relative">
              <div className="label">
                <span className="label-text font-medium">Password</span>
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

              {/* Eye Icon  */}
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
          {/* Login Button */}
          <button type="submit" className="btn btn-info w-full mt-2">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-base-content/70">
          Don't have an account?{" "}
          <Link to={"/register"} className="text-info font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
