import { useState } from "react";
import { LogoForm } from "../../logo";
function AggCategory() {
  const [error, setError] = useState("");
    const [data,setData]=useState(
        {
        category_name: '',
        description: '',
        slug: '',
        cat_image: null,
        }

    )

    //capturamos los campos del formulario
    const captura= (e)=>{
        const { name, value,type, files } = e.target;
        if (type === "file") {
          setData({ ...data, [name]: e.target.files[0] }); // captura la foto
          } else {
            setData({ ...data, [name]: e.target.value });
          }

    }
//logica de peticion al backend
    const categorySubmit=async(e)=>{
       e.preventDefault();
       setError("");
       const formData = new FormData();
        formData.append("category_name", data.category_name);
        formData.append("slug", data.slug);
        formData.append("description", data.description);
        formData.append("cat_image", data.cat_image); 
       const url="http://localhost:8000/api/admin/aggCategory/"
       try {
        const solicitud=await fetch(url,{
            method: "POST",
           //cuando hay imagenes o archivos de por medio se coloca asi nada de json al enviar
            body: formData,
          });
          if(!solicitud.ok){
            new console.error("error al crear la categoria");
            
          }const resultado=await solicitud.json();
          console.log("Respuesta del backend:", resultado);
          alert("Categoria creada con exito")

        
       } catch (e) {
        console.error("Error en la petición:", e);
        setError("Error al crear categoria Verifica tus datos.");
        
       }


        
    }
    return <>
         <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          {/* Logo de la empresa */}
            <a href="/admin">  <LogoForm alt="Logo de la Empresa" 
            className="w-20 h-20 mb-2"/> </a>
          <h2 className="text-2xl font-bold text-center text-gray-800">Crea una Categoria</h2>
        </div>

        <form className="space-y-4" onSubmit={categorySubmit}>
          {/* nombre de la categoria */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <input
              type="text"
              name="category_name"
              placeholder="Nombre "
              value={data.category_name}
              onChange={captura}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="slug"
              placeholder="slug"
              value={data.slug}
              onChange={captura}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/*  description */}
         
          <textarea
            type="text"
            name="description"
            placeholder="Descripción de la Categoria"
            value={data.description}
            onChange={captura}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* imagen */}
          <input
            type="file"
            name="cat_image"
            placeholder="Imagen"
       
            onChange={captura}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          
          
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear Categoria
          </button>
        </form>
      </div>
    </div>
    </>;
    
}
export default AggCategory