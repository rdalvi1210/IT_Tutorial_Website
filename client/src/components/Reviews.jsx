import axios from "axios";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MyContext } from "../context/MyContext";

const ReviewsPage = () => {
  const scrollRef = useRef(null);
  const { setIsLoginOpen, currentUser } = useContext(MyContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    reviewer: "",
    rating: 5,
    review: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.name) {
      setFormData((prev) => ({ ...prev, reviewer: currentUser.name }));
    }
  }, [currentUser]);

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
    if (reviews.length === 0) return;
    const interval = setInterval(() => scroll("right"), 5000);
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
      setIsLoginOpen(true);
      return;
    }

    setLoading(true);
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
      toast.success("Review submitted successfully!");
    } catch {
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
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
    const container = scrollRef.current;
    if (!container) return;

    const card = container.querySelector("article");
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const style = window.getComputedStyle(card);
    const marginRight = parseInt(style.marginRight);
    const scrollAmount = cardWidth + marginRight;
    const maxScroll = container.scrollWidth - container.clientWidth;

    let newLeft =
      dir === "right"
        ? container.scrollLeft + scrollAmount
        : container.scrollLeft - scrollAmount;

    if (newLeft > maxScroll) newLeft = 0;
    if (newLeft < 0) newLeft = maxScroll;

    container.scrollTo({ left: newLeft, behavior: "smooth" });
  };

  return (
    <section
      id="reviews"
      className="bg-[#fff8f1] min-h-[60vh] flex justify-center items-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full px-4">
        <h2 className="text-3xl md:text-5xl font-extrabold text-black mb-8 text-center md:text-left">
          What our Students Say...
        </h2>

        {/* Arrows and Reviews */}
        <div className="relative flex items-center">
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 z-20 p-2 rounded-full bg-white/90 shadow-md hover:scale-110 transition text-main-red hidden sm:block"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={28} />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-6 scroll-smooth no-scrollbar w-full px-1 py-1 sm:px-12"
            style={{ scrollSnapType: "x mandatory", scrollPaddingLeft: "1rem" }}
          >
            {reviews.length === 0 ? (
              <div className="w-full text-center text-gray-600 text-xl font-semibold min-h-[200px] flex items-center justify-center">
                No reviews yet
              </div>
            ) : (
              reviews.map(({ _id, reviewer, rating, review, date }) => (
                <article
                  key={_id}
                  className="flex-shrink-0 w-[90vw] max-w-xs sm:w-72 sm:max-w-sm
                    bg-gradient-to-br from-[#fff0eb] via-[#ffe4d9] to-[#ffdad0]
                    text-gray-800 border border-main-red
                    shadow-md rounded-xl p-6
                    flex flex-col justify-between
                    scroll-snap-align-start transition-all hover:shadow-lg hover:scale-[1.02]"
                >
                  <div className="flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-2 leading-snug truncate">
                      {reviewer}
                    </h3>
                    <div className="mb-3 flex">{renderStars(rating)}</div>
                    <p className="text-base text-main-red font-extrabold italic leading-relaxed break-words">
                      “{review}”
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    {/* Badge */}
                    <span className="text-xs bg-main-red text-white px-3 py-1 rounded-full font-semibold shadow-sm">
                      Verified Student
                    </span>

                    {/* Date */}
                    <time
                      className="text-xs text-gray-600"
                      dateTime={new Date(date).toISOString()}
                    >
                      {new Date(date).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                </article>
              ))
            )}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute right-0 z-20 p-2 rounded-full bg-white/90 shadow-md hover:scale-110 transition text-main-red hidden sm:block"
            aria-label="Scroll Right"
          >
            <ChevronRight size={28} />
          </button>
        </div>

        {/* Leave Review Button */}
        <div className="mt-10 text-center">
          <button
            onClick={() =>
              currentUser ? setIsModalOpen(true) : setIsLoginOpen(true)
            }
            className="text-main-red underline text-xl md:text-2xl cursor-pointer font-semibold hover:text-hover-red transition"
          >
            Leave a review
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-10 relative shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-gray-600 hover:text-gray-900 text-2xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">
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
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-main-red focus:outline-none"
              />

              <div className="flex items-center gap-2">
                <span className="text-gray-700 font-medium">Rating:</span>
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
                          : "text-gray-400"
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
                className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-900 focus:ring-2 focus:ring-main-red focus:outline-none resize-none"
              />

              <button
                type="submit"
                className="w-full bg-main-red hover:bg-hover-red text-white font-semibold py-3 rounded-lg transition"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Scrollbar and snap alignment CSS */}
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
