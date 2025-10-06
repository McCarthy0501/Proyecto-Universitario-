import { useState, useEffect } from "react";

export default function TableProducts() {
     const [product,setProduct]=useState([])
    useEffect(() => {
      const peticion = async () => {
        const url = "http://localhost:8000/api/productos"; //url de la api creada en django
        try {
          const peti = await fetch(url); //hacemos la peticion confetch y como parametro la variable url
          const data = await peti.json(); //transformamos la respuesta en json

          setProduct(data); //cambiamos el estado y como parametro pasamos el json
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
            <th className="px-4 py-2  text-center">Nombre</th>
            <th className="px-4 py-2 text-center">Slug</th>
            <th className="px-4 py-2 text-center">Descripción</th>
            <th className="px-4 py-2 text-center">Precio</th>
            <th className="px-4 py-2 text-center">Imagen</th>
            <th className="px-4 py-2 text-center">Stock</th>
            <th className="px-4 py-2 text-center">Disponible</th>
      
            <th className="px-4 py-2 text-center">Creado</th>
            <th className="px-4 py-2 text-center">Modificado</th>
            <th className="px-4 py-2 text-center"></th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {product.length > 0 ? (
            product.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{product.product_name}</td>
                <td className="px-4 py-2">{product.slug}</td>
                <td className="px-4 py-2 whitespace-normal break-words">{product.description}</td>
                <td className="px-4 py-2 ">${product.price}</td>
                <td className="px-4 py-2">
                  {product.images ? (
                    <img
                      src={product.images}
                      alt={product.product_name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-500">Sin imagen</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {product.stock <= 5?(
                    <div> 
                  <spam className=" bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold">{product.stock}</spam>
                  <div className="text-xs text-red-500 mt-1">¡Agotado!</div>
                  </div>
                ): product.stock <= 15 ?(
                  <div> 
                  <spam className=" bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">{product.stock}  </spam>
                  <div className="text-xs text-orange-500 mt-1">¡Casi Agotado !</div>
                  </div>
                )
                : (
                  <div>
                  <spam className=" bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">{product.stock}</spam>
                  <div className="text-xs text-green-900 mt-1">¡Stock Full!</div>
                  </div>
                )}</td>
                <td className="px-4 py-2 text-center">
                  {product.is_available ? (
                    <span className="text-green-600 font-medium ">Sí</span>
                  ) : (
                    <span className="text-red-600 font-medium">No</span>
                  )}
                </td>
               
                <td className="px-4 py-2">{new Date(product.created_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(product.modified_date).toLocaleDateString()}</td>
                
               <td className="px-4 py-2">
                  <div className="flex gap-2 justify-center">
                    <button
                      type="button"
                      className="px-3 py-1 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 Transition-colors"
                    >
                      Actualizar
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 Transition-colors"
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
                No hay productos disponibles
              </td>

             
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
