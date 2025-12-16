import { motion } from "framer-motion";
import { Tag, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom"; //hook que te da una función para cambiar de ruta programáticamente dentro de tu aplicación React.

const OfferBanner = () => {
   const navegacion=useNavigate(); // llamamos la funcion
  const hacerClick=()=>(
    navegacion('/productos')
  );// creamos una varianle  que contenga una funcion flecha que contendra la ruta a redirigir
  return (
    <motion.div
      
      className="w-11/12 mx-auto mt-10 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-2xl shadow-2xl overflow-hidden hover:scale-[1.02] transition-transform duration-300"
    >
      <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-10 text-center md:text-left">
        {/* Icono + texto */}
        <div className="flex items-center gap-4 mb-6 md:mb-0">
          <Tag className="w-14 h-14 text-white animate-bounce" />
          <div>
            <h2 className="text-4xl font-extrabold drop-shadow-lg">
              ¡Super Ofertas Limitadas!
            </h2>
            <p className="text-white/90 text-lg">
              Ahorra hasta <span className="font-bold">60%</span> en productos seleccionados 🎉
            </p>
          </div>
        </div>

        {/* Botón */}
        <button className="bg-white text-orange-600 font-semibold px-8 py-3 rounded-full flex items-center gap-2 hover:bg-orange-100 transition-colors duration-200"
          onClick={hacerClick}
        >
          <ShoppingBag size={20} />
          
          Ver Productos Disponibles 
        </button>
      </div>
    </motion.div>
  );
};

export default OfferBanner;
