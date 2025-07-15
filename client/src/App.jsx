import { ArrowUp } from "lucide-react"; // <-- Import icon here
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
  const { currentUser } = useContext(MyContext);

  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.pageYOffset > 200) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <div className="">
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
