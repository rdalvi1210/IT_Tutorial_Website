import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MyContext } from "../context/MyContext"; // Import your context

const ReviewsPage = () => {
  const scrollRef = useRef(null);
  const { isLoginOpen, setIsLoginOpen } = useContext(MyContext); // Use context for login state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    reviewer: "",
    rating: 5,
    review: "",
  });
  const [loading, setLoading] = useState(false); // Loading state

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCurrentUser(decoded);
        setFormData((prev) => ({ ...prev, reviewer: decoded.name || "" }));
      } catch (err) {
        console.error("Invalid token", err);
        localStorage.removeItem("token");
      }
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reviews");
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews", err);
      }
    };
    fetchReviews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      scroll("right");
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "rating" ? +value : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      setIsLoginOpen(true); // Open login modal if not logged in
      return;
    }
    setLoading(true); // Set loading state
    try {
      const res = await axios.post(
        "http://localhost:5000/api/reviews",
        formData
      );
      setReviews([res.data, ...reviews]);
      setFormData({
        reviewer: currentUser.name || "Anonymous",
        rating: 5,
        review: "",
      });
      setIsModalOpen(false);
      toast.success("Review submitted successfully!"); // Toast notification
    } catch (err) {
      console.error("Error submitting review", err);
      toast.error("Failed to submit review. Please try again."); // Toast notification
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const renderStars = (count) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={20}
        className={`mr-1 ${i < count ? "text-yellow-400" : "text-gray-300"}`}
        fill={i < count ? "#facc15" : "none"}
      />
    ));

  const scroll = (dir) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const card = container.querySelector("article");
    if (!card) return;

    const cardStyle = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth;
    const marginRight = parseInt(cardStyle.marginRight) || 0;
    const scrollAmount = cardWidth + marginRight;

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    let newScrollLeft;

    if (dir === "right") {
      newScrollLeft = container.scrollLeft + scrollAmount;
      if (newScrollLeft > maxScrollLeft) {
        newScrollLeft = 0;
      }
    } else {
      newScrollLeft = container.scrollLeft - scrollAmount;
      if (newScrollLeft < 0) {
        newScrollLeft = maxScrollLeft;
      }
    }

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="reviews"
      className="bg-white/95 px-6 py-8 md:pt-16 min-h-[300px]"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-[#11a0d4] dark:text-white mb-12 mt-4 text-center tracking-tight drop-shadow-md">
          Reviews
        </h2>

        <div className="relative flex items-center">
          <button
            onClick={() => scroll("left")}
            aria-label="Scroll Left"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 text-[#11a0d4] dark:text-indigo-300 p-2 rounded-full bg-white/80 dark:bg-gray-700/80 shadow-md hover:scale-110 transition"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-6 scroll-smooth no-scrollbar px-6 w-full"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {reviews.map(({ _id, reviewer, rating, review, date }) => (
              <article
                key={_id}
                className="w-80 flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition scroll-snap-align-start flex flex-col"
              >
                <h3 className="text-lg font-semibold text-gray-700 dark:text-indigo-400 mb-2">
                  {reviewer}
                </h3>
                <div className="mb-3 flex">{renderStars(rating)}</div>
                <p className="text-gray-700 dark:text-gray-300 text-sm flex-grow">
                  "{review}"
                </p>
                <time
                  className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-right italic"
                  dateTime={new Date(date).toISOString()}
                >
                  {new Date(date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </article>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            aria-label="Scroll Right"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 text-[#11a0d4] dark:text-indigo-300 p-2 rounded-full bg-white/80 dark:bg-gray-700/80 shadow-md hover:scale-110 transition"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={() => {
              if (!currentUser) {
                setIsLoginOpen(true); // Open login modal if not logged in
                return;
              }
              setIsModalOpen(true);
            }}
            className="text-[#11a0d4] cursor-pointer dark:text-indigo-400 underline font-medium text-base hover:text-[#874e19] dark:hover:text-indigo-300 transition"
          >
            Leave a review
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full p-10 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              aria-label="Close Modal"
              className="absolute top-6 right-6 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Submit Your Review
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input
                name="reviewer"
                type="text"
                required
                placeholder="Full Name"
                value={formData.reviewer}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />

              <div className="flex items-center gap-2">
                <span className="text-gray-600 dark:text-gray-300 font-medium">
                  Rating:
                </span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, rating: star }))
                    }
                    className="focus:outline-none"
                  >
                    <Star
                      size={24}
                      className={`transition ${
                        formData.rating >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill={formData.rating >= star ? "#facc15" : "none"}
                    />
                  </button>
                ))}
              </div>

              <textarea
                name="review"
                required
                rows={4}
                value={formData.review}
                onChange={handleChange}
                placeholder="Write your review..."
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />

              <button
                type="submit"
                className="w-full bg-[#11a0d4] hover:bg-[#ebb079] text-white cursor-pointer font-semibold py-3 rounded-lg transition"
                disabled={loading} // Disable button while loading
              >
                {loading ? "Submitting..." : "Submit Review"}{" "}
                {/* Show loading text */}
              </button>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scroll-snap-align-start {
          scroll-snap-align: start;
        }
      `}</style>
    </section>
  );
};

export default ReviewsPage;
