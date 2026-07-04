import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const WishlistContext = createContext();

const STORAGE_KEY = 'wishlist_ids';

function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
  }, [wishlistIds]);

  const addToWishlist = useCallback((id) => {
    setWishlistIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlistIds((prev) => prev.filter((itemId) => itemId !== id));
  }, []);

  const toggleWishlist = useCallback((id) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  }, []);

  const isInWishlist = useCallback(
    (id) => wishlistIds.includes(id),
    [wishlistIds]
  );

  const wishlistCount = wishlistIds.length;

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, wishlistCount, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist debe ser usado dentro de un WishlistProvider');
  return context;
}

export { WishlistProvider, useWishlist };
