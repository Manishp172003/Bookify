import { Routes, Route } from "react-router-dom";

// Main pages
import HomePage from "../pages/Home/HomePage";
import ExplorePage from "../pages/Explore/ExplorePage";
import CategoriesPage from "../pages/Categories/CategoriesPage";
import BookDetailPage from "../pages/BookDetail/BookDetailPage";

// Main layout
import MainLayout from "../components/layout/MainLayout";

// Auth
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import OTPVerification from "../pages/Auth/OTPVerification";
import AdminLogin from "../pages/Auth/AdminLogin";

// Student Dashboard / Profile
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Profile/Settings";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";

// Seller Hub
import MyListings from "../pages/Listing/MyListings";
import WantBoard from "../pages/Listing/WantBoard";
import SellBook from "../pages/Listing/SellBook";
import ISBNLookup from "../pages/Listing/ISBNLookup";
import Condition from "../pages/Listing/Condition";
import UploadPhotos from "../pages/Listing/UploadPhotos";
import TransactionMode from "../pages/Listing/TransactionMode";
import SetPrice from "../pages/Listing/SetPrice";
import PreviewListing from "../pages/Listing/PreviewListing";
import PublishSuccess from "../pages/Listing/PublishSuccess";

// Protected route
import ProtectedRoute from "./ProtectedRoute";

// Author
import AuthorLayout from "../components/layout/AuthorLayout";
import AuthorDashboard from "../pages/Author/AuthorDashboard";
import MyBooks from "../pages/Author/MyBooks";
import SubmitBook from "../pages/Author/SubmitBook";
import Campaigns from "../pages/Author/Campaigns";
import Analytics from "../pages/Author/Analytics";
import Earnings from "../pages/Author/Earnings";
import AuthorProfile from "../pages/Author/AuthorProfile";
import AuthorChat from "../pages/Author/AuthorChat";
import AuthorCoupons from "../pages/Author/Coupons";

// Admin
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import ManageListings from "../pages/Admin/ManageListings";
import OrdersEscrow from "../pages/Admin/OrdersEscrow";
import Disputes from "../pages/Admin/Disputes";
import Users from "../pages/Admin/Users";
import AuthorsVerification from "../pages/Admin/AuthorsVerification";
import PlatformSettings from "../pages/Admin/PlatformSettings";
import Chat from "../pages/Admin/Chat";
import AdminCoupons from "../pages/Admin/Coupons";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= MAIN WEBSITE ================= */}

      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />

      <Route
        path="/home"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />

      <Route
        path="/explore"
        element={
          <MainLayout>
            <ExplorePage />
          </MainLayout>
        }
      />

      <Route
        path="/categories"
        element={
          <MainLayout>
            <CategoriesPage />
          </MainLayout>
        }
      />

      <Route
        path="/book/:id"
        element={
          <MainLayout>
            <BookDetailPage />
          </MainLayout>
        }
      />

      {/* ================= AUTH ================= */}

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ================= STUDENT ================= */}

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ================= SELLER HUB ================= */}

      <Route
        path="/listings"
        element={
          <ProtectedRoute>
            <MyListings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/want-board"
        element={
          <ProtectedRoute>
            <WantBoard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell"
        element={
          <ProtectedRoute>
            <SellBook />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/isbn"
        element={
          <ProtectedRoute>
            <ISBNLookup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/condition"
        element={
          <ProtectedRoute>
            <Condition />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/photos"
        element={
          <ProtectedRoute>
            <UploadPhotos />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/transaction"
        element={
          <ProtectedRoute>
            <TransactionMode />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/price"
        element={
          <ProtectedRoute>
            <SetPrice />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/preview"
        element={
          <ProtectedRoute>
            <PreviewListing />
          </ProtectedRoute>
        }
      />

      <Route
        path="/sell/success"
        element={
          <ProtectedRoute>
            <PublishSuccess />
          </ProtectedRoute>
        }
      />

      {/* ================= AUTHOR ================= */}

      <Route
        path="/author"
        element={
          <AuthorLayout>
            <AuthorDashboard />
          </AuthorLayout>
        }
      />

      <Route
        path="/author/my-books"
        element={
          <AuthorLayout>
            <MyBooks />
          </AuthorLayout>
        }
      />

      <Route
        path="/author/submit-book"
        element={
          <AuthorLayout>
            <SubmitBook />
          </AuthorLayout>
        }
      />

      <Route
        path="/author/campaigns"
        element={
          <AuthorLayout>
            <Campaigns />
          </AuthorLayout>
        }
      />

      <Route
        path="/author/coupons"
        element={
          <AuthorLayout>
            <AuthorCoupons />
          </AuthorLayout>
        }
      />

      <Route
        path="/author/analytics"
        element={
          <AuthorLayout>
            <Analytics />
          </AuthorLayout>
        }
      />

      <Route
        path="/author/earnings"
        element={
          <AuthorLayout>
            <Earnings />
          </AuthorLayout>
        }
      />

      <Route
        path="/author/profile"
        element={
          <AuthorLayout>
            <AuthorProfile />
          </AuthorLayout>
        }
      />

      <Route
        path="/author/chat"
        element={
          <AuthorLayout>
            <AuthorChat />
          </AuthorLayout>
        }
      />

      {/* ================= ADMIN ================= */}

      <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <Users />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/listings"
        element={
          <AdminLayout>
            <ManageListings />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminLayout>
            <OrdersEscrow />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/disputes"
        element={
          <AdminLayout>
            <Disputes />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/authors"
        element={
          <AdminLayout>
            <AuthorsVerification />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/coupons"
        element={
          <AdminLayout>
            <AdminCoupons />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminLayout>
            <PlatformSettings />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/chat"
        element={
          <AdminLayout>
            <Chat />
          </AdminLayout>
        }
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <div className="p-8 text-center text-bookify-text-secondary">
            404 - Page Not Found
          </div>
        }
      />

    </Routes>
  );
}

export default AppRoutes;