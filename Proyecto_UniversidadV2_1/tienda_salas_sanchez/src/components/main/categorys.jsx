import CategoryCard from "../complementos/categoryCard";
import { useCategorys } from "../../Hooks/main/useCategorys";
function Categorys() {
    
    const{productosPorCategoria,categoriasOrdenadas}=useCategorys(); // usando el hook personalizado

    return(
        <>
            
            {categoriasOrdenadas.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 cursor-pointer md:grid-cols-3 lg:grid-cols-4 gap-6"
                 >
                    {categoriasOrdenadas.map((category)=>(
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