import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { LogOut, Menu, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/MyContext";

const Navbar = () => {
  const { isLoginOpen, setIsLoginOpen } = useContext(MyContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser({
          name: decoded.name,
          role: decoded.role || "user",
        });
      } catch {
        setCurrentUser(null);
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData
      );
      const token = res.data.token;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setCurrentUser({
        name: decoded.name,
        role: decoded.role || "user",
      });
      toast.success(`Welcome ${decoded.name}!`);
      setIsLoginOpen(false);
      setLoginData({ email: "", password: "" });
      decoded.role === "admin" ? navigate("/admin") : navigate("/");
    } catch (err) {
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", registerData);
      toast.success("Registration successful!");
      setIsRegisterOpen(false);
      setRegisterData({ name: "", email: "", password: "" });
    } catch (err) {
      toast.error("Registration failed. Try a different email.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/");
    toast.success("Logged out successfully.");
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 shadow-md" : "bg-white"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div
              onClick={() => navigate("/")}
              className="text-2xl font-extrabold text-[#11a0d4] hover:text-orange-500 cursor-pointer tracking-wide"
            >
              KAIVALYA <span className="font-bold">INFOTECH</span>
            </div>

            <div className="hidden md:flex space-x-8">
              {[
                "Home",
                "Courses",
                "Certifications",
                "Reviews",
                "Internships",
                "Contact",
              ].map((item, i) => (
                <a
                  key={i}
                  href={item === "Home" ? `/` : `#${item.toLowerCase()}`}
                  className="relative group text-[#222222] hover:text-[#11a0d4] transition"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#11a0d4] transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>

            <div className="hidden md:flex space-x-4 items-center">
              {!currentUser ? (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-4 cursor-pointer py-2 border border-[#11a0d4] text-[#11a0d4] rounded hover:bg-[#11a0d4]/10 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-4 cursor-pointer py-2 bg-[#11a0d4] text-white font-semibold rounded hover:bg-orange-500 transition"
                  >
                    Register
                  </button>
                </>
              ) : (
                <>
                  {currentUser.role === "admin" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="px-4 cursor-pointer py-2 border border-[#11a0d4] text-[#11a0d4] rounded hover:bg-[#11a0d4]/10 transition"
                    >
                      Admin Panel
                    </button>
                  )}
                  <span className="text-[#222222] px-4 font-medium">
                    Hi, {currentUser.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-2.5 cursor-pointer py-2.5 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition flex items-center"
                  >
                    <LogOut className="mr-1" />
                  </button>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-[#222222]"
              >
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        <div
          className={`fixed inset-0 z-50 bg-white shadow-lg transition-transform duration-300 transform ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col p-4 space-y-3">
            <button
              onClick={() => setMenuOpen(false)}
              className="cursor-pointer self-end text-gray-500"
            >
              <X />
            </button>
            {[
              "Home",
              "Courses",
              "Certifications",
              "Reviews",
              "Internships",
              "Contact",
            ].map((item, i) => (
              <a
                key={i}
                href={item === "Home" ? `/` : `#${item.toLowerCase()}`}
                className="block text-[#222222] hover:text-[#11a0d4] transition"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            {!currentUser ? (
              <>
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    setMenuOpen(false);
                  }}
                  className="cursor-pointer w-full text-left px-4 py-2 border border-[#11a0d4] text-[#11a0d4] rounded hover:bg-[#11a0d4]/10"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsRegisterOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full cursor-pointer text-left px-4 py-2 bg-[#11a0d4] text-white rounded hover:bg-orange-500"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                {currentUser.role === "admin" && (
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setMenuOpen(false);
                    }}
                    className="w-full cursor-pointer text-left px-4 py-2 border border-[#11a0d4] text-[#11a0d4] rounded hover:bg-[#11a0d4]/10"
                  >
                    Admin Panel
                  </button>
                )}
                <span className="block cursor-pointer px-4 py-2 text-[#222222] font-medium">
                  Hi, {currentUser.name}
                </span>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full cursor-pointer text-left px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-20" />

      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="cursor-pointer absolute top-3 right-4 text-2xl text-gray-500"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-[#222222]">Login</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded border bg-gray-50 text-[#222222]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded border bg-gray-50 text-[#222222]"
                required
              />
              <button
                type="submit"
                className="cursor-pointer w-full py-2 bg-[#11a0d4] text-white rounded hover:bg-orange-500"
              >
                Login
              </button>
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <span
                  onClick={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                  }}
                  className="text-[#11a0d4] cursor-pointer"
                >
                  Register here
                </span>
              </p>
            </form>
          </div>
        </div>
      )}

      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsRegisterOpen(false)}
              className="cursor-pointer absolute top-3 right-4 text-2xl text-gray-500"
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-[#222222]">Register</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded border bg-gray-50 text-[#222222]"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded border bg-gray-50 text-[#222222]"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded border bg-gray-50 text-[#222222]"
                required
              />
              <button
                type="submit"
                className="cursor-pointer w-full py-2 bg-[#11a0d4] text-white rounded hover:bg-orange-500"
              >
                Register
              </button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="text-[#11a0d4] cursor-pointer"
                >
                  Login here
                </span>
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
