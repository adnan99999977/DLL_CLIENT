import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import useCurrentUser from "../../hooks/useCurrentUser";
import LoadingPage from "../../components/shared/LoadingPage";
import useAxios from "../../api/useAxios";

const Pricing = () => {
  const { user, } = useCurrentUser();
    const axiosApi = useAxios();


  const features = [
    { name: "Number of Lessons", free: "10", premium: "Unlimited" },
    {
      name: "Create Premium Lessons",
      free: <X size={18} />,
      premium: <Check size={18} />,
    },
    {
      name: "Ad-free Experience",
      free: <X size={18} />,
      premium: <Check size={18} />,
    },
    {
      name: "Priority Listing",
      free: <X size={18} />,
      premium: <Check size={18} />,
    },
    {
      name: "Access to Premium Lessons",
      free: <X size={18} />,
      premium: <Check size={18} />,
    },
    {
      name: "Save Favorites",
      free: <Check size={18} />,
      premium: <Check size={18} />,
    },
    {
      name: "Analytics Dashboard",
      free: <X size={18} />,
      premium: <Check size={18} />,
    },
    { name: "Support Access", free: "Basic", premium: "Priority" },
  ];

  const amount = 1500;

  const handleUpgrade = async () => {
    const paymentInfo = {
      userEmail: user.email,
      userId: user._id, // mongo _id
      amount: amount,
    };

    try {
      const res = await axiosApi.post("/create-checkout-session", paymentInfo);
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert("Payment initialization failed");
    }
  };

  if (!user)
    return (
      <div>
        <LoadingPage />
      </div>
    );

  return (
    <>
      {!user.isPremium ? (
        // User is NOT premium → show Upgrade
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 p-6 flex flex-col items-center">
          <motion.h1
            className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-12 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Upgrade to Premium ⭐
          </motion.h1>

          <motion.div
            className="grid md:grid-cols-2 gap-8 w-full max-w-6xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Free Plan Card */}
            <motion.div
              className="backdrop-blur-md bg-white/70 border border-white/40 shadow-lg rounded-3xl p-8 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Free Plan
              </h2>
              <p className="text-3xl font-bold mb-6 text-indigo-600">৳0</p>
              <ul className="space-y-3 w-full">
                {features.map((f, idx) => (
                  <li key={idx} className="flex justify-between text-gray-700">
                    <span>{f.name}</span>
                    <span>{f.free}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Premium Plan Card */}
            <motion.div
              className="backdrop-blur-md bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl rounded-3xl p-8 flex flex-col items-center hover:shadow-2xl transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
            >
              <h2 className="text-2xl font-semibold mb-4">Premium Plan</h2>
              <p className="text-3xl font-bold mb-6">
                ৳<span>{amount}</span>
              </p>
              <ul className="space-y-3 w-full">
                {features.map((f, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{f.name}</span>
                    <span>{f.premium}</span>
                  </li>
                ))}
              </ul>

              <Link>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleUpgrade}
                  className="mt-6 bg-white text-indigo-600 font-bold py-3 px-8 rounded-2xl shadow-lg hover:bg-gray-100 transition-colors text-lg"
                >
                  Upgrade to Premium
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.p
            className="mt-12 text-gray-500 text-center max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            Unlock unlimited lessons, premium features, and an ad-free
            experience. Elevate your learning journey today!
          </motion.p>
        </div>
      ) : (
        // User IS premium → show Already Premium
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gradient-to-br from-indigo-50 to-purple-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="p-8 bg-white/80 backdrop-blur-md shadow-xl rounded-2xl"
          >
            <p className="text-2xl md:text-3xl font-extrabold text-indigo-700 mb-4">
              ⭐ You’re already a Premium Member!
            </p>
            <p className="text-gray-600">
              Enjoy all the premium features and unlimited lessons. Keep
              learning 🚀
            </p>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default Pricing;
