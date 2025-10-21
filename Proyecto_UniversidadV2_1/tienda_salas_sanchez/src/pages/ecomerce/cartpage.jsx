import ShopingCart from "../../components/shopingCart";
import { motion } from "framer-motion";
function CartPage() {
  const animacion={
      primera:{opacity:0,y:-50},
      segunda:{opacity:1,y:0}
      
    }
    return (
  <>
  <motion.div
  variants={animacion}
  initial="primera"
  whileInView="segunda"
    transition={{ duration: 0.9, ease: "easeInOut" }}
  >
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">Página del Carrito de Compras</h1>
      <p className="mt-4 text-gray-600">Aquí se mostrarán los productos que has agregado.</p>
    </div>
  </motion.div>
  </>
  );
    
}

export default CartPage