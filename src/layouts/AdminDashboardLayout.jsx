import { Link, NavLink, Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";
import {
  HomeIcon,
  UserIcon,
  UsersIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Logo from "../utils/logo/Logo";
import { useState } from "react";

const AdminDashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <div className="drawer lg:drawer-open min-h-screen bg-gray-50">
        <input
          id="admin-drawer"
          type="checkbox"
          className="drawer-toggle"
          checked={drawerOpen}
          onChange={toggleDrawer}
        />

        {/* Main Content */}
        <div className="drawer-content flex flex-col min-h-screen transition-all duration-300">
          {/* Navbar */}
          <nav className="navbar w-full bg-base-300 px-4 py-2 flex items-center justify-between lg:justify-start shadow-md">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleDrawer}
                className="lg:hidden btn btn-square btn-ghost p-1"
              >
                {drawerOpen ? (
                  <XMarkIcon className="h-6 w-6 text-gray-700" />
                ) : (
                  <Bars3Icon className="h-6 w-6 text-gray-700" />
                )}
              </button>
              <div className="text-lg font-semibold hidden lg:block">
                Admin Dashboard
              </div>
            </div>
          </nav>

          {/* Page Content */}
          <div className="flex-grow p-6">
            <Outlet />
          </div>
        </div>

        {/* Sidebar */}
        <div
          className={`drawer-side shadow-lg transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <label
            htmlFor="admin-drawer"
            className="drawer-overlay lg:hidden"
            onClick={toggleDrawer}
          ></label>
          <div className="flex min-h-full flex-col items-start bg-white w-64 border-r border-gray-200">
            <Logo />
            <ul className="menu w-full grow p-4 space-y-2">
              {/* Back To Home */}
              <li>
                <Link
                  to={"/"}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                    color="#2A7FFF"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                    />
                  </svg>
                  <p>Back To Home</p>
                </Link>
              </li>

              {/* Dashboard Home */}
              <li>
                <Link
                  to="/admin-dashboard"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <HomeIcon className="h-6 w-6 text-blue-500" />
                  <span>Dashboard Home</span>
                </Link>
              </li>

              {/* Manage Users */}
              <li>
                <NavLink
                  to="/admin-dashboard/manage-users"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <UsersIcon className="h-6 w-6 text-blue-500" />
                  <span>Manage Users</span>
                </NavLink>
              </li>

              {/* Manage Lessons */}
              <li>
                <NavLink
                  to="/admin-dashboard/manage-lessons"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <BookOpenIcon className="h-6 w-6 text-blue-500" />
                  <span>Manage Lessons</span>
                </NavLink>
              </li>

              {/* Reported / Flagged Lessons */}
              <li>
                <NavLink
                  to="/admin-dashboard/reported-lessons"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ExclamationTriangleIcon className="h-6 w-6 text-blue-500" />
                  <span>Reported Lessons</span>
                </NavLink>
              </li>

              {/* Profile */}
              <li>
                <NavLink
                  to="/admin-dashboard/admin-profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <UserIcon className="h-6 w-6 text-blue-500" />
                  <span>Profile</span>
                </NavLink>
              </li>

              
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdminDashboardLayout;
