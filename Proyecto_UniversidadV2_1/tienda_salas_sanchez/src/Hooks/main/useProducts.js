import { useState,useEffect } from "react";


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

    return{
        product,
        
    }

}