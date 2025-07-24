import { ArrowUp } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { MyContext } from "./context/MyContext";
import Admin from "./pages/Admin";
import Home from "./pages/Home";

const App = () => {
  const { currentUser, appLoading } = useContext(MyContext);

  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.pageYOffset > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Spinner = () => (
    <div className="fixed inset-0 bg-white/50 dark:bg-black/50 flex items-center justify-center z-50">
      <div className="h-12 w-12 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      {appLoading && <Spinner />}
      <Navbar />

      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/admin"
            element={
              !currentUser ? (
                <Navigate to="/" replace />
              ) : currentUser.role !== "admin" ? (
                <Navigate to="/" replace />
              ) : (
                <Admin />
              )
            }
          />
        </Routes>
      </div>

      <Footer />

      {/* Go to Top Button */}
      {showTopBtn && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-main-red text-white shadow-lg hover:bg-hover-red transition flex items-center justify-center"
          style={{ width: 44, height: 44 }}
        >
          <ArrowUp size={24} />
        </button>
      )}
    </Router>
  );
};

export default App;
