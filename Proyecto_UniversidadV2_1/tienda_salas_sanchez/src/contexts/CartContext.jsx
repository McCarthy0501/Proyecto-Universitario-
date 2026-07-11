import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { API_BASE_URL } from '../api';
import { useAuth } from '../contexts/AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const initialLoadDone = useRef(false);
  const { isAuthenticated } = useAuth();
  const prevAuthRef = useRef(isAuthenticated);
  const authInitialized = useRef(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    initialLoadDone.current = true;
  }, []);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const syncWithBackend = useCallback(async (items) => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/api/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ items }),
      });
    } catch (e) {
      console.error('Error al sincronizar carrito con backend:', e);
    }
  }, []);

  const loadCartFromBackend = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data.cart_items || [];
      }
    } catch (e) {
      console.error('Error al cargar carrito del backend:', e);
    }
    return null;
  }, []);

  useEffect(() => {
    if (!authInitialized.current) {
      authInitialized.current = true;
      prevAuthRef.current = isAuthenticated;
      return;
    }

    if (prevAuthRef.current && !isAuthenticated) {
      setCartItems([]);
      localStorage.removeItem('cartItems');
    }

    if (!prevAuthRef.current && isAuthenticated) {
      loadCartFromBackend().then((backendCart) => {
        if (backendCart && backendCart.length > 0) {
          setCartItems(backendCart);
        }
      });
    }

    prevAuthRef.current = isAuthenticated;
  }, [isAuthenticated, loadCartFromBackend]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && initialLoadDone.current) {
      loadCartFromBackend().then((backendCart) => {
        if (backendCart && backendCart.length > 0) {
          const savedCart = localStorage.getItem('cartItems');
          const localItems = savedCart ? JSON.parse(savedCart) : [];

          if (localItems.length > 0) {
            const mergedMap = {};
            backendCart.forEach((item) => {
              mergedMap[item.id] = { ...item };
            });
            localItems.forEach((item) => {
              if (mergedMap[item.id]) {
                mergedMap[item.id].quantity += item.quantity;
              } else {
                mergedMap[item.id] = { ...item };
              }
            });
            const merged = Object.values(mergedMap);
            setCartItems(merged);
            syncWithBackend(merged);
          } else {
            setCartItems(backendCart);
          }
        }
      });
    }
  }, [loadCartFromBackend, syncWithBackend]);

  useEffect(() => {
    if (!initialLoadDone.current) return;
    const token = localStorage.getItem('accessToken');
    if (token && cartItems.length > 0) {
      const debounce = setTimeout(() => {
        syncWithBackend(cartItems);
      }, 500);
      return () => clearTimeout(debounce);
    }
  }, [cartItems, syncWithBackend]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTax = () => {
    return getSubtotal() * 0.16;
  };

  const getTotal = () => {
    return getSubtotal() + getTax();
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const getProductQuantity = (productId) => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    cartItems,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getSubtotal,
    getTax,
    getTotal,
    isInCart,
    getProductQuantity
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider };
