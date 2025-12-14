import { useState, useRef, useEffect, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "../../utils/logo/Logo";
import Button from "./Button";
import { AuthContext } from "../../auth/AuthContext";
import useDbData from "../../hooks/useDbData";

const Navbar = () => {
  const { logOut, user } = useContext(AuthContext);
  const { dbUser } = useDbData();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logOut();
    setDropdownOpen(false);
  };

  const commonNavItems = [
    { name: "Home", path: "/" },
    { name: "Public Lessons", path: "/public-lessons" },
  ];

  const roleNavItems = {
    admin: [{ name: "Admin Dashboard", path: "/admin-dashboard" }],
    user: [
      { name: "Add Lesson", path: "/dashboard/add-lesson" },
      { name: "My Lessons", path: "/dashboard/my-lessons" },
      { name: "Pricing", path: "/dashboard/pricing" },
      { name: "Dashboard", path: "/dashboard" },
    ],
  };
  const currentRole =  "user" 

  return (
    <div className=" md:w-[1200px] fixed top-2 md:left-7 border border-gray-300 rounded-full bg-transparent backdrop-blur-md z-100 mx-auto  shadow-2xl">
      <div className="navbar md:px-8 px-3 transition-all duration-300 ease-in-out">
        {/* LEFT */}
        <div className="navbar-start flex items-center gap-2">
          {/* Mobile Menu */}
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn p-0 pr-2 btn-ghost lg:hidden hover:bg-gray-200 transition-colors rounded-md"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>

            {/* Mobile Dropdown */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[999] mt-3 w-52 p-2 shadow-lg animate-slide-down"
            >
              {commonNavItems.map((item) => (
                <li
                  key={item.name}
                  className="hover:bg-blue-100 transition-colors rounded-md"
                >
                  <NavLink to={item.path}>{item.name}</NavLink>
                </li>
              ))}

              {roleNavItems[currentRole].map((item) => {
                if (!user && item.path === "/dashboard") return null; // hide /dashboard if no user
                return (
                  <li
                    key={item.name}
                    className="hover:bg-blue-100 transition-colors rounded-md"
                  >
                    <NavLink to={item.path}>{item.name}</NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
          {/* Logo */}
          <Logo />
        </div>
        {/* CENTER */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-6">
            {commonNavItems.map((item) => (
              <li key={item.name} className="group">
                <NavLink
                  to={item.path}
                  className="transition-all duration-200 hover:text-blue-600 relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full"
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            {roleNavItems[currentRole].map((item) => {
              if (!dbUser && item.path === "/dashboard") return null; // hide /dashboard if no user
              return (
                <li key={item.name} className="group">
                  <NavLink
                    to={item.path}
                    className="transition-all duration-200 hover:text-blue-600 relative after:content-[''] after:block after:w-0 after:h-[2px] after:bg-blue-600 after:transition-all after:duration-300 group-hover:after:w-full"
                  >
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT */}
        <div className="navbar-end lg:flex items-center gap-3">
          {!user ? (
            <div className="flex gap-3">
              <Link to="/log-in">
                <Button value={"Log In"} />
              </Link>
              <Link className="hidden md:flex" to="/register">
                <Button value={"Register"} />
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* Profile Image */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-12 h-12 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition-transform hover:scale-105 shadow-sm focus:outline-none"
              >
                <img
                  src={user?.photoURL || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white shadow-lg rounded-md z-50 border border-gray-200 animate-fade-in">
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-medium text-gray-700">
                      {user.displayName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    {currentRole === "admin" ? (
                      <Link
                        to="/admin-dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors rounded-md"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-md"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
