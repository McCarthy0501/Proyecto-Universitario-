import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ScrollToTop() {
 const [visible, setVisible] = useState(false);

 useEffect(() => {
 const handleScroll = () => {
 setVisible(window.scrollY > 300);
 };
 window.addEventListener('scroll', handleScroll);
 return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 const scrollToTop = () => {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 return (
 <AnimatePresence>
 {visible && (
 <motion.button
 initial={{ opacity: 0, scale: 0.5 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.5 }}
 onClick={scrollToTop}
 className="fixed bottom-6 right-6 z-40 p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
 aria-label="Volver arriba"
 >
 <ChevronUp className="w-6 h-6" />
 </motion.button>
 )}
 </AnimatePresence>
 );
}

export default ScrollToTop;
