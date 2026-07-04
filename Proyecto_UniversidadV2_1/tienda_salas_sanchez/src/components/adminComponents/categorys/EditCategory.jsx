import { useNavigate,useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import { LogoForm } from "../../header/logo";
import { API_BASE_URL } from "../../../api";
export default function EditCategory(){
    const { id } = useParams();
    const navigate=useNavigate();
    const [newName, setNewName] = useState({
      category_name: "",
      description: "",
      slug: "",
      cat_image: null,
    });
    
    useEffect(()=>{
        const token = localStorage.getItem("adminToken") || localStorage.getItem("accessToken");
        
        if (!token) {
            alert("Sesión expirada. Por favor inicie sesión nuevamente");
            navigate("/admin");
            return;
        }
        
        const peticionApi =async ()=>{
            try {
<<<<<<< HEAD
               const res= await fetch(`${API_BASE_URL}/api/edit_categorias/${id}/`);
=======
               const res= await fetch(`http://localhost:8000/api/edit_categorias/${id}/`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                },
               });
               if (!res.ok) {
                   alert("Error al cargar categoría");
                   navigate("/adminPanel");
                   return;
               }
>>>>>>> desarrollo
               const data=await res.json() 
               setNewName({
                category_name:data.category_name,
                description:data.description,
                slug:data.slug,
                cat_image:null
               })
            } catch (error) {
                console.error(error);
                alert("Error al conectar con el servidor");
            }
        }
        peticionApi();
    },[id])

    const captura= (e)=>{
        const { name, value,type, files } = e.target;
        if (type === "file") {
          setNewName({ ...newName, [name]: e.target.files[0] });
          } else {
            setNewName({ ...newName, [name]: e.target.value });
          }
    }

    const editCategorySubmit= async (e)=>{
        e.preventDefault();
        const token = localStorage.getItem("adminToken") || localStorage.getItem("accessToken");
        
        if (!token) {
            alert("Sesión expirada. Por favor inicie sesión nuevamente");
            navigate("/admin");
            return;
        }
        
        const fromdata= new FormData();
        fromdata.append("category_name", newName.category_name);
        fromdata.append("description",newName.description);
        fromdata.append("slug", newName.slug);
        if (newName.cat_image) fromdata.append("cat_image", newName.cat_image);
        try {
            const res = await fetch(`${API_BASE_URL}/api/edit_categorias/${id}/`, {
            method: "PUT",
            headers: {
                'Authorization': token ? `Bearer ${token}` : '',
            },
            body: fromdata,
            });
            
            if (!res.ok) throw new Error("Error al actualizar la categoría");

            alert("Categoría actualizada con éxito");
            navigate("/adminPanel");
        } catch (err) {
        console.error(err);
            }
    }
        
    return (
    <>
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
            <a href="/admin">  <LogoForm alt="Logo de la Empresa" 
            className="w-20 h-20 mb-2"/> </a>
          <h2 className="text-2xl font-bold text-center text-gray-800">Edite la Categoria</h2>
        </div>

        <form className="space-y-4" onSubmit={editCategorySubmit}>
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

          <textarea
            type="text"
            name="description"
            placeholder="Descripción de la Categoria"
            value={newName.description}
            onChange={captura}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

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