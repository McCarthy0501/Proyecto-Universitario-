import { useState,useEffect } from "react";
import TableProducts from "./TableProducts";
import { API_BASE_URL } from "../../api";

{/*creamos la funcion */}
function ProductsAdmin() {
    const [product,setProduct]=useState([])
    useEffect(() => {
      const peticion = async () => {
        const url = `${API_BASE_URL}/api/productos?page_size=500`;
        try {
          const peti = await fetch(url);
          const data = await peti.json();
          const items = data.results || data;
          setProduct(items);
        } catch (e) {
          console.log("error en los datos", e);//capturamos los errores
        }
      };
      peticion();//ejecutamos la funcion
    }, []);//el[ ] para que se ejecute una sola vez
    return (
      <>
        

        {product.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Recorre el arreglo 'product' y muestra cada producto.
            Usa paréntesis '()' en lugar de llaves '{}' para que el return sea implícito.
            mi error era {product.map(producto=>{fue colcoar llaves en ves de ()})}
          */}
            {product.map((producto) => (
              // IMPORTANTE: Cada elemento debe tener una 'key' única.
              // Asumo que tu objeto 'producto' tiene una propiedad 'id'.
              //traemos el componente y colcamos la key y colocamos la variable iterada.id y colocamos el pront product del componente y {la variable iterada en map}
              <TableProducts key={producto.id} products={producto} />
            ))}
          </div>
        ) : (
          // Si el arreglo está vacío, muestra este mensaje mientras se cargan los datos.
          <p className="text-gray-700 text-lg font-semibold animate-pulse" >Cargando Productos...</p>
        )}
      </>
    );
    
}

export default ProductsAdmin