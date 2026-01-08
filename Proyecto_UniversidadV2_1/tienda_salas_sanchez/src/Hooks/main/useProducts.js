import { useState,useEffect,useMemo } from "react";


export const useProducts=()=>{
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
    
    const productosOrdenados=useMemo(()=>{

      const copiaProductos=[...product]//copia de los productos

      //ojo no esta acomodadoooo
      return copiaProductos.sort((a,b)=>{
        
        const producto_A=a.product_name.toUpperCase();

        const producto_B=b.product_name.toUpperCase();

        if (producto_A<producto_B){
          return -1
       
        }
         else if (producto_A>producto_B){
          return 1
        }
        return 0
      })
        
    },[product])

    return{
        product, // Productos originales
        productosOrdenados, // Productos ordenados alfabéticamente
    }

}