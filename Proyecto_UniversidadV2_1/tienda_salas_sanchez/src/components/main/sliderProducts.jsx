import { useSlider} from "../../Hooks/main/useSlider";
function SimpleSlider() {
  // usamos el hook personalizado
  const{
    slides,
    prevSlide,
    nextSlide,
    currentIndex,
  }=useSlider();
  return (
    <div className="relative w-full h-80 md:h-[500px] lg:h-[400px] overflow-hidden rounded-xl shadow-2xl">
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
