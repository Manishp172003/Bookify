import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CommerceProvider } from "./context/CommerceContext";
import { ListingProvider } from "./context/ListingContext";
import ScrollToTop from "./components/ui/ScrollToTop";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <CommerceProvider>
          <ListingProvider>
            <AppRoutes />
          </ListingProvider>
        </CommerceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

