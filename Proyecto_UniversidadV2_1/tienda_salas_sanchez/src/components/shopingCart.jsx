import { useState,useEffect } from "react";
import { FaShoppingCart } from 'react-icons/fa';


function ShopingCart() {
    const [itemCount, setItemCount] = useState(0);

  return (
    <a href="/#/cart" className="relative text-white hover:text-gray-300">
      <FaShoppingCart className="text-2xl" />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </a>
  );
};

export default ShopingCart