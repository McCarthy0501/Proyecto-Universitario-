import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSlider } from "../../Hooks/main/useSlider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Skeleton from "../complementos/Skeleton";

const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? "100%" : "-100%", opacity: 0 }),
};

function SimpleSlider() {
  const {
    slides,
    currentIndex,
    prevSlide,
    nextSlide,
    goToSlide,
    loading,
    isPaused,
    setIsPaused,
    handleTouchStart,
    handleTouchEnd,
    handleKeyDown,
  } = useSlider();

  const navigate = useNavigate();
  const [direction, setDirection] = useState(0);

  if (loading) {
    return (
      <div className="relative w-full h-64 sm:h-80 md:h-[450px] lg:h-[500px] overflow-hidden rounded-xl shadow-2xl bg-gray-200">
        <Skeleton width="100%" height="100%" rounded="rounded-xl" />
      </div>
    );
  }

  if (!slides.length) return null;

  const handlePrev = () => {
    setDirection(-1);
    prevSlide();
  };

  const handleNext = () => {
    setDirection(1);
    nextSlide();
  };

  const handleCTA = (slide) => {
    if (!slide.link_url) return;
    if (slide.link_url.startsWith("/")) {
      navigate(slide.link_url);
    } else {
      window.location.href = slide.link_url;
    }
  };

  return (
    <div
      className="relative w-full h-64 sm:h-80 md:h-[450px] lg:h-[500px] overflow-hidden rounded-xl shadow-2xl group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Slider principal"
    >
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slides[currentIndex].image}
            alt={slides[currentIndex].title || `Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover"
            loading={currentIndex === 0 ? "eager" : "lazy"}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {(slides[currentIndex].title || slides[currentIndex].subtitle) && (
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 sm:pb-20 px-6 text-center">
              {slides[currentIndex].title && (
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg mb-2"
                >
                  {slides[currentIndex].title}
                </motion.h2>
              )}
              {slides[currentIndex].subtitle && (
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35, duration: 0.5 }}
                  className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 drop-shadow-md mb-4 max-w-2xl"
                >
                  {slides[currentIndex].subtitle}
                </motion.p>
              )}
              {slides[currentIndex].link_url && (
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  onClick={() => handleCTA(slides[currentIndex])}
                  className="px-6 py-2.5 sm:px-8 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
                >
                  {slides[currentIndex].link_text || "Ver mas"}
                </motion.button>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Flechas de navegación */}
      {slides.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden sm:block"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden sm:block"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Indicadores (dots) */}
      {slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                goToSlide(idx);
              }}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                idx === currentIndex
                  ? "bg-blue-600 w-8"
                  : "bg-white/70 hover:bg-white"
              }`}
              aria-label={`Ir al slide ${idx + 1}`}
              aria-current={idx === currentIndex ? "true" : "false"}
            />
          ))}
        </div>
      )}

      {/* Progreso auto-play */}
      {!isPaused && slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-10">
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="h-full bg-blue-600"
          />
        </div>
      )}
    </div>
  );
}

export default SimpleSlider;
