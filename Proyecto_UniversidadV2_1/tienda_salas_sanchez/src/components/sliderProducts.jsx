import { useState } from "react";
import img1 from "../assets/imagenes/slider/oferta_medicamentos.webp";
import img2 from"../assets/imagenes/slider/oferta_tecnologia.webp";
import img3 from"../assets/imagenes/slider/oferta_comidarapida.webp";
import img4 from"../assets/imagenes/slider/oferta_motos.webp";
function SimpleSlider() {
  // Array de imágenes por URL
  const slides = [
    {
      id: 1,
      image: img1,
    },
    {
      id: 2,
      image: img2,
    },
    {
      id: 3,
      image: img3,
    },
    {
      id: 4,
      image: img4,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative w-full h-80 md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl shadow-2xl">
      {/* Slider */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div className="min-w-full" key={slide.id}>
            <img
              src={slide.image}
              alt={`Slide ${slide.id}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>

      {/* Botones */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-200"
      >
        &#10095;
      </button>
    </div>
  );
}

export default SimpleSlider;
