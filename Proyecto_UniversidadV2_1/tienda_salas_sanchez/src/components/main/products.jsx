import { useProducts } from "../../Hooks/main/useProducts";
import ProductCard from "../complementos/productCard";
import { motion } from "framer-motion";
import { fadeRight } from "../../animaciones/animaciones";

{/*creamos la funcion */}
function Productos() {
   const {productosOrdenados}=useProducts(); // uso del hook personalizado
   
    return (
      <>
        <motion.div
          variants={fadeRight}
          initial="desaparece"
          whileInView="aparece"
          transition={{ duration: 0.9, ease: "easeInOut" }}

        >
           {productosOrdenados.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 cursor-pointer md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Recorre el arreglo 'product' y muestra cada producto.
            Usa paréntesis '()' en lugar de llaves '{}' para que el return sea implícito.
            mi error era {product.map(producto=>{fue colcoar llaves en ves de ()})}
          */}
            {productosOrdenados.map((producto) => (
              // IMPORTANTE: Cada elemento debe tener una 'key' única.
              // Asumo que tu objeto 'producto' tiene una propiedad 'id'.
              //traemos el componente y colcamos la key y colocamos la variable iterada.id y colocamos el pront product del componente y {la variable iterada en map}
              <ProductCard key={producto.id} product={producto} />
            ))}
          </div>
        ) : (
          // Si el arreglo está vacío, muestra este mensaje mientras se cargan los datos.
          <p className="text-gray-700 text-lg font-semibold animate-pulse" >Cargando Productos...</p>
        )}
        </motion.div>

       
      </>
    );
    
}

export default Productos