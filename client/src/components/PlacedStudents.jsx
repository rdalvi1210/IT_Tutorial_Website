import axios from "axios";
import { useEffect, useRef, useState } from "react";

const PlacedStudents = () => {
  const sliderRef = useRef(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/placements");
        setStudents(res.data);
      } catch (err) {
        console.error("Error fetching placement data:", err);
      }
    };
    fetchStudents();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const slider = sliderRef.current;
      if (slider) {
        const { scrollLeft, scrollWidth, clientWidth } = slider;
        const card = slider.querySelector(".student-card");
        const cardWidth = card ? card.offsetWidth : 280;
        const gap = 32;
        const scrollAmount = cardWidth + gap;

        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          slider.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="internships"
      className="bg-[#fff8f1] md:min-h-[60vh] flex justify-center items-center px-4 py-8"
    >
      <div className="relative max-w-7xl w-full">
        <h2 className="text-3xl md:text-5xl font-extrabold text-black dark:text-white mb-5 mt-5 md:mt-0 md:mb-0 leading-tight font-display text-center md:text-left">
          Our Placed Students...
        </h2>

        {students.length > 0 ? (
          <div
            ref={sliderRef}
            className="flex gap-8 w-full overflow-x-auto scroll-smooth no-scrollbar py-4"
            aria-label="Placed students carousel"
          >
            {students.map(({ _id, name, postName, companyName, imageUrl }) => (
              <div
                key={_id}
                className="student-card flex-shrink-0 w-full sm:w-[280px] md:w-[32%] lg:w-[25%] bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center border-2 border-main-red hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <img
                    src={`http://localhost:5000${imageUrl}`}
                    alt={`${name} profile`}
                    className="rounded-full object-cover w-full h-full border-4 border-[#d8c1ac] shadow-md"
                  />
                  <span className="absolute inset-0 rounded-full border-2 border-main-red opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-ping" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                  {name}
                </h3>
                <p className="text-main-red font-medium tracking-wide mb-1">
                  {postName}
                </p>
                <p className="text-main-red dark:text-gray-300 text-sm">
                  Placed at <span className="font-semibold">{companyName}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[20rem] w-full">
            <h3 className="text-2xl text-gray-500 dark:text-gray-400 text-center">
              No students placed yet
            </h3>
          </div>
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default PlacedStudents;
