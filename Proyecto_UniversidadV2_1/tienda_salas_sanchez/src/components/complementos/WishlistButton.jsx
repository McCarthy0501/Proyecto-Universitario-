import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWishlist } from '../../contexts/WishlistContext';

function WishlistButton({ productId, className = '' }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const active = isInWishlist(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(productId);
      }}
      className={`absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white transition-colors ${className}`}
      aria-label={active ? 'Quitar de favoritos' : 'Agregar a favoritos'}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={active ? 'filled' : 'outline'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            size={18}
            className={active ? 'fill-red-500 text-red-500' : 'text-gray-600'}
          />
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

export default WishlistButton;
