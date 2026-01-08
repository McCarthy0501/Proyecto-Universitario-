
import { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, Eye } from 'lucide-react';
import ProductPreviewModal from '../productPreviewModal';

function ProductCard({product}) {
    const { addToCart, removeFromCart, updateQuantity, isInCart, getProductQuantity } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [showPreview, setShowPreview] = useState(false);
    const isProductInCart = isInCart(product.id);
    const cartQuantity = getProductQuantity(product.id);
    
    // Coordinación de stocks con backend
    const stock = product.stock || 0;
    const isAvailable = stock > 0;
    const stockText = isAvailable ? `Disponible (${stock})` : 'No disponible';
    const stockClass = isAvailable ? 'text-green-600' : 'text-red-600';

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para agregar productos al carrito');
            navigate('/login');
            return;
        }
        addToCart(product, quantity);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(product.id);
    };

    const handleUpdateQuantity = (newQuantity) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para modificar el carrito');
            navigate('/login');
            return;
        }
        if (newQuantity <= 0) {
            removeFromCart(product.id);
        } else {
            updateQuantity(product.id, newQuantity);
        }
    };

    return (
      <>
        <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
          {/* Imagen clickeable para vista previa */}
          <div className="relative cursor-pointer" onClick={() => setShowPreview(true)}>
            <img
              src={product.images}
              alt={product.product_name}
              className="w-full h-48 object-cover object-center"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-opacity">
              <Eye className="w-5 h-5" />
            </div>
          </div>
          <div className="p-6">
            <h3 
              className="text-2xl font-bold text-gray-900 mb-2 truncate cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => setShowPreview(true)}
            >
              {product.product_name}
            </h3>
            <p className="text-lg font-semibold text-indigo-600 mb-2">
              <span className="text-sm font-normal text-gray-500">Precio:</span> $
              {product.price}
            </p>
            <p className="text-gray-700 text-sm mb-4 line-clamp-3">
              {product.description}
            </p>
            <p className={`text-sm font-semibold mb-4 ${stockClass}`}>
              {stockText}
            </p>

            {/* Controles del carrito */}
            {isAvailable ? (
              !isProductInCart ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
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
                  <button
                    onClick={() => setShowPreview(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Ver Detalles</span>
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
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(cartQuantity - 1)}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{cartQuantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(cartQuantity + 1)}
                      disabled={cartQuantity >= stock}
                      className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => setShowPreview(true)}
                    className="w-full flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                    <span>Ver Detalles</span>
                  </button>
                </div>
              )
            ) : (
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <p className="text-red-800 font-medium mb-2">Producto no disponible</p>
                </div>
                <button
                  onClick={() => setShowPreview(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg transition-colors"
                >
                  <Eye className="w-5 h-5" />
                  <span>Ver Detalles</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Modal de vista previa */}
        <ProductPreviewModal
          product={product}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      </>
    );
}
export default ProductCard