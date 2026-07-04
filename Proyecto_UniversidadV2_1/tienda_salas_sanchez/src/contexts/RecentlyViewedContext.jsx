import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RecentlyViewedContext = createContext();

export const useRecentlyViewed = () => {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed debe ser usado dentro de RecentlyViewedProvider');
  }
  return context;
};

const STORAGE_KEY = 'recently_viewed';
const MAX_ITEMS = 8;

const RecentlyViewedProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addProduct = useCallback((product) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.id !== product.id);
      return [{ id: product.id, product_name: product.product_name, images: product.images, price: product.price }, ...filtered].slice(0, MAX_ITEMS);
    });
  }, []);

  return (
    <RecentlyViewedContext.Provider value={{ items, addProduct }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};

export { RecentlyViewedProvider };
