import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login, but keep reference of where they wanted to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
