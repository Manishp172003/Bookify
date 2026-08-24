import { Routes, Route, Navigate } from "react-router-dom";

// Layouts
import AuthorLayout from "../components/layout/AuthorLayout";
import AdminLayout from "../components/layout/AdminLayout";

// Auth pages
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import OTPVerification from "../pages/Auth/OTPVerification";

// Author pages
import AuthorDashboard from "../pages/Author/AuthorDashboard";
import MyBooks from "../pages/Author/MyBooks";
import SubmitBook from "../pages/Author/SubmitBook";
import Campaigns from "../pages/Author/Campaigns";
import Analytics from "../pages/Author/Analytics";
import Earnings from "../pages/Author/Earnings";
import AuthorProfile from "../pages/Author/AuthorProfile";

// Admin pages
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageListings from "../pages/Admin/ManageListings";
import OrdersEscrow from "../pages/Admin/OrdersEscrow";
import Disputes from "../pages/Admin/Disputes";
import Users from "../pages/Admin/Users";
import AuthorsVerification from "../pages/Admin/AuthorsVerification";
import PlatformSettings from "../pages/Admin/PlatformSettings";

function AppRoutes() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OTPVerification />} />

      {/* Author Portal Routes */}
      <Route path="/author" element={<AuthorLayout><AuthorDashboard /></AuthorLayout>} />
      <Route path="/author/my-books" element={<AuthorLayout><MyBooks /></AuthorLayout>} />
      <Route path="/author/submit-book" element={<AuthorLayout><SubmitBook /></AuthorLayout>} />
      <Route path="/author/campaigns" element={<AuthorLayout><Campaigns /></AuthorLayout>} />
      <Route path="/author/analytics" element={<AuthorLayout><Analytics /></AuthorLayout>} />
      <Route path="/author/earnings" element={<AuthorLayout><Earnings /></AuthorLayout>} />
      <Route path="/author/profile" element={<AuthorLayout><AuthorProfile /></AuthorLayout>} />

      {/* Admin Panel Routes */}
      <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
      <Route path="/admin/users" element={<AdminLayout><Users /></AdminLayout>} />
      <Route path="/admin/listings" element={<AdminLayout><ManageListings /></AdminLayout>} />
      <Route path="/admin/orders" element={<AdminLayout><OrdersEscrow /></AdminLayout>} />
      <Route path="/admin/disputes" element={<AdminLayout><Disputes /></AdminLayout>} />
      <Route path="/admin/authors" element={<AdminLayout><AuthorsVerification /></AdminLayout>} />
      <Route path="/admin/settings" element={<AdminLayout><PlatformSettings /></AdminLayout>} />

      {/* Redirect fallback */}
      <Route
        path="*"
        element={<Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;