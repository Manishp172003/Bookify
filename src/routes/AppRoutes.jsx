import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import OTPVerification from "../pages/Auth/OTPVerification";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Profile/Settings";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/verify-otp" element={<OTPVerification />} />

      <Route path="/dashboard" element={<StudentDashboard />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/settings" element={<Settings />} />

      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;