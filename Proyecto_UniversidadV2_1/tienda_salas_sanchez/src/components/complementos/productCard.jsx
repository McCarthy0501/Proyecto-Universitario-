
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Eye, Star } from 'lucide-react';
import toast from 'react-hot-toast';
<<<<<<< HEAD
import PriceDisplay from './PriceDisplay';
=======
import Badge from './Badge';
import WishlistButton from './WishlistButton';
import ProductPreviewModal from '../productPreviewModal';
>>>>>>> desarrollo

function ProductCard({product}) {
    const { addToCart, removeFromCart, updateQuantity, isInCart, getProductQuantity } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [modalOpen, setModalOpen] = useState(false);
    const isProductInCart = isInCart(product.id);
    const cartQuantity = getProductQuantity(product.id);
    
    const stock = product.stock || 0;
    const isAvailable = stock > 0;
    const stockText = isAvailable ? `Disponible (${stock})` : 'No disponible';
    const stockClass = isAvailable ? 'text-green-600' : 'text-red-600';
    const averageRating = product.average_rating || 0;
    const reviewCount = product.review_count || 0;

    const discountPercent = product.original_price && product.original_price > product.price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : null;
    const isSoldOut = !product.is_available || stock === 0;

    const handleAddToCart = (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para agregar productos al carrito');
            navigate('/login');
            return;
        }
        addToCart(product, quantity);
        toast.success(`${product.product_name} agregado al carrito`);
    };

    const handleRemoveFromCart = (e) => {
        e.stopPropagation();
        removeFromCart(product.id);
        toast.success('Producto eliminado del carrito');
    };

    const handleUpdateQuantity = (newQuantity, e) => {
        if (e) e.stopPropagation();
        if (!isAuthenticated) {
            toast.error('Debes iniciar sesión para modificar el carrito');
            navigate('/login');
            return;
        }
        if (newQuantity <= 0) {
            removeFromCart(product.id);
            toast.success('Producto eliminado del carrito');
        } else {
            updateQuantity(product.id, newQuantity);
        }
    };

    const handleCardClick = () => {
        navigate(`/producto/${product.id}`);
    };

    const renderStars = (rating) => (
        <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={12}
                    fill={star <= Math.round(rating) ? "#fbbf24" : "transparent"}
                    stroke={star <= Math.round(rating) ? "#fbbf24" : "#d1d5db"}
                />
            ))}
        </div>
    );

    return (
      <>
        <div 
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
            onClick={handleCardClick}
        >
          <div className="relative">
            <img
              src={product.images}
              alt={product.product_name}
              className="w-full h-48 object-cover object-center"
            />
            {isSoldOut && <Badge variant="sold-out" text="Agotado" />}
            {!isSoldOut && discountPercent && (
              <Badge variant="discount" text={`-${discountPercent}%`} />
            )}
            {!isSoldOut && !discountPercent && product.is_new && (
              <Badge variant="new" text="Nuevo" />
            )}
            <WishlistButton productId={product.id} />
            <button
              onClick={(e) => { e.stopPropagation(); setModalOpen(true); }}
              className="absolute top-2 right-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity"
            >
              <Eye className="w-5 h-5" />
            </button>
          </div>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2 truncate hover:text-blue-600 transition-colors">
              {product.product_name}
            </h3>
            
            <div className="flex items-center justify-between mb-2">
<<<<<<< HEAD
                <PriceDisplay priceUsd={product.price} />
=======
                {discountPercent ? (
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-semibold text-indigo-600">
                      ${product.price}
                    </p>
                    <p className="text-sm text-gray-400 line-through">
                      ${product.original_price}
                    </p>
                  </div>
                ) : (
                  <p className="text-xl font-semibold text-indigo-600">
                    ${product.price}
                  </p>
                )}
>>>>>>> desarrollo
                {reviewCount > 0 && (
                    <div className="flex items-center gap-1">
                        {renderStars(averageRating)}
                        <span className="text-xs text-gray-500">({reviewCount})</span>
                    </div>
                )}
            </div>
            
            <p className="text-gray-700 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            <p className={`text-sm font-semibold mb-4 ${stockClass}`}>
              {stockText}
            </p>

            {isAvailable ? (
              !isProductInCart ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
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
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <span className="text-green-800 font-medium">
                      En el carrito: {cartQuantity}
                    </span>
                    <button
                      onClick={handleRemoveFromCart}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={(e) => handleUpdateQuantity(cartQuantity - 1, e)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{cartQuantity}</span>
                    <button
                      onClick={(e) => handleUpdateQuantity(cartQuantity + 1, e)}
                      disabled={cartQuantity >= stock}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-red-50 p-4 rounded-lg text-center">
                <p className="text-red-800 font-medium">Producto no disponible</p>
              </div>
            )}
          </div>
        </div>

        <ProductPreviewModal
          product={product}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </>
    );
}
export default ProductCard
