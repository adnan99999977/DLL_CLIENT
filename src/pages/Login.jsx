import React, { useContext, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { AuthContext } from "../auth/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import useAxios from "../api/useAxios";
import toast from "react-hot-toast";

const Login = () => {
  const { signInViaGoogle, signInUser } = useContext(AuthContext);
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");
  const axiosApi = useAxios();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ================= GOOGLE LOGIN =================
  const handleGoogle = async () => {
    try {
      const result = await signInViaGoogle();
      const user = result.user;

      const googleUserData = {
        uid: user.uid,
        name: user.displayName || "No Name",
        email: user.email,
        photoURL: user.photoURL,
        role: "user",
        plan: "free",
        isPremium: false,
        totalLessons: 0,
        totalFavorites: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const res = await axiosApi.post("/users/google", googleUserData);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Successfully Logged In !");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  // ================= EMAIL LOGIN =================
  const handleLogIn = async (data) => {
    try {
      const response = await axiosApi.post("/login", {
        email: data.email,
        password: data.password,
      });

      localStorage.setItem("user", JSON.stringify(response.data.user));

      await signInUser(data.email, data.password);
      
      navigate(from, { replace: true });
      toast.success("Successfully Logged In !");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-3">
      <div className="card w-full max-w-sm shadow-xl bg-base-100 p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Welcome Back</h2>
        <p className="text-center mb-4 text-base-content/70">
          Login to Digital Life Lessons
        </p>

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
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="you@example.com"
            className="border p-2 rounded-md w-full mb-3"
          />

          {/* Password */}
          <div className="relative mb-3">
            <input
              {...register("password", { required: "Password is required" })}
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              className="border p-2 rounded-md w-full"
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={() => setShowPass(!showPass)}
            >
              {showPass ? (
                <AiOutlineEyeInvisible size={22} />
              ) : (
                <AiOutlineEye size={22} />
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-info w-full">
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-info font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
