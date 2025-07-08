import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../context/MyContext";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { isLoginOpen, setIsLoginOpen } = useContext(MyContext);

  // Responsive cards per slide
  const [cardsPerSlide, setCardsPerSlide] = useState(3);

  // Update cardsPerSlide on window resize for responsiveness
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth < 640) setCardsPerSlide(1);
      else if (window.innerWidth < 1024) setCardsPerSlide(2);
      else setCardsPerSlide(3);
    };
    updateCardsPerSlide();
    window.addEventListener("resize", updateCardsPerSlide);
    return () => window.removeEventListener("resize", updateCardsPerSlide);
  }, []);

  const maxIndex = Math.max(0, courses.length - cardsPerSlide);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/courses");
        setCourses(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const closeModal = useCallback(() => setSelectedCourse(null), []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeModal]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        return prevIndex >= maxIndex ? 0 : prevIndex + 1;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [maxIndex]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [courses.length, cardsPerSlide]);

  // Left/Right buttons handlers
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };
  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch swipe handlers
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const swipeThreshold = 50;
    if (diff > swipeThreshold) handleNext();
    else if (diff < -swipeThreshold) handlePrev();
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <p className="text-[#11a0d4] dark:text-gray-300">Loading courses...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );

  const handleViewDetails = (course) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoginOpen(true);
    } else {
      setSelectedCourse(course);
    }
  };

  return (
    <section
      id="courses"
      className="bg-white shadow-md md:py-16 py-8 px-4 sm:px-6 lg:px-8 relative md:min-h-screen"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center text-[#11a0d4] dark:text-white mb-12 tracking-tight">
          Explore Our Courses
        </h2>

        <div className="overflow-hidden relative">
          {/* Left Chevron */}
          <button
            onClick={handlePrev}
            aria-label="Previous courses"
            className="absolute top-1/2 left-2 transform -translate-y-1/2 z-30 bg-white dark:bg-gray-900 rounded-full p-3 sm:p-2 shadow hover:bg-[#11a0d4] hover:text-white transition"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Chevron */}
          <button
            onClick={handleNext}
            aria-label="Next courses"
            className="absolute top-1/2 right-2 transform -translate-y-1/2 z-30 bg-white dark:bg-gray-900 rounded-full p-3 sm:p-2 shadow hover:bg-[#11a0d4] hover:text-white transition"
          >
            <ChevronRight size={24} />
          </button>

          <div
            ref={sliderRef}
            className="flex transition-transform duration-500"
            style={{
              width: `${(courses.length * 100) / cardsPerSlide}%`,
              transform: `translateX(-${
                (currentIndex * 100) / courses.length
              }%)`,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {courses.map((course) => {
              const { id, title, description, category, imageUrl, duration } =
                course;
              return (
                <article
                  key={id}
                  className="flex-shrink-0"
                  style={{
                    width: `${100 / courses.length}%`,
                    minWidth: "280px",
                  }}
                  onClick={() => handleViewDetails(course)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleViewDetails(course);
                    }
                  }}
                  aria-label={`View details about ${title}`}
                >
                  <div className="flex flex-col bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-2xl transition-shadow duration-300 cursor-pointer mx-2">
                    <div className="relative overflow-hidden rounded-t-3xl">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(course);
                        }}
                        className="absolute top-4 right-4 px-5 py-2 bg-[#11a0d4] text-white rounded-full font-semibold hover:bg-[#f0bb87] transition text-sm sm:text-base cursor-pointer z-20 shadow-lg"
                        aria-label={`View details of ${title}`}
                      >
                        View Details
                      </button>

                      <img
                        src={`http://localhost:5000${imageUrl}`}
                        alt={`${title} banner`}
                        className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl sm:text-2xl font-semibold text-[#11a0d4] dark:text-indigo-400 mb-3">
                        {title}
                      </h3>

                      <p className="text-gray-700 dark:text-gray-300 flex-grow leading-relaxed text-sm sm:text-base mb-4 line-clamp-2">
                        {description}
                      </p>

                      <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
                        <span>⏳ Duration: {duration}</span>
                        <span className="inline-block bg-indigo-100 text-[#11a0d4] dark:bg-indigo-800 dark:text-white px-3 py-1 rounded-full">
                          {category}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute cursor-pointer top-5 right-5 text-gray-600 dark:text-gray-300 hover:text-[#11a0d4] dark:hover:text-[#c9b8a8] text-4xl font-extrabold leading-none transition"
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
              <img
                src={`http://localhost:5000${selectedCourse.imageUrl}`}
                alt={`${selectedCourse.title} icon`}
                className="h-32 w-32 sm:h-40 sm:w-40 object-cover rounded-xl shadow-md"
                loading="lazy"
              />

              <div className="flex flex-col flex-grow">
                <h3
                  id="modal-title"
                  className="text-3xl sm:text-4xl font-extrabold text-[#11a0d4] dark:text-[#ecd7c3] mb-4"
                >
                  {selectedCourse.title}
                </h3>

                <span className="inline-block bg-indigo-100 text-[#11a0d4] dark:bg-indigo-800 dark:text-white text-sm font-semibold px-4 py-2 rounded-full mb-4 w-max">
                  {selectedCourse.category}
                </span>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-base sm:text-lg">
                  {selectedCourse.details || selectedCourse.description}
                </p>
              </div>
            </div>

            <hr className="my-6 border-gray-300 dark:border-gray-600" />

            <button
              onClick={closeModal}
              className="mt-2 w-full cursor-pointer sm:w-auto px-8 py-3 bg-[#11a0d4] text-white rounded-xl font-semibold hover:bg-[#845326] transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Animation style */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
      `}</style>
    </section>
  );
};

export default CoursesPage;
