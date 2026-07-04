import { X, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCompare } from '../../contexts/CompareContext';

function CompareModal({ isOpen, onClose }) {
 const { items, clearAll } = useCompare();

 if (!isOpen || items.length === 0) return null;

 return (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
 onClick={onClose}
 >
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between z-10">
 <h2 className="text-xl font-bold text-gray-900">Comparar Productos</h2>
 <div className="flex items-center gap-3">
 <button onClick={clearAll} className="text-sm text-red-600 hover:underline">Limpiar todo</button>
 <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5" /></button>
 </div>
 </div>

 <div className="p-6">
 <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
 {items.map((p) => (
 <div key={p.id} className="text-center">
 <img src={p.images} alt={p.product_name} loading="lazy" className="w-full h-48 object-cover rounded-lg mb-3" />
 <h3 className="font-bold text-gray-900 text-sm mb-1">{p.product_name}</h3>
 <div className="flex items-center justify-center gap-1 mb-2">
 {[1, 2, 3, 4, 5].map(s => (
 <Star key={s} size={12} fill={s <= Math.round(p.average_rating || 0) ? '#fbbf24' : 'transparent'} stroke={s <= Math.round(p.average_rating || 0) ? '#fbbf24' : '#d1d5db'} />
 ))}
 </div>
 <div className="flex items-center justify-center gap-2 mb-2">
 <span className="text-lg font-bold text-indigo-600">${p.price}</span>
 {p.original_price && p.original_price > p.price && (
 <span className="text-xs text-gray-400 line-through">${p.original_price}</span>
 )}
 </div>
 <div className="text-xs text-left space-y-2 mt-4">
 <div className="flex justify-between py-1 border-t">
 <span className="text-gray-500">Stock</span>
 <span className={p.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
 {p.stock > 0 ? `${p.stock} unid.` : 'Agotado'}
 </span>
 </div>
 <div className="flex justify-between py-1 border-t">
 <span className="text-gray-500">Nuevo</span>
 <span>{p.is_new ? 'Si' : 'No'}</span>
 </div>
 <div className="flex justify-between py-1 border-t">
 <span className="text-gray-500">Rating</span>
 <span>{p.average_rating || 0}/5 ({p.review_count || 0})</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>
 </motion.div>
 </motion.div>
 );
}

export default CompareModal;
