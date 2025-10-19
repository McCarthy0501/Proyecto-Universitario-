import { useState } from "react";

function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Juan Pérez",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
      stars: 5,
      comment: "Excelente servicio y productos de muy buena calidad. ¡Recomendado!",
    },
    {
      id: 2,
      name: "María Gómez",
      photo: "https://randomuser.me/api/portraits/women/44.jpg",
      stars: 4,
      comment: "Muy buena atención, los productos llegaron rápido y en buen estado.",
    },
    {
      id: 3,
      name: "Carlos Rodríguez",
      photo: "https://randomuser.me/api/portraits/men/55.jpg",
      stars: 5,
      comment: "Me encanta la tienda, siempre encuentro lo que necesito.",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const renderStars = (count) => {
    return "★".repeat(count) + "☆".repeat(5 - count);
  };

  return (
    <div className="relative max-w-3xl mx-auto py-12 px-4 bg-gray-100 rounded-xl shadow-lg">
      <div className="flex items-center justify-center">
        <button
          onClick={prevReview}
          className="text-2xl font-bold mr-4 hover:text-gray-700"
        >
          &#10094;
        </button>

        <div className="bg-white p-6 rounded-lg shadow-md w-full text-center">
          <img
            src={reviews[currentIndex].photo}
            alt={reviews[currentIndex].name}
            className="w-16 h-16 rounded-full mx-auto mb-4"
          />
          <h3 className="text-lg font-bold mb-1">{reviews[currentIndex].name}</h3>
          <p className="text-yellow-500 mb-2">{renderStars(reviews[currentIndex].stars)}</p>
          <p className="text-gray-700">{reviews[currentIndex].comment}</p>
        </div>

        <button
          onClick={nextReview}
          className="text-2xl font-bold ml-4 hover:text-gray-700"
        >
          &#10095;
        </button>
      </div>
    </div>
  );
}

export default Testimonials;
