import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

function ConfirmDialog({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'danger' }) {
 if (!isOpen) return null;

 const variantStyles = {
 danger: 'bg-red-600 hover:bg-red-700',
 warning: 'bg-yellow-600 hover:bg-yellow-700',
 info: 'bg-blue-600 hover:bg-blue-700',
 };

 return (
 <AnimatePresence>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
 onClick={onClose}
 >
 <motion.div
 initial={{ opacity: 0, scale: 0.9 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.9 }}
 className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4"
 onClick={(e) => e.stopPropagation()}
 >
 <div className="flex items-center gap-3 mb-4">
 <div className="p-2 bg-red-100 rounded-full">
 <AlertTriangle className="w-6 h-6 text-red-600" />
 </div>
 <h3 className="text-lg font-bold text-gray-900">{title}</h3>
 </div>
 <p className="text-gray-600 mb-6">{message}</p>
 <div className="flex justify-end gap-3">
 <button
 onClick={onClose}
 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
 >
 {cancelText}
 </button>
 <button
 onClick={() => { onConfirm(); onClose(); }}
 className={`px-4 py-2 text-white rounded-lg transition-colors ${variantStyles[variant]}`}
 >
 {confirmText}
 </button>
 </div>
 </motion.div>
 </motion.div>
 </AnimatePresence>
 );
}

export default ConfirmDialog;
