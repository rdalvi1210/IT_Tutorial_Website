import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { LogOut, Menu, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../context/MyContext";

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 text-white mx-auto"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
);

const Navbar = () => {
  const {
    currentUser,
    setCurrentUser,
    isLoginOpen,
    setIsLoginOpen,
    isRegisterOpen,
    setIsRegisterOpen,
  } = useContext(MyContext);

  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isVerified, setIsVerified] = useState(false);
  const [otpModal, setOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  // Timer states for OTP resend
  const [otpTimer, setOtpTimer] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  // Loading states
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [sendOtpLoading, setSendOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
      } catch (err) {
        console.error("Invalid token in sessionStorage");
        sessionStorage.removeItem("token");
      }
    }
  }, [setCurrentUser]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // OTP resend countdown timer effect
  useEffect(() => {
    let timer;
    if (resendDisabled && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    if (otpTimer === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    return () => clearInterval(timer);
  }, [resendDisabled, otpTimer]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        loginData,
        { withCredentials: true }
      );
      const token = res.data.token;
      if (token) {
        const decodedUser = jwtDecode(token);
        setCurrentUser(decodedUser);
        sessionStorage.setItem("token", token);
        toast.success(`Welcome ${decodedUser.name}!`);
        setIsLoginOpen(false);
        setLoginData({ email: "", password: "" });
        navigate(decodedUser.role === "admin" ? "/admin" : "/");
      } else {
        toast.error("Login failed: No token received");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", registerData);
      toast.success("Registration successful!");
      setIsRegisterOpen(false);
      setRegisterData({ name: "", email: "", password: "" });
      setIsVerified(false);
    } catch (err) {
      toast.error("Registration failed. Try a different email.");
    } finally {
      setRegisterLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!registerData.email) {
      toast.error("Please enter email first.");
      return;
    }

    setSendOtpLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/api/auth/send-otp",
        { email: registerData.email },
        { withCredentials: true }
      );
      toast.success("OTP sent to email!");
      setOtpModal(true);
      setResendDisabled(true);
      setOtpTimer(60); // start 60 seconds timer
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send OTP. Try again.";
      toast.error(errorMessage);
    } finally {
      setSendOtpLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      setCurrentUser(null);
      sessionStorage.removeItem("token");
      toast.success("Logged out successfully.");
      navigate("/");
    } catch (err) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const links = [
    "Home",
    "Courses",
    "Certifications",
    "Reviews",
    "Internships",
    "Contact",
  ];

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
              className="text-2xl font-extrabold text-main-red hover:text-hover-red cursor-pointer tracking-wide"
            >
              KAIVALYA <span className="font-bold text-black ">INFOTECH</span>
            </div>

            <div className="hidden md:flex space-x-8">
              {links.map((item, i) => (
                <a
                  key={i}
                  href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                  className="relative group text-black hover:text-main-red transition"
                >
                  {item}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-main-red transition-all group-hover:w-full"></span>
                </a>
              ))}
            </div>

            <div className="hidden md:flex space-x-4 items-center">
              {currentUser ? (
                <>
                  {currentUser.role === "admin" && (
                    <button
                      onClick={() => navigate("/admin")}
                      className="px-4 py-2 border border-main-red text-main-red rounded hover:bg-main-red-10 transition"
                    >
                      Admin Panel
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-3 py-2 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition flex items-center"
                  >
                    <LogOut className="mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="px-4 py-2 border border-main-red text-main-red rounded hover:bg-main-red-10 transition flex justify-center items-center"
                    disabled={loginLoading}
                  >
                    {loginLoading ? <Spinner /> : "Login"}
                  </button>
                  <button
                    onClick={() => setIsRegisterOpen(true)}
                    className="px-4 py-2 bg-main-red text-white font-semibold rounded hover:bg-hover-red transition flex justify-center items-center"
                    disabled={registerLoading}
                  >
                    {registerLoading ? <Spinner /> : "Register"}
                  </button>
                </>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-black"
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
              className="self-end cursor-pointer text-gray-500"
            >
              <X />
            </button>
            {links.map((item, i) => (
              <a
                key={i}
                href={item === "Home" ? "/" : `#${item.toLowerCase()}`}
                className="block text-black hover:text-main-red transition"
                onClick={() => setMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            {currentUser ? (
              <>
                {currentUser.role === "admin" && (
                  <button
                    onClick={() => {
                      navigate("/admin");
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 border border-main-red text-main-red rounded hover:bg-main-red-10"
                  >
                    Admin Panel
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsLoginOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 border border-main-red text-main-red rounded hover:bg-main-red-10"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsRegisterOpen(true);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 bg-main-red text-white rounded hover:bg-hover-red"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="pt-20" />

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setIsLoginOpen(false)}
              className="absolute top-3 right-4 text-2xl text-gray-500"
              disabled={loginLoading}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-black">Login</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                required
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                className="w-full px-4 py-2 rounded border bg-gray-50 text-black"
                disabled={loginLoading}
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded border bg-gray-50 text-black"
                disabled={loginLoading}
              />
              <button
                type="submit"
                className="w-full py-2 bg-main-red text-white rounded hover:bg-hover-red transition flex justify-center items-center"
                disabled={loginLoading}
              >
                {loginLoading ? <Spinner /> : "Login"}
              </button>
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{" "}
                <span
                  onClick={() => {
                    setIsLoginOpen(false);
                    setIsRegisterOpen(true);
                  }}
                  className="text-main-red cursor-pointer"
                >
                  Register here
                </span>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => {
                setIsRegisterOpen(false);
                setRegisterData({
                  name: "",
                  email: "",
                  password: "",
                });
                setIsVerified(false);
              }}
              className="absolute top-3 right-4 text-2xl text-gray-500"
              disabled={registerLoading}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-black">Register</h3>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={registerData.name}
                onChange={(e) =>
                  setRegisterData({ ...registerData, name: e.target.value })
                }
                className="w-full px-4 py-2 rounded border bg-gray-50 text-black"
                disabled={registerLoading}
              />
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={registerData.email}
                  onChange={(e) => {
                    setRegisterData({ ...registerData, email: e.target.value });
                    setIsVerified(false);
                  }}
                  className="w-full px-4 py-2 rounded border bg-gray-50 text-black"
                  disabled={registerLoading || sendOtpLoading}
                />
                {isVerified ? (
                  <span className="text-green-600 font-semibold flex items-center">
                    ✅
                  </span>
                ) : (
                  <button
                    type="button"
                    className={`text-sm px-3 py-1 rounded transition flex justify-center items-center ${
                      resendDisabled
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-main-red text-white hover:bg-hover-red"
                    }`}
                    onClick={handleSendOtp}
                    disabled={resendDisabled || sendOtpLoading}
                  >
                    {sendOtpLoading ? (
                      <Spinner />
                    ) : resendDisabled ? (
                      `Retry in ${otpTimer}s`
                    ) : (
                      "Verify"
                    )}
                  </button>
                )}
              </div>
              <input
                type="password"
                placeholder="Password"
                required
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded border bg-gray-50 text-black"
                disabled={registerLoading}
              />
              <button
                type="submit"
                disabled={!isVerified || registerLoading}
                className={`w-full py-2 flex justify-center items-center ${
                  isVerified
                    ? "bg-main-red text-white hover:bg-hover-red"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                } rounded transition`}
              >
                {registerLoading ? <Spinner /> : "Register"}
              </button>
              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    setIsRegisterOpen(false);
                    setIsLoginOpen(true);
                  }}
                  className="text-main-red cursor-pointer"
                >
                  Login here
                </span>
              </p>
            </form>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {otpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm relative">
            <button
              onClick={() => setOtpModal(false)}
              className="absolute top-3 right-4 text-2xl text-gray-500"
              disabled={verifyOtpLoading}
            >
              &times;
            </button>
            <h3 className="text-lg font-bold mb-4 text-black">Enter OTP</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setVerifyOtpLoading(true);
                try {
                  const res = await axios.post(
                    "http://localhost:5000/api/auth/verify-otp",
                    { email: registerData.email, otp }
                  );
                  if (res.data.success) {
                    toast.success("Email verified successfully!");
                    setIsVerified(true);
                    setOtpModal(false);
                  } else {
                    toast.error("Invalid OTP");
                  }
                } catch (err) {
                  toast.error("Verification failed");
                } finally {
                  setVerifyOtpLoading(false);
                }
              }}
              className="space-y-4"
            >
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 rounded border bg-gray-50 text-black"
                required
                disabled={verifyOtpLoading}
              />
              <button
                type="submit"
                className="w-full py-2 bg-main-red text-white rounded hover:bg-hover-red transition flex justify-center items-center"
                disabled={verifyOtpLoading}
              >
                {verifyOtpLoading ? <Spinner /> : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
