import RootLayout from "../layouts/RootLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../components/Home";
import { createBrowserRouter } from "react-router-dom";
import PublicLessons from "../pages/PublicLessons";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ErrorPage from "../components/shared/ErroPage";
import Profile from "../pages/clientDashboradPages/Profile";
import AddLesson from "../pages/clientDashboradPages/AddLesson";
import MyLessons from "../pages/clientDashboradPages/MyLessons";

import Pricing from "../pages/clientDashboradPages/Pricing";

import DashboardHome from "../pages/clientDashboradPages/DashboardHome";
import PrivateRoute from "./PrivetRoute";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminDashboardHome from "../pages/adminDashboardPages/adminDashboardHome";
import ManageUsers from "../pages/adminDashboardPages/ManageUsers.jsx";
import ManageLessons from "../pages/adminDashboardPages/ManageLessons.jsx";
import ReportedLessons from "../pages/adminDashboardPages/ReportedLessons.jsx";
import AdminProfile from "../pages/adminDashboardPages/AdminProfile.jsx";
import PublicLessonsDetails from "../pages/PublicLessonsDetails.jsx";
import Payment from "../pages/clientDashboradPages/Payment.jsx";
import PaymentCancel from "../pages/clientDashboradPages/PaymentCancel.jsx";
import MyFavorites from "../pages/clientDashboradPages/MyFavorites.jsx";
import UpdateLesson from "../pages/clientDashboradPages/UpdateLesson.jsx";
import PrivetLessons from "../pages/clientDashboradPages/PrivetLessons.jsx";

const router = createBrowserRouter([
  // root layout
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "/public-lessons", element: <PublicLessons /> },
      { path: "/log-in", element: <Login /> },
      { path: "/register", element: <Register /> },
      {
        path: "/public-lessons-details/:id",
        element: (
          <PrivateRoute>
            <PublicLessonsDetails />
          </PrivateRoute>
        ),
      },
    ],
  },

  // dashboard layout
  {
    path: "dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "profile", element: <Profile /> },
      {
        path: "add-lesson",
        element: <AddLesson />,
      },
      {
        path: "my-lessons",
        element: <MyLessons />,
      },
      { path: "pricing", element: <Pricing /> },
      { path: "paymentSuccess", element: <Payment /> },
      { path: "paymentCancel", element: <PaymentCancel /> },
      { path: "my-favorite", element: <MyFavorites /> },
      { path: "update-lesson/:id", element: <UpdateLesson /> },
      { path: "privet-lessons", element: <PrivetLessons /> },
    ],
  },

  //admin dashboard layout
  {
    path: "admin-dashboard",
    element: <AdminDashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AdminDashboardHome /> },
      { path: "manage-users", element: <ManageUsers /> },
      { path: "manage-lessons", element: <ManageLessons /> },
      { path: "reported-lessons", element: <ReportedLessons /> },
      { path: "admin-profile", element: <AdminProfile /> },
    ],
  },
]);

export default router;
