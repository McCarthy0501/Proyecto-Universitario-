import CategoryCard from "./categoryCard";
import { useState,useEffect } from "react"
import { href, useNavigate,useParams } from "react-router-dom";
function Categorys() {
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

   


    return(
        <>
            
            {category.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                 >
                    {category.map((category)=>(
                        <CategoryCard key={category.id} category={category} 
                        onCategoryClick={()=>productosPorCategoria(category.id)} //debemos agg un promp al componente para de esa forma hacer el onclick y de alli pasarle la variable que nos hara obtener la id
                       />
                        
                    ))}
                   
                   
                 </div>
            ):(<p className="text-gray-700 text-lg font-semibold animate-pulse">Cargando Categorias</p>)}
        
        </>
    )
    
}

export default Categorys