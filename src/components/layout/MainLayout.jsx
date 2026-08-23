import Navbar from "./Navbar";
import Footer from "./Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F8F7FF]">
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </div>
  );
}

export default MainLayout;