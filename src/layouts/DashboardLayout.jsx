import { Link, NavLink, Outlet } from "react-router-dom";
import Footer from "../components/shared/Footer";
import {
  HomeIcon,
  UserIcon,
  PlusCircleIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Logo from "../utils/logo/Logo";
import { useState } from "react";

const DashboardLayout = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => setDrawerOpen(!drawerOpen);

  return (
    <>
      <div className="drawer lg:drawer-open min-h-screen bg-gray-50">
        <input
          id="my-drawer-4"
          type="checkbox"
          className="drawer-toggle"
          checked={drawerOpen}
          onChange={toggleDrawer}
        />

        {/* Main content */}
        <div className="drawer-content flex flex-col min-h-screen transition-all duration-300">
          {/* Navbar */}
          <nav className="navbar w-full bg-base-300 px-4 py-2 flex items-center justify-between lg:justify-start shadow-md">
            <div className="flex items-center gap-2">
              {/* Hamburger toggle for mobile */}
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
            </div>
          </nav>

          {/* Page content */}
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
            htmlFor="my-drawer-4"
            className="drawer-overlay lg:hidden"
            onClick={toggleDrawer}
          ></label>
          <div className="flex min-h-full flex-col items-start bg-white w-64 border-r border-gray-200">
            <Logo />
            <ul className="menu w-full grow p-4 space-y-2">
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
              <li>
                <Link
                  to={"/dashboard"}
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <HomeIcon className="h-6 w-6 text-blue-500" />
                  <span>Dashboard Home</span>
                </Link>
              </li>
              {/* Home */}

              {/* Profile */}
              <li>
                <NavLink
                  to="/dashboard/profile"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <UserIcon className="h-6 w-6 text-blue-500" />
                  <span>Profile</span>
                </NavLink>
              </li>

              {/* Add Lesson */}
              <li>
                <NavLink
                  to="/dashboard/add-lesson"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <PlusCircleIcon className="h-6 w-6 text-blue-500" />
                  <span>Add Lesson</span>
                </NavLink>
              </li>

              {/* My favorites */}
              <li>
                <NavLink
                  to="/dashboard/my-favorite"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
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
                      d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                    />
                  </svg>

                  <span>My Favorites</span>
                </NavLink>
              </li>
              {/* my lessons */}
              <li>
                <NavLink
                  to="/dashboard/my-lessons"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <BookOpenIcon className="h-6 w-6 text-blue-500" />
                  <span>My Lessons</span>
                </NavLink>
              </li>

              {/* Privet */}
              <li>
                <NavLink
                  to="/dashboard/privet-lessons"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                    color="#3885FF"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
                    />
                  </svg>

                  <span>Private lessons</span>
                </NavLink>
              </li>
              {/* Pricing */}
              <li>
                <NavLink
                  to="/dashboard/pricing"
                  className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors duration-200"
                  onClick={() => setDrawerOpen(false)}
                >
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-500" />
                  <span>Pricing</span>
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

export default DashboardLayout;
