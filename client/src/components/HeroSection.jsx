import { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/MyContext";

const posters = [
  "https://img.freepik.com/free-vector/python-programming-concept-illustration_114360-1357.jpg",
  "https://img.freepik.com/free-vector/java-programming-concept-illustration_114360-1358.jpg",
  "https://img.freepik.com/free-vector/c-programming-concept-illustration_114360-1359.jpg",
  "https://img.freepik.com/free-vector/ruby-programming-concept-illustration_114360-1360.jpg",
  "https://img.freepik.com/free-vector/php-programming-concept-illustration_114360-1361.jpg",
  "https://img.freepik.com/free-vector/c-plus-plus-programming-concept-illustration_114360-1362.jpg",
  "https://img.freepik.com/free-vector/go-programming-concept-illustration_114360-1363.jpg",
  "https://img.freepik.com/free-vector/swift-programming-concept-illustration_114360-1364.jpg",
  "https://img.freepik.com/free-vector/typescript-programming-concept-illustration_114360-1365.jpg",
  "https://img.freepik.com/free-vector/kotlin-programming-concept-illustration_114360-1366.jpg",
];

const HeroSection = () => {
  const [currentPoster, setCurrentPoster] = useState(0);

  const { setIsLoginOpen } = useContext(MyContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posters.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#fff8f1] dark:bg-gray-900">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {posters.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Background poster ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out
              ${index === currentPoster ? "opacity-100" : "opacity-0"}`}
            style={{ willChange: "opacity" }}
          />
        ))}
        {/* Overlay Gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 to-indigo-100/80 dark:from-gray-900/90 dark:to-gray-800/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-10 w-full">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-gray-900 dark:text-white">
            Learn, Build, and Grow with <br />
            <span className="text-main-red">Kaivalya Infotech</span>
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto md:mx-0 text-gray-700 dark:text-gray-300">
            Master Programming from Basics to Advanced. Learn C, C++, .NET, PHP,
            HTML, CSS, JavaScript & more. Build real-world projects guided by
            expert mentors. Guaranteed Internship Assurance for every learner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center sm:justify-start justify-center">
            <a
              href="#courses"
              className="cursor-pointer px-6 py-3 rounded-lg font-semibold shadow bg-main-red text-white hover:bg-hover-red transition"
            >
              View Courses
            </a>
          </div>
        </div>

        {/* Side Image */}
        <div className="hidden md:flex-1 md:flex justify-end">
          <img
            src="https://illustrations.popsy.co/gray/web-design.svg"
            alt="Hero Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
