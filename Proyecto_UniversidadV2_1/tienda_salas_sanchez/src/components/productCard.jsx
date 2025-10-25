
import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';

function ProductCard({product}) {
    const { addToCart, removeFromCart, updateQuantity, isInCart, getProductQuantity } = useCart();
    const [quantity, setQuantity] = useState(1);
    const isProductInCart = isInCart(product.id);
    const cartQuantity = getProductQuantity(product.id);

    const handleAddToCart = () => {
        addToCart(product, quantity);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(product.id);
    };

    const handleUpdateQuantity = (newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(product.id);
        } else {
            updateQuantity(product.id, newQuantity);
        }
    };

    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
        <img
          src={product.images}
          alt={product.product_name}
          className="w-full h-48 object-cover object-center"
        />
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
            {product.product_name}
          </h3>
          <p className="text-lg font-semibold text-indigo-600 mb-2">
            <span className="text-sm font-normal text-gray-500">Precio:</span> $
            {product.price}
          </p>
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {product.description}
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Stock disponible: {product.stock}
          </p>

          {/* Controles del carrito */}
          {!isProductInCart ? (
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
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
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
                  disabled={cartQuantity >= product.stock}
                  className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
}
export default ProductCard