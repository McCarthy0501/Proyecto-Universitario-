import { useState,useEffect } from "react";
import ProductCard from "./productCard";
import { motion } from "framer-motion";

{/*creamos la funcion */}
function Productos() {
    const [product,setProduct]=useState([])
    useEffect(() => {
      const peticion = async () => {
        const url = "http://localhost:8000/api/productos"; //url de la api creada en django
        try {
          const peti = await fetch(url); //hacemos la peticion confetch y como parametro la variable url
          const data = await peti.json();//transformamos la respuesta en json
          
          setProduct(data);//cambiamos el estado y como parametro pasamos el json
        } catch (e) {
          console.log("error en los datos", e);//capturamos los errores
        }
      };
      peticion();//ejecutamos la funcion
    }, []);//el[ ] para que se ejecute una sola vez

    const animacion={
      desaparece:{opacity:0,x:-50},
      aparece:{opacity:1,x:0},
    }
    return (
      <>
        <motion.div
          variants={animacion}
          initial="desaparece"
          whileInView="aparece"
          transition={{ duration: 0.9, ease: "easeInOut" }}

        >
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