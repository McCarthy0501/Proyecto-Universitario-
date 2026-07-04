import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductDetail } from '../../Hooks/main/useProductDetail';
import { useProductReviews } from '../../Hooks/main/useProductReviews';
import { useRelatedProducts } from '../../Hooks/main/useProductSearch';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Plus, Minus, Heart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ProductCard from '../../components/complementos/productCard';
<<<<<<< HEAD
import PriceDisplay from '../../components/complementos/PriceDisplay';
=======
import Breadcrumb from '../../components/complementos/Breadcrumb';
>>>>>>> desarrollo

function ProductDetailPage() {
  const { id } = useParams();
  const { product, loading, error } = useProductDetail(id);
  const { reviews, loading: reviewsLoading, createReview } = useProductReviews(id);
  const { relatedProducts } = useRelatedProducts(id);
  
  const { addToCart, isInCart, getProductQuantity, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [subject, setSubject] = useState('');
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedTalla, setSelectedTalla] = useState(null);

  const isProductInCart = isInCart(product?.id);
  const cartQuantity = getProductQuantity(product?.id);

  const images = product?.gallery?.length > 0 
    ? [product.images, ...product.gallery.map(g => g.image)]
    : [product?.images];

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    toast.success(`${product.product_name} agregado al carrito`);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para agregar una reseña');
      navigate('/login');
      return;
    }
    if (!rating) {
      toast.error('Por favor selecciona una calificación');
      return;
    }

    setSubmitting(true);
    const result = await createReview(rating, subject, review);
    
    if (result.success) {
      toast.success(result.message);
      setRating(0);
      setSubject('');
      setReview('');
    } else {
      toast.error(result.message);
    }
    setSubmitting(false);
  };

  const renderStars = (ratingValue, interactive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={interactive ? () => setRating(star) : undefined}
            className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
            disabled={!interactive}
          >
            <Star
              size={20}
              fill={star <= ratingValue ? "#fbbf24" : "transparent"}
              stroke={star <= ratingValue ? "#fbbf24" : "#d1d5db"}
            />
          </button>
        ))}
      </div>
    );
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-red-600 text-xl">Error al cargar el producto</p>
        <button 
          onClick={() => navigate('/productos')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Volver a productos
        </button>
      </div>
    );
  }

  const variations = product.variations || [];
  const colors = variations.filter(v => v.variation_category === 'color');
  const tallas = variations.filter(v => v.variation_category === 'talla');

  return (
    <>
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 pt-4 pb-20 md:pb-8"
    >
      <Breadcrumb
        items={[
          { label: 'Inicio', to: '/' },
          { label: 'Productos', to: '/productos' },
        ]}
        currentLabel={product?.product_name}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg bg-gray-100">
            <img
              src={images[selectedImage]}
              alt={product.product_name}
              className="w-full h-[500px] object-cover"
            />
            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    idx === selectedImage ? 'border-blue-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.product_name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center">
              {renderStars(Math.round(product.average_rating || 0))}
            </div>
            <span className="text-gray-500">
              ({product.review_count || 0} reseñas)
            </span>
          </div>

          <PriceDisplay priceUsd={product.price} className="text-2xl font-bold text-blue-600 mb-4" />

          <div className="flex items-center gap-2 mb-4">
            {product.is_available ? (
              product.stock > 0 && product.stock <= 5 ? (
                <span className="text-orange-600 flex items-center gap-1 font-medium">
                  <AlertTriangle size={16} />
                  ¡Solo quedan {product.stock}!
                </span>
              ) : (
                <span className="text-green-600 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                  Disponible
                </span>
              )
            ) : (
              <span className="text-red-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                No disponible
              </span>
            )}
            {product.stock > 5 && (
              <span className="text-gray-500">({product.stock} unidades en stock)</span>
            )}
          </div>

          {colors.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedColor?.id === color.id 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {color.variation_value}
                  </button>
                ))}
              </div>
            </div>
          )}

          {tallas.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
              <div className="flex gap-2 flex-wrap">
                {tallas.map((talla) => (
                  <button
                    key={talla.id}
                    onClick={() => setSelectedTalla(talla)}
                    className={`px-4 py-2 border rounded-lg transition-colors ${
                      selectedTalla?.id === talla.id 
                        ? 'border-blue-600 bg-blue-50 text-blue-600' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {talla.variation_value}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="text-gray-700 mb-6">{product.description}</p>

          {product.is_available && (
            <div className="space-y-4">
              {!isProductInCart ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Cantidad:</span>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Agregar al Carrito
                  </button>
                </>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg space-y-3">
                  <p className="text-green-800 font-medium">
                    En el carrito: {cartQuantity} unidades
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{cartQuantity}</span>
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
          )}

          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Truck className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-xs text-gray-600">Envío gratis</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-xs text-gray-600">Compra segura</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
              <RotateCcw className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-xs text-gray-600">Devolución</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Reseñas ({product.review_count || 0})</h2>
        
        {isAuthenticated ? (
          <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Escribe tu reseña</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Calificación</label>
              {renderStars(rating, true)}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Título de tu reseña"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tu opinión</label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Escribe tu experiencia con el producto..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !rating}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Enviar Reseña'}
            </button>
          </form>
        ) : (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg text-center">
            <p className="text-gray-600 mb-3">Inicia sesión para agregar tu reseña</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Iniciar Sesión
            </button>
          </div>
        )}

        <div className="space-y-4">
          {reviewsLoading ? (
            <p className="text-gray-500">Cargando reseñas...</p>
          ) : reviews.length > 0 ? (
            reviews.map((r) => (
              <div key={r.id} className="border-b pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {r.user_username?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">{r.user_username}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {renderStars(r.rating)}
                </div>
                {r.subject && <p className="font-medium mb-1">{r.subject}</p>}
                <p className="text-gray-700">{r.review}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">
              No hay reseñas aún. ¡Sé el primero en opinar!
            </p>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}
    </motion.div>

    {product.is_available && (
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div>
            <span className="text-2xl font-bold text-gray-900">${product.price}</span>
            {product.original_price && product.original_price > product.price && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ${product.original_price}
              </span>
            )}
          </div>
          {!isProductInCart ? (
            <button
              onClick={handleAddToCart}
              disabled={!product.is_available || product.stock === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:bg-gray-400"
            >
              Agregar al carrito
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 text-center font-medium">{cartQuantity}</span>
              <button
                onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                disabled={cartQuantity >= product.stock}
                className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  );
}

export default ProductDetailPage;
