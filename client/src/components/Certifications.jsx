import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../context/MyContext";

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const scrollRef = useRef(null);
  const { setIsLoginOpen } = useContext(MyContext);
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/certificates");
        setCertifications(res.data);
      } catch (err) {
        console.error("Failed to fetch certificates:", err);
      }
    };
    fetchCertifications();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let isUserScrolling = false;
    const onUserScroll = () => {
      isUserScrolling = true;
      clearTimeout(pauseTimeout);
      pauseTimeout = setTimeout(() => (isUserScrolling = false), 3000);
    };
    scrollContainer.addEventListener("scroll", onUserScroll);

    let pauseTimeout = null;
    const interval = setInterval(() => {
      if (isUserScrolling) return;
      if (
        scrollContainer.scrollLeft + scrollContainer.clientWidth >=
        scrollContainer.scrollWidth - 1
      ) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({ left: 280, behavior: "smooth" });
      }
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(pauseTimeout);
      scrollContainer.removeEventListener("scroll", onUserScroll);
    };
  }, []);

  const openModal = (cert) => {
    if (!isLoggedIn) {
      setIsLoginOpen(true);
      return;
    }
    setSelectedCert(cert);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedCert(null);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && modalOpen) closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalOpen]);

  return (
    <>
      <section
        id="certifications"
        className="bg-gradient-to-b from-white to-gray-50 shadow-sm  px-6 py-8 md:py-16"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#11a0d4] dark:text-white mb-8 text-center tracking-tight drop-shadow-md select-none">
            Placed Students Offer Letters
          </h2>

          <div
            ref={scrollRef}
            className="flex space-x-6 overflow-x-auto py-6 px-2 scrollbar-hide scroll-smooth"
            tabIndex={0}
            aria-label="Certificate slider"
          >
            {certifications.length > 0 ? (
              certifications.map(
                ({
                  _id,
                  title,
                  issuer,
                  description,
                  issueDate,
                  certificate,
                }) => (
                  <div
                    key={_id}
                    className="relative scroll-mx-6 flex-shrink-0 w-72 h-96 flex flex-col rounded-2xl shadow-xl transition-transform duration-300 hover:scale-105 bg-white dark:bg-gray-800 border border-[#11a0d4] dark:border-gray-700"
                    style={{ scrollSnapAlign: "center" }}
                  >
                    {/* View Button */}
                    <button
                      onClick={() =>
                        openModal({
                          title,
                          certificate: `http://localhost:5000${certificate}`,
                          issuer,
                          description,
                          issueDate,
                        })
                      }
                      className="absolute cursor-pointer top-[40%] right-[40%] px-3 py-1 text-sm bg-[#11a0d4] text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition"
                      title="View Certificate"
                    >
                      View
                    </button>

                    <div className="h-64 overflow-hidden rounded-t-2xl bg-gradient-to-tr from-yellow-100 via-yellow-50 to-yellow-100 shadow-inner">
                      <img
                        src={`http://localhost:5000${certificate}`}
                        alt={`${title} certificate`}
                        className="w-full h-full object-cover select-none pointer-events-none"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>
                    <div className="flex-1 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white rounded-b-2xl flex flex-col justify-end">
                      <h4 className="text-lg font-semibold truncate">
                        {title}
                      </h4>
                      <p className="text-sm truncate">{issuer}</p>
                      <p className="text-xs italic opacity-80 select-text">
                        Issued: {new Date(issueDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 w-full">
                No certifications available.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {modalOpen && selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
          aria-modal="true"
          role="dialog"
        >
          <div
            className="relative bg-white dark:bg-gray-900 rounded-xl p-6 max-w-3xl w-full mx-4 overflow-y-auto max-h-[85vh] border-2 border-[#11a0d4] shadow-xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute cursor-pointer top-3 right-4 text-3xl text-red-500 hover:text-red-700 transition"
              title="Close"
            >
              &times;
            </button>

            {/* Certificate Content */}
            <h3 className="text-2xl font-bold text-[#11a0d4] dark:text-orange-300 mb-4 text-center">
              {selectedCert.title}
            </h3>
            <img
              src={selectedCert.certificate}
              alt={`${selectedCert.title} certificate`}
              className="w-full h-auto rounded-md border"
              loading="lazy"
              draggable={false}
            />
            <div className="mt-4 space-y-1 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Issuer:</strong> {selectedCert.issuer}
              </p>
              <p>
                <strong>Description:</strong> {selectedCert.description}
              </p>
              <p className="text-sm italic text-gray-500">
                Issued on:{" "}
                {new Date(selectedCert.issueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Custom Scrollbar for Modal */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default CertificationsPage;
