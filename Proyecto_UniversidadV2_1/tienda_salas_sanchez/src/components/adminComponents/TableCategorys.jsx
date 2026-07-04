import { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../api";

export default function TableCategorys() {
 
     const [category,setCategory]=useState([])
     
     const runEditCategory=useNavigate();//nos permitira navegar hacia el compoente de edicion
    //eliminar la categoria
     const eliminar= (id)=>{
      runEditCategory(`/deletecategory/${id}`)
     }
     //editar la categoria
     const editar=(id)=>{
      runEditCategory(`/editcategory/${id}`) //nos envia en donde esta el componente de edicion
     }//creamos una funcion que recibira como parametro el id de la categoria cuando precionemos editar
     
     //llamada a la api
    useEffect(() => {
      const peticion = async () => {
        const url = `${API_BASE_URL}/api/categorias?page_size=500`;
        try {
          const peti = await fetch(url);
          const data = await peti.json();
          const items = data.results || data;
          setCategory(items);
        } catch (e) {
          console.log("error en los datos", e); //capturamos los errores
        }
      };
      peticion();//ejecutamos la funcion
    }, []);//el[ ] para que se ejecute una sola vez
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Slug</th>
            <th className="px-4 py-2 text-left">Descripción</th>
            <th className="px-4 py-2 text-left">Imagen</th>
            <th className="px-4 py-2 text-left"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {category.length > 0 ? (
            category.map((cate) => (
              <tr key={cate.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{cate.category_name}</td>
                <td className="px-4 py-2">{cate.slug}</td>
                <td className="px-4 py-2 max-w-xs truncate">
                  {cate.description}
                </td>

                <td className="px-4 py-2">
                  {cate.cat_image ? (
                    <img
                      src={cate.cat_image}
                      alt={cate.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500">Sin imagen</span>
                  )}
                </td>

                <td className="px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 Transition-colors"
                      onClick={()=>editar(cate.id)}  
                    >
                      Actualizar
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 Transition-colors"
                      onClick={()=>eliminar(cate.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                No hay categorias disponibles
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
