import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext); // ✅ Get loading

  // ✅ Wait until sessionStorage is checked before redirecting
  if (loading) return null;

  // Not logged in → go to landing page
  if (!user) return <Navigate to="/" replace />;

  // Wrong role → go to landing page
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;