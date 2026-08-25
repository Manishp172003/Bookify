import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import OTPVerification from "../pages/Auth/OTPVerification";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Profile/Settings";
import StudentDashboard from "../pages/Dashboard/StudentDashboard";

// Seller Hub pages
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/verify-otp" element={<OTPVerification />} />

      <Route path="/dashboard" element={<StudentDashboard />} />

      <Route path="/profile" element={<Profile />} />

      <Route path="/settings" element={<Settings />} />

      {/* Seller Hub routes */}
      <Route path="/listings" element={<MyListings />} />

      <Route path="/want-board" element={<WantBoard />} />

      <Route path="/sell" element={<SellBook />} />

      <Route path="/sell/isbn" element={<ISBNLookup />} />

      <Route path="/sell/condition" element={<Condition />} />

      <Route path="/sell/photos" element={<UploadPhotos />} />

      <Route path="/sell/transaction" element={<TransactionMode />} />

      <Route path="/sell/price" element={<SetPrice />} />

      <Route path="/sell/preview" element={<PreviewListing />} />

      <Route path="/sell/success" element={<PublishSuccess />} />

      <Route
        path="/"
        element={<Navigate to="/listings" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/listings" replace />}
      />
    </Routes>
  );
}

export default AppRoutes;