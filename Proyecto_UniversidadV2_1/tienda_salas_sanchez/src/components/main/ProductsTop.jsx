import { useNavigate } from 'react-router-dom';
import { ShoppingCart, TrendingUp, Star } from 'lucide-react'; 



// --- Datos de Ejemplo (Hardcodeados para la vista) ---
const topProductsData = [
  { id: 101, name: 'Zapatillas Urbanas "Vapor"', price: '79.99', rating: 4.8, imgUrl: '/path/to/img1.jpg' },
  { id: 102, name: 'Bolso de Cuero Minimalista', price: '120.00', rating: 4.5, imgUrl: '/path/to/img2.jpg' },
  { id: 103, name: 'Sudadera Oversize Gris', price: '45.50', rating: 4.9, imgUrl: '/path/to/img3.jpg' },
  { id: 104, name: 'Reloj Cronógrafo Acero', price: '189.00', rating: 4.7, imgUrl: '/path/to/img4.jpg' },
];

// El componente es ahora una función simple de presentación
const TopSellingProducts = () => {
    const navegar=useNavigate();
    const ir =()=>{
        navegar('/productos')
    }
  return (
    <div className="w-full text-center py-10">
      
      {/* Título de la Sección */}
      <div className="flex items-center justify-center mb-10">
        <TrendingUp className="w-8 h-8 text-indigo-600 mr-3"/>
        <h2 className="text-4xl font-extrabold text-gray-900">
          Nuestros Productos Más Vendidos
        </h2>
      </div>

      {/* Grid Responsivo para las Tarjetas de Producto */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        
        {topProductsData.map((product) => (
          
          /* INICIO DE LA TARJETA DEL PRODUCTO CON ESTILOS DE CATEGORYCARD */
          <div 
            key={product.id}
            // ESTILOS: Sombra, Hover Scale, Transición, Bordes Redondeados (Tu estilo)
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
            // Se quita el onClick={}
          >
            
            {/* Contenedor de Imagen */}
            <div className="relative w-full h-48 md:h-64 overflow-hidden"> 
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                    ¡Lo Más Vendido!
                </span>
                <img
                    // Usar un placeholder visual
                    src={product.imgUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover object-center"
                />
            </div>
            
            {/* Contenido y Datos de Venta */}
            <div className="p-4 md:p-6 text-left">
                
                {/* Nombre del Producto */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                    {product.name}
                </h3>
                
                {/* Rating (Prueba Social) */}
                <div className="flex items-center justify-start mb-3">
                    {/* Renderizado simple de estrellas basado en el rating */}
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-500">({product.rating})</span>
                </div>

                {/* Precio y CTA (El foco de la venta) */}
                <div className="flex justify-between items-center mt-4">
                    
                    {/* Precio */}
                    <p className="text-2xl font-extrabold text-indigo-600">
                        ${product.price}
                    </p>
                    
                    {/* Botón CTA (Solo visual, sin onClick) */}
                    <button
                        className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors duration-200 shadow-lg flex items-center gap-1"
                        aria-label={`Añadir ${product.name} al carrito`}
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>
            </div>
          </div>
          /* FIN DE LA TARJETA DEL PRODUCTO */
        ))}
        
      </div>
      
      {/* CTA final */}
      <button 
        className="mt-12 px-10 py-3 bg-gray-200 text-gray-800 font-bold text-lg rounded-lg hover:bg-gray-300 transition-colors shadow-md"
        // Se quita el onClick
        onClick={ir}
      >
        Ver Todos los Productos
      </button>

    </div>
  );
};

export default TopSellingProducts;