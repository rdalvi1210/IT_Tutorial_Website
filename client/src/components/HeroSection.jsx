import axios from "axios";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

const ImageSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/banners");
        setBanners(res.data);
      } catch (err) {
        console.error("Failed to load banners:", err);
      }
    };
    fetchBanners();
  }, []);

  // Auto slide every 6 seconds
  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [banners]);

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

  if (banners.length === 0) {
    return (
      <div className="h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center bg-gray-100 text-gray-500">
        Loading banners...
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden h-[250px] sm:h-[400px] md:h-[500px] bg-black">
      {/* Slides */}
      <div className="absolute inset-0 z-0">
        {banners.map((banner, index) => (
          // 1600px × 500px
          <img
            key={index}
            src={`http://localhost:5000${banner.imageUrl}`}
            alt={`Banner ${index + 1}`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* Overlay (optional gradient) */}
      <div className="absolute inset-0 bg-black/20 backdrop-brightness-[0.9] z-10 pointer-events-none" />

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 sm:left-4 z-20 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full transition shadow-md"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 sm:right-4 z-20 -translate-y-1/2 bg-white/70 hover:bg-white p-2 rounded-full transition shadow-md"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-black" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {banners.map((_, index) => (
          <div
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition cursor-pointer ${
              index === currentIndex
                ? "bg-white"
                : "bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default ImageSlider;
