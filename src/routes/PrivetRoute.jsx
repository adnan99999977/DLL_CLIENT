import { Navigate, useLocation } from "react-router-dom"; // ✅ FIX
import { AuthContext } from "../auth/AuthContext";
import { useContext } from "react";
import LoadingPage from "../components/shared/LoadingPage";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return (
      <Navigate
        to="/log-in"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;
