import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import ExplorePage from "../pages/ExplorePage";
import CategoriesPage from "../pages/CategoriesPage";
import BookDetailPage from "../pages/BookDetailPage";
import MainLayout from "../components/layout/MainLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
      <Route path="/explore" element={<MainLayout><ExplorePage /></MainLayout>} />
      <Route path="/categories" element={<MainLayout><CategoriesPage /></MainLayout>} />
      <Route path="/book/:id" element={<MainLayout><BookDetailPage /></MainLayout>} />
      <Route path="*" element={<MainLayout><div className="p-8 text-center text-bookify-text-secondary">404 - Page Not Found</div></MainLayout>} />
    </Routes>
  );
}
