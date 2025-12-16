import { useState,useEffect } from "react"
import {  useNavigate } from "react-router-dom";


export const useCategorys=()=>{
    
 const[category,setCategory]=useState([])
    useEffect(()=>{
        const peticion=async()=>{
            const url ="http://localhost:8000/api/categorias"
            try {
                const consulta= await fetch(url)
                const data= await consulta.json()
                setCategory(data)
                
            } catch (e) {
              console.log("error en los datos", e); //capturamos los errores
            }
        };
        peticion()
    },[])
    //tomar la id de la categoria
    const navegar =useNavigate(); //la navegacion hacia los productos por categorias
    const productosPorCategoria = (id)=>{ // funcion para cappturar la id
        navegar(`/categoriasPorProductos/${id}`)
    }

    return{
        category,
        productosPorCategoria
    }
}
   
