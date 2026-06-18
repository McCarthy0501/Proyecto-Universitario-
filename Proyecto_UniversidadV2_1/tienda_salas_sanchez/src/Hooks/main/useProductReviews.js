import { useState, useEffect } from "react";
import { API_BASE_URL } from "../../api";

export const useProductReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const url = `${API_BASE_URL}/api/productos/${productId}/reviews/`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setReviews(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId]);

  const createReview = async (rating, subject, review) => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      return { success: false, message: 'Debes iniciar sesión para agregar una reseña' };
    }
    
    try {
      const url = `${API_BASE_URL}/api/productos/${productId}/crear-review/`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, subject, review })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear la review');
      }

      const data = await response.json();
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return { reviews, loading, error, createReview };
};
