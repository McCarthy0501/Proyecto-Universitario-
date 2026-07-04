import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function WhatsAppButton() {
 const phoneNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '580000000000';
 const message = encodeURIComponent('Hola! Me gustaria obtener informacion sobre sus productos.');

 return (
 <motion.a
 href={`https://wa.me/${phoneNumber}?text=${message}`}
 target="_blank"
 rel="noopener noreferrer"
 initial={{ opacity: 0, scale: 0.5 }}
 animate={{ opacity: 1, scale: 1 }}
 whileHover={{ scale: 1.1 }}
 className="fixed bottom-6 left-6 z-40 p-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors"
 aria-label="Contactar por WhatsApp"
 >
 <MessageCircle className="w-6 h-6" />
 </motion.a>
 );
}

export default WhatsAppButton;
