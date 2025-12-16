import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

function ShopingCart() {
    const { getTotalItems } = useCart();
    const itemCount = getTotalItems();

  return (
    <a href="/#/cart" className="relative text-white hover:text-gray-300">
      <ShoppingCart size={24} 
    className="text-white hover:text-gray-200 transition-colors duration-200" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </a>
  );
};

export default ShopingCart