import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { MyContext } from "../context/MyContext";

const CertificationsPage = () => {
  const [certifications, setCertifications] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState(null);
  const scrollRef = useRef(null);
  const { setIsLoginOpen, currentUser } = useContext(MyContext);
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
        scrollContainer.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 3500);

    return () => {
      clearInterval(interval);
      clearTimeout(pauseTimeout);
      scrollContainer.removeEventListener("scroll", onUserScroll);
    };
  }, []);

  const openModal = (cert) => {
    if (!currentUser) {
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
        className="bg-[#fff8f1] md:min-h-[80vh] flex justify-center items-center"
      >
        <div className="max-w-7xl w-full px-4">
          <h2 className="text-3xl md:text-5xl font-extrabold text-black dark:text-white mb-5 mt-5 md:mb-0  tracking-tight drop-shadow-md select-none">
            Our Students offer letter...
          </h2>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto scroll-smooth snap-x snap-mandatory space-x-4 scrollbar-hide py-6"
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
                    className="flex-shrink-0 snap-start w-full sm:w-[300px] min-w-[280px] bg-white dark:bg-gray-800 border border-main-red dark:border-gray-700 shadow-xl transition-transform duration-300 hover:scale-105 relative"
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
                      className="absolute top-[40%] left-1/2 -translate-x-1/2 px-3 py-1 text-sm bg-main-red text-white cursor-pointer font-semibold shadow hover:bg-orange-600 transition"
                      title="View Certificate"
                    >
                      View
                    </button>

                    <div className="h-100 overflow-hidden bg-gradient-to-tr from-yellow-100 via-yellow-50 to-yellow-100 shadow-inner">
                      <img
                        src={`http://localhost:5000${certificate}`}
                        alt={`${title} certificate`}
                        className="w-full h-full object-contain object-center pointer-events-none select-none"
                        loading="lazy"
                        draggable={false}
                      />
                    </div>

                    {/* <div className="flex-1 p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white flex flex-col justify-end min-h-[8rem]">
                        <h4 className="text-lg font-semibold truncate">
                          {title}
                        </h4>
                        <p className="text-sm truncate">{issuer}</p>
                        <p className="text-xs italic opacity-80">
                          Issued: {new Date(issueDate).toLocaleDateString()}
                        </p>
                      </div> */}
                  </div>
                )
              )
            ) : (
              <div className="flex items-center justify-center w-full h-96">
                <h2 className="text-center text-2xl md:text-3xl font-semibold text-gray-500 dark:text-gray-400">
                  No certifications available.
                </h2>
              </div>
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
            className="relative bg-white dark:bg-gray-900 rounded-xl p-6 max-w-3xl w-full mx-4 overflow-y-auto max-h-[85vh] border-2 border-main-red shadow-xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-4 text-3xl text-red-500 hover:text-red-700 transition"
              title="Close"
            >
              &times;
            </button>

            <h3 className="text-2xl font-bold text-main-red dark:text-orange-300 mb-4 text-center">
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

      {/* Custom Scrollbar & Modal Animation */}
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
