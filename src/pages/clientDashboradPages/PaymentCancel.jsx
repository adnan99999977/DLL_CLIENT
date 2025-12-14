import React from "react";
import { XCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center px-4 py-20">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center relative overflow-hidden"
      >
        {/* Animated Alert Icon */}
        <motion.div
          initial={{ rotate: -10, y: -10 }}
          animate={{ rotate: 10, y: 0 }}
          transition={{
            repeat: Infinity,
            repeatType: "mirror",
            duration: 0.8,
          }}
          className="flex justify-center mb-6"
        >
          <AlertTriangle className="w-16 h-16 text-red-500" />
        </motion.div>

        {/* Failed Icon */}
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />

        {/* Headline */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">
          Payment Cancelled
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Your payment was not completed. No worries, you can try again or
          choose another plan.
        </p>

        {/* Payment Info / Optional */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-gray-700 font-medium">
            <span className="font-semibold">Plan:</span> Premium Access
          </p>
          <p className="text-gray-700 font-medium">
            <span className="font-semibold">Transaction ID:</span> TXN987654
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          <Link
            to="/pricing"
            className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors"
          >
            Retry Payment
          </Link>
          <Link
            to="/dashboard"
            className="w-full py-3 border border-red-500 text-red-500 font-semibold rounded-xl hover:bg-red-50 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
