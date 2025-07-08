import axios from "axios";
import { useEffect, useRef, useState } from "react";

const PlacedStudents = () => {
  const sliderRef = useRef(null);
  const [students, setStudents] = useState([]);

  // Fetch placement data from backend
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/placements"); // Adjust if your route is different
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching placement data:", err);
      }
    };

    fetchStudents();
  }, []);

  // Auto scroll slider
  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        const cardWidth = window.innerWidth < 640 ? 288 : 256;
        const gap = 32;
        const scrollAmount = cardWidth + gap;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({
            left: scrollAmount,
            behavior: "smooth",
          });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white px-6 sm:px-12" id="internships md:h-full">
      <h2 className="text-3xl md:text-5xl font-extrabold text-center text-[#11a0d4] dark:text-white mb-12 leading-tight font-display">
        Meet Our Placed Students
      </h2>

      <div className="relative overflow-hidden">
        <div
          ref={sliderRef}
          className="flex gap-8 overflow-x-auto scroll-smooth no-scrollbar px-2 sm:px-6"
          aria-label="Placed students carousel"
        >
          {students.map(({ _id, name, postName, companyName, imageUrl }) => (
            <div
              key={_id}
              className="flex-shrink-0 w-72 sm:w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border border-[#11a0d4] hover:shadow-xl transition-shadow duration-300"
              role="group"
            >
              <div className="relative w-28 h-28 mx-auto mb-5">
                <img
                  src={`http://localhost:5000${imageUrl}`}
                  alt={`${name} profile`}
                  className="rounded-full object-cover w-full h-full border-4 border-[#d8c1ac] shadow-md"
                />
                <span className="absolute inset-0 rounded-full border-2 border-[#11a0d4] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping" />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white font-display mb-1">
                {name}
              </h3>
              <p className="text-[#11a0d4] dark:text-[#11a0d4]-400 font-medium tracking-wide mb-1">
                {postName}
              </p>
              <p className="text-[#11a0d4] dark:text-gray-300 text-sm font-body">
                Placed at <span className="font-semibold">{companyName}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlacedStudents;
