
{/* podemos crear un compoente aparte, y para psarle los datos usamos un pront */}
function CategoryCard({category}) {
    return (
      <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
        <img
          src={category.cat_image} alt={category.category_name}
          className="w-full h-48 object-cover object-center"
        />
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2 truncate">
            {category.category_name}
          </h3>
          <p className="text-lg font-semibold text-indigo-600 mb-2">
            <span className="text-sm font-normal text-gray-500"></span> 
            {category.slug}
          </p>
          <p className="text-gray-700 text-sm mb-4 line-clamp-3">
            {category.description}
          </p>
        
        </div>
      </div>
    );
    
}
export default CategoryCard