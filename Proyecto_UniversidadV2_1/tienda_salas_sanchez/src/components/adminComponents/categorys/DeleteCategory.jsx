import { useNavigate,useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import { LogoForm } from "../../logo";

export default function DeleteCategory() {
    //obtenemos la id por medio de la url de table categori
    const {id}=useParams();
    const navegacion= useNavigate();
    const [delte, setdelete] = useState(null);
    useEffect(()=>{
        const peticion= async ()=>{
            try {
                const result= await fetch(`http://localhost:8000/api/delete_categorias/${id}/`);
                const data = await result.json();
                setdelete(data);
             
            } catch (error) {
                console.error(error);
                
            }
        }
        peticion();
    },[id])
// Si 'delte' es null significa que los datos de la categoría 
// aún no se han cargado desde la API, 
// así que mostramos un mensaje de carga mientras tanto
//delte es null y al tener el ! lo cambia a un valor verdadero
//por lo tanto se cumple la condicion
    if (!delte) {
        return (
        <div className="flex justify-center items-center h-screen text-gray-900">
            Cargando categoría...
        </div>
        );
            }

    

    //formulario
    const deleteCategorySubmit=async (e) =>{
         e.preventDefault();

         
        
        try {
            const solicitud = await fetch(`http://localhost:8000/api/delete_categorias/${id}/`,{
                method: "DELETE",
                
            });
            if (!solicitud.ok) {throw new Error("Error al eliminar la categoría");}
            
            alert("Se elimino la categoria con exito");
            navegacion("/adminPanel");

            
        } catch (error) {
            console.log(error)
            
        }
    }
    return (
        

      <>
        <div className="flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
            <div className="flex flex-col items-center mb-4">
              <a href="/admin">
                <LogoForm alt="Logo de la Empresa" className="w-20 h-20 mb-2" />
              </a>
              <h2 className="text-2xl font-bold text-center text-gray-800">
                Eliminar Categoría
              </h2>
              <p className="text-red-500 text-sm mt-1">
                Esta acción no se puede deshacer
              </p>
            </div>

            {/* Tarjeta de categoría */}
            <div className="bg-gray-50 rounded-xl p-4 shadow-inner space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {delte.category_name}
                </h3>
                <p className="text-sm text-gray-500">{delte.slug}</p>
              </div>

              <p className="text-gray-700 text-sm leading-relaxed">
                {delte.description}
              </p>

              {delte.cat_image && (
                <div className="flex justify-center">
                  <img
                    src={delte.cat_image}
                    alt="Imagen de la categoría"
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}
            </div>

            <button
              onClick={deleteCategorySubmit}
              className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Eliminar Categoría
            </button>
          </div>
        </div>
      </>
    );
    
}