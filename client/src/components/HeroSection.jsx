import { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/MyContext";

const posters = [
  "https://img.freepik.com/free-vector/python-programming-concept-illustration_114360-1357.jpg", // Python
  "https://img.freepik.com/free-vector/java-programming-concept-illustration_114360-1358.jpg", // Java
  "https://img.freepik.com/free-vector/c-programming-concept-illustration_114360-1359.jpg", // C Programming
  "https://img.freepik.com/free-vector/ruby-programming-concept-illustration_114360-1360.jpg", // Ruby
  "https://img.freepik.com/free-vector/php-programming-concept-illustration_114360-1361.jpg", // PHP
  "https://img.freepik.com/free-vector/c-plus-plus-programming-concept-illustration_114360-1362.jpg", // C++
  "https://img.freepik.com/free-vector/go-programming-concept-illustration_114360-1363.jpg", // Go
  "https://img.freepik.com/free-vector/swift-programming-concept-illustration_114360-1364.jpg", // Swift
  "https://img.freepik.com/free-vector/typescript-programming-concept-illustration_114360-1365.jpg", // TypeScript
  "https://img.freepik.com/free-vector/kotlin-programming-concept-illustration_114360-1366.jpg", // Kotlin
];

const HeroSection = () => {
  const [currentPoster, setCurrentPoster] = useState(0);

  const { setIsLoginOpen } = useContext(MyContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPoster((prev) => (prev + 1) % posters.length);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-gray-900">
      {/* Background Slider */}
      <div className="absolute inset-0 z-0">
        {posters.map((src, index) => (
          <img
            key={index}
            src={src}
            alt={`Background poster ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1500 ease-in-out
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Learn, Build, and Grow with <br />
            <span className="text-[#11a0d4]">Kaivalya Infotech</span>
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto md:mx-0">
            Master Programming from Basics to Advanced. Learn C, C++, .NET, PHP,
            HTML, CSS, JavaScript & more. Build real-world projects guided by
            expert mentors. Guaranteed Internship Assurance for every learner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center sm:justify-start justify-center">
            <a
              href="#courses"
              className="bg-[#11a0d4] cursor-pointer text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-500 transition shadow"
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
