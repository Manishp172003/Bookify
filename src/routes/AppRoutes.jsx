import { Routes, Route } from "react-router-dom";

// Main pages
import HomePage from "../pages/Home/HomePage";
import ExplorePage from "../pages/Explore/ExplorePage";
import CategoriesPage from "../pages/Categories/CategoriesPage";
import BookDetailPage from "../pages/BookDetail/BookDetailPage";

// Layout
import MainLayout from "../components/layout/MainLayout";

// Auth
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import OTPVerification from "../pages/Auth/OTPVerification";

// Dashboard / Profile
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
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>

      {/* Main Website */}
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

      {/* Default Landing Page: Home Page */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
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

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<OTPVerification />} />

      {/* Dashboard & Profile Settings (Protected) */}
      <Route path="/dashboard" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Seller Hub (Protected) */}
      <Route path="/listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
      <Route path="/want-board" element={<ProtectedRoute><WantBoard /></ProtectedRoute>} />
      <Route path="/sell" element={<ProtectedRoute><SellBook /></ProtectedRoute>} />
      <Route path="/sell/isbn" element={<ProtectedRoute><ISBNLookup /></ProtectedRoute>} />
      <Route path="/sell/condition" element={<ProtectedRoute><Condition /></ProtectedRoute>} />
      <Route path="/sell/photos" element={<ProtectedRoute><UploadPhotos /></ProtectedRoute>} />
      <Route path="/sell/transaction" element={<ProtectedRoute><TransactionMode /></ProtectedRoute>} />
      <Route path="/sell/price" element={<ProtectedRoute><SetPrice /></ProtectedRoute>} />
      <Route path="/sell/preview" element={<ProtectedRoute><PreviewListing /></ProtectedRoute>} />
      <Route path="/sell/success" element={<ProtectedRoute><PublishSuccess /></ProtectedRoute>} />

      {/* Unknown routes */}
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