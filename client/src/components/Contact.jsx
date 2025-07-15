import { useState } from "react";
import toast from "react-hot-toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url =
      "https://script.google.com/macros/s/AKfycbzihi7LNr-7V0zOIQRyZuMdTonJXBfsjoEgjSwKJPbFD2RMRL8zAFEp1qOm-5VMvgVZ/exec";

    const formEncoded = new URLSearchParams();
    formEncoded.append("Name", formData.name);
    formEncoded.append("Email", formData.email);
    formEncoded.append("Message", formData.message);

    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formEncoded.toString(),
      });

      toast.success("Thanks for contacting us! We'll reach out shortly.");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Oops! Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="contact"
      className="bg-[#fffdf7] md:pt-24 p-10 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 shadow-2xl rounded-2xl overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left - Info */}
          <div className="bg-main-red text-white p-10 flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-bold">Let’s Connect</h2>
            <p className="text-indigo-100">
              Got a project or question? Fill out the form and we’ll get back to
              you within 24 hours.
            </p>
            <div className="space-y-2 text-sm">
              <p>📞 +91 8097096461</p>
              <p>📞 +91 7021793688</p>
              <p>📧 support@kailvalyainfotech.com</p>
              <p>
                🏢 S. No. 22, Nav Neelkanth Plaza, Opp, Dnyaneshwar Karyalay, M.
                Phule Road, Dombivali (West) 421202{" "}
              </p>
            </div>
          </div>

          {/* Right - Form */}
          <form
            onSubmit={handleSubmit}
            className="p-10 sm:p-12 bg-white dark:bg-gray-800"
          >
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
              Contact Form
            </h3>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="full name"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-main-red px-4 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@example.com"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-main-red px-4 py-2"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Your Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Write your message here..."
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-main-red px-4 py-2 resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center bg-main-red hover:bg-hover-red text-white font-semibold py-3 rounded-md shadow-md transition ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
