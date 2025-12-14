import React from "react";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex flex-col mx-auto h-screen ">
      <Navbar />
      <div className="flex-1 md:py-25 py-10 px-10">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
