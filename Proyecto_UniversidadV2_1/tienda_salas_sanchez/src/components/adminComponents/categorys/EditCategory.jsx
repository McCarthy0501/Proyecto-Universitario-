import { useNavigate,useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import { LogoForm } from "../../logo";
export default function EditCategory(){
    const { id } = useParams();//extraemos el parametro de la category que viene de url de tablecategory
    console.log(id)
    const navigate=useNavigate();//instanciamos use navigate
    //inicializamos los campos en blanco
    const [newName, setNewName] = useState({
      category_name: "",
      description: "",
      slug: "",
      cat_image: null, // para archivos
    });
    // 
    useEffect(()=>{
        //peticion para la extraccion de los valores actuales de la categoria desde la Api
        const peticionApi =async ()=>{
            try {
               const res= await fetch(`http://localhost:8000/api/edit_categorias/${id}/`);
               const data=await res.json() 
               //capturamos los valores originales de la categoria
               setNewName({
                category_name:data.category_name,
                description:data.description,
                slug:data.slug,
                cat_image:null
               })
            } catch (error) {
                console.error(error);
                
            }
        }
        peticionApi();
    },[id])

//captura de valores de los inputs
    const captura= (e)=>{
        const { name, value,type, files } = e.target;
        if (type === "file") {
          setNewName({ ...newName, [name]: e.target.files[0] }); // captura la foto
          } else {
            setNewName({ ...newName, [name]: e.target.value });
          }

    }

    //formulario para el put 
    const editCategorySubmit= async (e)=>{
        e.preventDefault();
        //creamos el formulario asignadole los valores tomados de la api 
        //
        const fromdata= new FormData();
        fromdata.append("category_name", newName.category_name);
        fromdata.append("description",newName.description);
        fromdata.append("slug",newName.slug);
        if (newName.cat_image) fromdata.append("cat_image", newName.cat_image);
        //capturamos errores en el PUT
        try {
            const res = await fetch(`http://localhost:8000/api/edit_categorias/${id}/`, {
            method: "PUT",
            body: fromdata,
            });

            if (!res.ok) throw new Error("Error al actualizar la categoría");

            alert("Categoría actualizada con éxito");
            navigate("/adminPanel"); // vuelve a la tabla
        } catch (err) {
        console.error(err);
            }


    }
    return (
    <>
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          {/* Logo de la empresa */}
            <a href="/admin">  <LogoForm alt="Logo de la Empresa" 
            className="w-20 h-20 mb-2"/> </a>
          <h2 className="text-2xl font-bold text-center text-gray-800">Edite la Categoria</h2>
        </div>

        <form className="space-y-4" onSubmit={editCategorySubmit}>
          {/* nombre de la categoria */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <input
              type="text"
              name="category_name"
              placeholder="Nombre "
              value={newName.category_name}
              onChange={captura}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="slug"
              placeholder="slug"
              value={newName.slug}
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
            value={newName.description}
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
            className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Actualizar Categoria
          </button>
        </form>
      </div>
    </div>
    </>)
}