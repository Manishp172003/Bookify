import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Main layout
import MainLayout from "../components/layout/MainLayout";
// Protected route
import ProtectedRoute from "./ProtectedRoute";
// Author layout
import AuthorLayout from "../components/layout/AuthorLayout";
// Admin layout
import AdminLayout from "../components/layout/AdminLayout";

// Main pages
const HomePage = lazy(() => import("../pages/Home/HomePage"));
const ExplorePage = lazy(() => import("../pages/Explore/ExplorePage"));
const CategoriesPage = lazy(() => import("../pages/Categories/CategoriesPage"));
const BookDetailPage = lazy(() => import("../pages/BookDetail/BookDetailPage"));

// Auth
const Login = lazy(() => import("../pages/Auth/Login"));
const Register = lazy(() => import("../pages/Auth/Register"));
const OTPVerification = lazy(() => import("../pages/Auth/OTPVerification"));

// Student Dashboard / Profile
const Profile = lazy(() => import("../pages/Profile/Profile"));
const Settings = lazy(() => import("../pages/Profile/Settings"));
const StudentDashboard = lazy(() => import("../pages/Dashboard/StudentDashboard"));
const MyOrders = lazy(() => import("../pages/Dashboard/MyOrders"));
const StudentMyListings = lazy(() => import("../pages/Dashboard/MyListingsPage"));
const Rentals = lazy(() => import("../pages/Dashboard/Rentals"));
const Exchanges = lazy(() => import("../pages/Dashboard/Exchanges"));
const Wishlist = lazy(() => import("../pages/Dashboard/Wishlist"));
const Messages = lazy(() => import("../pages/Dashboard/Messages"));
const StudentEarnings = lazy(() => import("../pages/Dashboard/Earnings"));
const StudentWantBoard = lazy(() => import("../pages/Dashboard/WantBoardPage"));

// Seller Hub
const MyListings = lazy(() => import("../pages/Listing/MyListings"));
const WantBoard = lazy(() => import("../pages/Listing/WantBoard"));
const SellBook = lazy(() => import("../pages/Listing/SellBook"));
const ISBNLookup = lazy(() => import("../pages/Listing/ISBNLookup"));
const Condition = lazy(() => import("../pages/Listing/Condition"));
const UploadPhotos = lazy(() => import("../pages/Listing/UploadPhotos"));
const TransactionMode = lazy(() => import("../pages/Listing/TransactionMode"));
const SetPrice = lazy(() => import("../pages/Listing/SetPrice"));
const PreviewListing = lazy(() => import("../pages/Listing/PreviewListing"));
const PublishSuccess = lazy(() => import("../pages/Listing/PublishSuccess"));

// Author
const AuthorDashboard = lazy(() => import("../pages/Author/AuthorDashboard"));
const MyBooks = lazy(() => import("../pages/Author/MyBooks"));
const SubmitBook = lazy(() => import("../pages/Author/SubmitBook"));
const Campaigns = lazy(() => import("../pages/Author/Campaigns"));
const Analytics = lazy(() => import("../pages/Author/Analytics"));
const Earnings = lazy(() => import("../pages/Author/Earnings"));
const AuthorProfile = lazy(() => import("../pages/Author/AuthorProfile"));

// Admin
const AdminDashboard = lazy(() => import("../pages/Admin/AdminDashboard"));
const ManageListings = lazy(() => import("../pages/Admin/ManageListings"));
const OrdersEscrow = lazy(() => import("../pages/Admin/OrdersEscrow"));
const Disputes = lazy(() => import("../pages/Admin/Disputes"));
const Users = lazy(() => import("../pages/Admin/Users"));
const AuthorsVerification = lazy(() => import("../pages/Admin/AuthorsVerification"));
const PlatformSettings = lazy(() => import("../pages/Admin/PlatformSettings"));

function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#6C4BF4] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Loading Bookify...
            </span>
          </div>
        </div>
      }
    >
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

      <Route
        path="/dashboard/orders"
        element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/listings"
        element={
          <ProtectedRoute>
            <StudentMyListings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/rentals"
        element={
          <ProtectedRoute>
            <Rentals />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/exchanges"
        element={
          <ProtectedRoute>
            <Exchanges />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/earnings"
        element={
          <ProtectedRoute>
            <StudentEarnings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/want-board"
        element={
          <ProtectedRoute>
            <StudentWantBoard />
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
        path="/admin/settings"
        element={
          <AdminLayout>
            <PlatformSettings />
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
    </Suspense>
  );
}

export default AppRoutes;