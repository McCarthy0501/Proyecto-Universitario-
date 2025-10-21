
import ProductCard from "../../components/productCard";
import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import { motion } from "framer-motion";


export default function MostrarProductosPorCategorias() {
    const {id}=useParams();
    console.log(id);
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        setCargando(true);
        setError(null);
        setProductos([]);
        const peticionApiProductosPorCategorias=  async ()=>{
            try {
                const url =`http://localhost:8000/api/productosPorCategorias/${id}/`;
                const peticion = await fetch(url);
                
                if(!peticion.ok){
                    throw new Error(`Error HTTP: ${peticion.status}`);
                }
                const data = await peticion.json();
                
                setProductos(data)
                console.log(data)
            } catch (error) {
                console.error(error)
                
            }finally {
                // Se ejecuta siempre al final
                setCargando(false);
            };
        };
        if (id) {
            peticionApiProductosPorCategorias();
        } else {
            setCargando(false);
        }
    },[id]);
    if (cargando) {
        return <p className="text-gray-700 text-lg font-semibold animate-pulse">Cargando Productos...</p>;
    }
    
    if (error) {
        return <p className="text-red-500 text-lg">Error: {error}</p>;
    }
    const animacion={
      primera:{opacity:0,x:-50},
      segunda:{opacity:1,x:0}
      
    }
  return(<>
  <motion.div
  variants={animacion}
  initial="primera"
  whileInView="segunda"
    transition={{ duration: 0.9, ease: "easeInOut" }}
  >
      {productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Recorre el arreglo 'product' y muestra cada producto.
            Usa paréntesis '()' en lugar de llaves '{}' para que el return sea implícito.
            mi error era {product.map(producto=>{fue colcoar llaves en ves de ()})}
          */}
            {productos.map((producto) => (
              // IMPORTANTE: Cada elemento debe tener una 'key' única.
              // Asumo que tu objeto 'producto' tiene una propiedad 'id'.
              //traemos el componente y colcamos la key y colocamos la variable iterada.id y colocamos el pront product del componente y {la variable iterada en map}
              <ProductCard key={producto.id} product={producto} /> 
            ))}
          </div>
        ) : (
          // Si el arreglo está vacío, muestra este mensaje mientras se cargan los datos.
          <p className="text-gray-700 text-lg font-semibold animate-pulse" >Cargando los Productos de su categoria...</p>
        )} 
  </motion.div> 
   
  </>);
}


 