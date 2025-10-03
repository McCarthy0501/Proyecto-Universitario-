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
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Slug</th>
            <th className="px-4 py-2 text-left">Descripción</th>
            <th className="px-4 py-2 text-left">Precio</th>
            <th className="px-4 py-2 text-left">Imagen</th>
            <th className="px-4 py-2 text-left">Stock</th>
            <th className="px-4 py-2 text-left">Disponible</th>
            <th className="px-4 py-2 text-left">Categoría</th>
            <th className="px-4 py-2 text-left">Creado</th>
            <th className="px-4 py-2 text-left">Modificado</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {product.length > 0 ? (
            product.map((product) => (
              <tr key={product.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{product.product_name}</td>
                <td className="px-4 py-2">{product.slug}</td>
                <td className="px-4 py-2 max-w-xs truncate">{product.description}</td>
                <td className="px-4 py-2 font-semibold text-green-600">${product.price}</td>
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
                <td className="px-4 py-2">{product.stock}</td>
                <td className="px-4 py-2">
                  {product.is_available ? (
                    <span className="text-green-600 font-medium">Sí</span>
                  ) : (
                    <span className="text-red-600 font-medium">No</span>
                  )}
                </td>
                <td className="px-4 py-2">{product.category?.name || "N/A"}</td>
                <td className="px-4 py-2">{new Date(product.created_date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{new Date(product.modified_date).toLocaleDateString()}</td>
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
