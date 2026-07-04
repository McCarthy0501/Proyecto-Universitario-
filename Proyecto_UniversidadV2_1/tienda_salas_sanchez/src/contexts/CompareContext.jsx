import { createContext, useContext, useState } from 'react';

const CompareContext = createContext();

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) throw new Error('useCompare debe ser usado dentro de CompareProvider');
  return context;
};

const MAX_COMPARE = 3;

const CompareProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const toggleItem = (product) => {
    setItems(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= MAX_COMPARE) {
        return prev;
      }
      return [...prev, {
        id: product.id,
        product_name: product.product_name,
        images: product.images,
        price: product.price,
        original_price: product.original_price,
        description: product.description,
        stock: product.stock,
        is_available: product.is_available,
        average_rating: product.average_rating,
        review_count: product.review_count,
        is_new: product.is_new,
      }];
    });
  };

  const isComparing = (productId) => items.some(p => p.id === productId);

  const clearAll = () => setItems([]);

  return (
    <CompareContext.Provider value={{ items, toggleItem, isComparing, clearAll, max: MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  );
};

export { CompareProvider };
