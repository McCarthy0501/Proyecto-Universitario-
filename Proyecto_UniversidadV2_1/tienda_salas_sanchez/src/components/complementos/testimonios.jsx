import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { API_BASE_URL } from "../../api";

function Testimonials() {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/reviews/ultimas/`);
        const data = await res.json();
        setReviews(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error al cargar reseñas:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center justify-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= Math.round(rating) ? "#fbbf24" : "transparent"}
            stroke={star <= Math.round(rating) ? "#fbbf24" : "#d1d5db"}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="relative max-w-3xl mx-auto py-12 px-4 bg-gray-100 rounded-xl shadow-lg">
        <div className="bg-white p-6 rounded-lg shadow-md w-full text-center animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-5 bg-gray-200 rounded w-32 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="relative max-w-3xl mx-auto py-12 px-4 bg-gray-100 rounded-xl shadow-lg">
        <div className="bg-white p-8 rounded-lg shadow-md w-full text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-700 mb-2">Aun no hay resenas</h3>
          <p className="text-gray-500">Las opiniones de nuestros clientes apareceran aqui cuando compren y califiquen productos.</p>
        </div>
      </div>
    );
  }

  const current = reviews[currentIndex];

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
          <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl font-bold mx-auto mb-4">
            {current.user_initial || 'U'}
          </div>
          <h3 className="text-lg font-bold mb-1">{current.user_name}</h3>
          <p className="text-xs text-gray-500 mb-2">Sobre: {current.product_name}</p>
          <div className="mb-2">{renderStars(current.rating)}</div>
          <p className="text-sm font-medium text-gray-800 mb-1">{current.subject}</p>
          <p className="text-gray-700 text-sm">{current.review_text}</p>
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
