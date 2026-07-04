import { X, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCompare } from '../../contexts/CompareContext';
import { useState } from 'react';
import CompareModal from './CompareModal';

function CompareBar() {
 const { items, clearAll, max } = useCompare();
 const [modalOpen, setModalOpen] = useState(false);

 if (items.length === 0) return null;

 return (
 <>
 <AnimatePresence>
 <motion.div
 initial={{ y: 100 }}
 animate={{ y: 0 }}
 exit={{ y: 100 }}
 className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white shadow-2xl rounded-xl border px-4 py-3 flex items-center gap-4"
 >
 <div className="flex items-center gap-2">
 <span className="text-sm font-medium text-gray-600">Comparando ({items.length}/{max})</span>
 <div className="flex gap-1">
 {items.map(p => (
 <div key={p.id} className="relative group">
 <img src={p.images} alt="" className="w-10 h-10 rounded object-cover border" />
 </div>
 ))}
 </div>
 </div>
 <button
 onClick={() => setModalOpen(true)}
 className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
 >
 <ArrowUpDown className="w-4 h-4" />
 Comparar
 </button>
 <button
 onClick={clearAll}
 className="text-gray-400 hover:text-red-500 transition-colors"
 aria-label="Limpiar comparacion"
 >
 <X className="w-4 h-4" />
 </button>
 </motion.div>
 </AnimatePresence>
 <CompareModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
 </>
 );
}

export default CompareBar;
