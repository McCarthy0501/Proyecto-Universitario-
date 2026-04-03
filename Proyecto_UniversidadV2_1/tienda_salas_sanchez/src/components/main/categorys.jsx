import CategoryCard from "../complementos/categoryCard";
import { useCategorys } from "../../Hooks/main/useCategorys";
import { motion } from "framer-motion";

function Categorys() {
    const {productosPorCategoria,categoriasOrdenadas}=useCategorys();

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

    return(
        <>
            {categoriasOrdenadas.length > 0 ? (
                 <motion.div 
                 className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                 variants={containerVariants}
                 initial="hidden"
                 whileInView="visible"
                 viewport={{ once: true, amount: 0.2 }}
               >
                    {categoriasOrdenadas.map((category)=>(
                        <motion.div key={category.id} variants={itemVariants}>
                            <CategoryCard 
                              category={category} 
                              onCategoryClick={()=>productosPorCategoria(category.id)}
                            />
                        </motion.div>
                    ))}
                 </motion.div>
            ):(
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        
        </>
    )
    
}

export default Categorys
