import { useState, useEffect, useRef, useCallback } from "react";
import { API_BASE_URL } from "../../api";
import { slides as staticSlides } from "../../logic/main/siler";

const AUTOPLAY_INTERVAL = 5000;

export const useSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState(staticSlides);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const fetchSlides = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/sliders/`);
        if (res.ok) {
          const data = await res.json();
          if (!cancelled && Array.isArray(data) && data.length > 0) {
            const mapped = data.map((s) => ({
              id: s.id,
              image: s.image,
              title: s.title,
              subtitle: s.subtitle || "",
              link_url: s.link_url || "",
              link_text: s.link_text || "Ver mas",
            }));
            setSlides(mapped);
          }
        }
      } catch {
        // fallback: static slides already set
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchSlides();
    return () => { cancelled = true; };
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  // Auto-play
  useEffect(() => {
    if (loading || isPaused || slides.length <= 1) return;
    intervalRef.current = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [loading, isPaused, nextSlide, slides.length]);

  // Swipe / touch
  const handleTouchStart = (e) => {
    touchStartX.current = e.clientX || e.touches?.[0]?.clientX || 0;
    touchStartY.current = e.clientY || e.touches?.[0]?.clientY || 0;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.clientX || e.changedTouches?.[0]?.clientX || 0;
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = (e.clientY || e.changedTouches?.[0]?.clientY || 0) - touchStartY.current;

    if (Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (Math.abs(deltaX) < 50) return;

    if (deltaX > 0) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      prevSlide();
    } else if (e.key === "ArrowRight") {
      nextSlide();
    }
  };

  return {
    currentIndex,
    slides,
    loading,
    isPaused,
    setIsPaused,
    nextSlide,
    prevSlide,
    goToSlide,
    handleTouchStart,
    handleTouchEnd,
    handleKeyDown,
  };
};
