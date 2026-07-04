import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Lightbox({ images, currentIndex, isOpen, onClose, onPrev, onNext }) {
 const [zoom, setZoom] = useState(false);

 const handleKeyDown = useCallback((e) => {
 if (e.key === 'Escape') onClose();
 if (e.key === 'ArrowLeft') onPrev();
 if (e.key === 'ArrowRight') onNext();
 }, [onClose, onPrev, onNext]);

 useEffect(() => {
 if (isOpen) {
 document.addEventListener('keydown', handleKeyDown);
 document.body.style.overflow = 'hidden';
 }
 return () => {
 document.removeEventListener('keydown', handleKeyDown);
 document.body.style.overflow = '';
 };
 }, [isOpen, handleKeyDown]);

 if (!isOpen || !images || images.length === 0) return null;

 return (
 <AnimatePresence>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
 onClick={onClose}
 >
 <button
 onClick={onClose}
 className="absolute top-4 right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
 >
 <X className="w-6 h-6" />
 </button>

 {images.length > 1 && (
 <button
 onClick={(e) => { e.stopPropagation(); onPrev(); }}
 className="absolute left-4 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
 >
 <ChevronLeft className="w-6 h-6" />
 </button>
 )}

 <div
 className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
 onClick={(e) => e.stopPropagation()}
 >
 <img
 src={images[currentIndex]}
 loading="lazy"
 alt=""
 className={`transition-all duration-300 cursor-pointer ${
 zoom
 ? 'max-w-[95vw] max-h-[95vh] cursor-zoom-out object-contain'
 : 'max-w-[85vw] max-h-[85vh] cursor-zoom-in object-contain'
 }`}
 onClick={() => setZoom(!zoom)}
 />
 </div>

 {images.length > 1 && (
 <button
 onClick={(e) => { e.stopPropagation(); onNext(); }}
 className="absolute right-4 z-10 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
 >
 <ChevronRight className="w-6 h-6" />
 </button>
 )}

 <div className="absolute bottom-4 text-white text-sm">
 {currentIndex + 1} / {images.length}
 </div>
 </motion.div>
 </AnimatePresence>
 );
}

export default Lightbox;
