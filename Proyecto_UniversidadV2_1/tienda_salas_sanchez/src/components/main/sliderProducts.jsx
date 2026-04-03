import { useSlider} from "../../Hooks/main/useSlider";
function SimpleSlider() {
  const{
    slides,
    prevSlide,
    nextSlide,
    currentIndex,
  }=useSlider();
  return (
    <div className="relative w-full h-64 sm:h-80 md:h-[450px] lg:h-[350px] overflow-hidden rounded-xl shadow-2xl">
      {/* Slider */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {slides.map((slide) => (
          <div className="min-w-full h-full relative" key={slide.id}>
            <img
              src={slide.image}
              alt={`Slide ${slide.id}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Botones */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
      >
        &#10094;
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors z-10"
      >
        &#10095;
      </button>
      
      {/* Indicadores */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              const slider = document.querySelector('[data-slider]');
              if (slider) slider.style.transition = 'none';
            }}
            className={`w-2 h-2 rounded-full transition-colors ${
              idx === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default SimpleSlider;
