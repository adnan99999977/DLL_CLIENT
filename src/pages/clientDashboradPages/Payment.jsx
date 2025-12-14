import React, { useEffect, useState } from "react";
import { CheckCircle, Bell } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import useAxios from "../../api/useAxios";

const Payment = () => {
  const [paymentData, setPaymentData] = useState(null);
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const axiosApi = useAxios();

 useEffect(() => {

  const fetchPaymentData = async () => {
    if (!sessionId) return;
    try {
      const res = await axiosApi.get(`/payment-success?session_id=${sessionId}`);
      setPaymentData(res.data);

      // Update localStorage or React Context
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Payment fetch error:", err);
    }
  };
  fetchPaymentData();
}, [sessionId]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center relative overflow-hidden"
      >
        {/* Sparkles / Animated confetti */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 1 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-blue-400 rounded-full"
        />
        <motion.div
          initial={{ y: -120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 1.2 }}
          className="absolute top-0 left-1/3 w-3 h-3 bg-blue-300 rounded-full"
        />
        <motion.div
          initial={{ y: -140, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ repeat: Infinity, repeatType: "mirror", duration: 1.5 }}
          className="absolute top-0 right-1/3 w-2 h-2 bg-blue-500 rounded-full"
        />

        {/* Bell Icon Animation */}
        <motion.div
          initial={{ rotate: -15, y: -10 }}
          animate={{ rotate: 0, y: 0 }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 0.8,
          }}
          className="flex justify-center mb-6"
        >
          <Bell className="w-16 h-16 text-blue-500" />
        </motion.div>

        {/* Success Icon */}
        <CheckCircle className="w-20 h-20 text-blue-500 mx-auto mb-4" />

        {/* Headline */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Payment Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your premium access has been activated.
        </p>

        {/* Payment Summary */}
        {paymentData && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
            <p className="text-gray-700 font-medium">
              <span className="font-semibold">Amount:</span> $
              {paymentData.amount}
            </p>
            <p className="text-gray-700 font-medium">
              <span className="font-semibold">Plan:</span> {paymentData.plan}
            </p>
            <p className="text-gray-700 font-medium">
              <span className="font-semibold">Transaction ID:</span>{" "}
              {paymentData.transactionId}
            </p>
            <p className="text-gray-700 font-medium">
              <span className="font-semibold">Purchaser Email:</span>{" "}
              {paymentData.userEmail}
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <Link
            to="/dashboard"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/public-lessons"
            className="w-full py-3 border border-blue-500 text-blue-500 font-semibold rounded-xl hover:bg-blue-50 transition-colors"
          >
            Explore Lessons
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;
