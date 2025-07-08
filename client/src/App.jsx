import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";
import Home from "./pages/Home";

const App = () => {
  return (
    <Router>
      {/* Toast Notification Provider */}
      <Toaster position="top-center" reverseOrder={false} />

      <Navbar />

      {/* Content padding to prevent overlap with fixed navbar */}
      <div className="">
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>

      <Footer />
    </Router>
  );
};

export default App;
