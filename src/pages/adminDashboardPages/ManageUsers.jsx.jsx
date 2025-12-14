import React, { useState, useEffect } from "react";
import LoadingPage from "../../components/shared/LoadingPage";
import useDbData from "../../hooks/useDbData";
import useAxios from "../../api/useAxios";

const PROTECTED_ADMIN_EMAIL = "adminadnan@gmail.com";

const ManageUsers = () => {
  const { dbUser, loading } = useDbData();
  const [localUsers, setLocalUsers] = useState([]);
  const axiosApi = useAxios();

  // sync hook data to local state
  useEffect(() => {
    if (dbUser) setLocalUsers(Array.isArray(dbUser) ? dbUser : [dbUser]);
  }, [dbUser]);

  // Toggle user role
  const toggleRole = async (id) => {
    const user = localUsers.find((u) => u._id === id);
    if (!user) return;

    // prevent role change for protected admin
    if (user.email === PROTECTED_ADMIN_EMAIL) {
      alert("Cannot change role of protected admin!");
      return;
    }

    const newRole = user.role === "User" ? "Admin" : "User";

    try {
      await axiosApi.patch(`/users/${id}`, { role: newRole });
      setLocalUsers(
        localUsers.map((u) => (u._id === id ? { ...u, role: newRole } : u))
      );
      alert(`User role updated to ${newRole}`);
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update role");
    }
  };

  // Delete user
  const deleteUser = async (id) => {
    const user = localUsers.find((u) => u._id === id);
    if (!user) return;

    // prevent delete for protected admin
    if (user.email === PROTECTED_ADMIN_EMAIL) {
      alert("Cannot delete protected admin!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axiosApi.delete(`/users/${id}`);
      setLocalUsers(localUsers.filter((u) => u._id !== id));
      alert("User deleted successfully");
    } catch (err) {
      console.error("Failed to delete user:", err);
      alert("Failed to delete user");
    }
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
        Manage Users
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">
                Name
              </th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">
                Email
              </th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">
                Role
              </th>
              <th className="text-left px-6 py-3 text-gray-600 font-medium">
                Total Lessons
              </th>
              <th className="text-center px-6 py-3 text-gray-600 font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {localUsers.length > 0 ? (
              localUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">{user.userName}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-white font-medium text-sm ${
                        user.role === "Admin"
                          ? "bg-yellow-500 shadow"
                          : "bg-blue-500 shadow"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">{user.lessons || 0}</td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      disabled={user.email === PROTECTED_ADMIN_EMAIL}
                      className={`px-3 py-1 rounded-lg text-white font-medium text-sm transition-colors duration-300 ${
                        user.role === "Admin"
                          ? "bg-indigo-500 hover:bg-indigo-600"
                          : "bg-green-500 hover:bg-green-600"
                      } ${
                        user.email === PROTECTED_ADMIN_EMAIL
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => toggleRole(user._id)}
                    >
                      {user.role === "Admin"
                        ? "Demote to User"
                        : "Promote to Admin"}
                    </button>

                    <button
                      disabled={user.email === PROTECTED_ADMIN_EMAIL}
                      className={`px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium text-sm transition-colors duration-300 ${
                        user.email === PROTECTED_ADMIN_EMAIL
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => deleteUser(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
