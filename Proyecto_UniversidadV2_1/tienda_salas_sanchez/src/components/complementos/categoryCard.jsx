
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

function CategoryCard({category,onCategoryClick}) {
  const buscarElProducto=()=>{
    onCategoryClick()
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.03, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer group"
      onClick={buscarElProducto}
    >
      <div className="relative overflow-hidden">
        <img
          src={category.cat_image} 
          alt={category.category_name}
          className="w-full h-40 object-cover object-center group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
          <ChevronRight className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {category.category_name}
        </h3>
        {category.description && (
          <p className="text-gray-500 text-sm line-clamp-2">
            {category.description}
          </p>
        )}
        <div className="mt-3 flex items-center text-blue-600 text-sm font-medium">
          <span>Ver productos</span>
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </motion.div>
  );
    
}
export default CategoryCard
