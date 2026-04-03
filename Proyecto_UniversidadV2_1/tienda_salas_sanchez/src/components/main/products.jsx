import { useProducts } from "../../Hooks/main/useProducts";
import ProductCard from "../complementos/productCard";
import { motion } from "framer-motion";
import { fadeRight } from "../../animaciones/animaciones";

function Productos() {
   const {productosOrdenados}=useProducts();
   
   const containerVariants = {
     hidden: { opacity: 0 },
     visible: {
       opacity: 1,
       transition: {
         staggerChildren: 0.1
       }
     }
   };

   const itemVariants = {
     hidden: { opacity: 0, y: 20 },
     visible: { opacity: 1, y: 0 }
   };

   return (
     <>
       <motion.div
         variants={fadeRight}
         initial="desaparece"
         whileInView="aparece"
         transition={{ duration: 0.9, ease: "easeInOut" }}
       >
          {productosOrdenados.length > 0 ? (
           <motion.div 
             className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
             variants={containerVariants}
             initial="hidden"
             whileInView="visible"
             viewport={{ once: true, amount: 0.2 }}
           >
             {productosOrdenados.map((producto) => (
               <motion.div key={producto.id} variants={itemVariants}>
                 <ProductCard product={producto} />
               </motion.div>
             ))}
           </motion.div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
               <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                 <div className="h-48 bg-gray-200"></div>
                 <div className="p-6 space-y-3">
                   <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                   <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                   <div className="h-4 bg-gray-200 rounded w-full"></div>
                   <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                 </div>
               </div>
             ))}
           </div>
         )}
       </motion.div>

      
     </>
   );
   
}

export default Productos
