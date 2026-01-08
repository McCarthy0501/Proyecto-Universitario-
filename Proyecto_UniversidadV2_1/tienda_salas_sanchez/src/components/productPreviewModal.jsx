import { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProductPreviewModal({ product, isOpen, onClose }) {
  const { addToCart, isInCart, getProductQuantity, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && product) {
      fetchReviews();
      calculateAverageRating();
    }
  }, [isOpen, product]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/products/${product.id}/reviews/`);
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Error al obtener reseñas:', error);
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length > 0) {
      const avg = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
      setRating(avg);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    alert('Producto agregado al carrito');
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Debes iniciar sesión para dejar una reseña');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`http://localhost:8000/api/products/${product.id}/reviews/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rating: rating,
          comment: comment,
        }),
      });

      if (response.ok) {
        setComment('');
        setRating(0);
        fetchReviews();
        alert('✅ Reseña agregada exitosamente');
      } else {
        alert('❌ Error al agregar la reseña');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (ratingValue, interactive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={interactive ? () => setRating(star) : undefined}
            className={interactive ? 'cursor-pointer' : ''}
          >
            <Star
              className={`w-5 h-5 ${
                star <= ratingValue
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const isProductInCart = isInCart(product?.id);
  const cartQuantity = getProductQuantity(product?.id);
  const stockStatus = product?.stock > 0 ? 'Disponible' : 'No disponible';
  const stockClass = product?.stock > 0 ? 'text-green-600' : 'text-red-600';

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{product.product_name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Imagen del producto */}
            <div>
              <img
                src={product.images}
                alt={product.product_name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Información del producto */}
            <div>
              <div className="mb-4">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{product.product_name}</h3>
                <p className="text-2xl font-semibold text-blue-600 mb-4">${product.price}</p>
                
                {/* Valoración promedio */}
                <div className="flex items-center space-x-2 mb-4">
                  {renderStars(Math.round(rating))}
                  <span className="text-gray-600">({reviews.length} reseñas)</span>
                </div>

                {/* Stock */}
                <div className="mb-4">
                  <p className={`font-semibold ${stockClass}`}>
                    Stock: {stockStatus} {product.stock > 0 && `(${product.stock} unidades)`}
                  </p>
                </div>

                {/* Descripción */}
                <p className="text-gray-700 mb-6">{product.description}</p>

                {/* Controles de cantidad y carrito */}
                {product.stock > 0 ? (
                  <div className="space-y-4">
                    {!isProductInCart ? (
                      <>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{quantity}</span>
                          <button
                            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={handleAddToCart}
                          className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                          <ShoppingCart className="w-5 h-5" />
                          <span>Agregar al Carrito</span>
                        </button>
                      </>
                    ) : (
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 font-medium mb-2">
                          En el carrito: {cartQuantity} unidades
                        </p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{cartQuantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                            disabled={cartQuantity >= product.stock}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full disabled:opacity-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-red-800 font-medium">Producto no disponible</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Reseñas y comentarios */}
          <div className="border-t pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Reseñas y Comentarios</h3>

            {/* Formulario para agregar reseña */}
            <form onSubmit={handleSubmitReview} className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu Valoración
                </label>
                {renderStars(rating, true)}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu Comentario
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Escribe tu comentario aquí..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !rating}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar Reseña'}
              </button>
            </form>

            {/* Lista de reseñas */}
            <div className="space-y-4">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {review.user?.first_name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {review.user?.first_name} {review.user?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {renderStars(review.rating)}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay reseñas aún. ¡Sé el primero en opinar!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPreviewModal;
