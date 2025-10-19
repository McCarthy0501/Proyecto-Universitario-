import { useState, useEffect } from "react";

export default function TableUsers() {
     const [users,setUsers]=useState([])
    useEffect(() => {
      const peticion = async () => {
        const url = "http://localhost:8000/api/users"; //url de la api creada en django
        try {
          const peti = await fetch(url); //hacemos la peticion confetch y como parametro la variable url
          const data = await peti.json(); //transformamos la respuesta en json

          setUsers(data); //cambiamos el estado y como parametro pasamos el json
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
            <th className="px-4 py-2 text-left">Apellido</th>
            <th className="px-4 py-2 text-left">Username</th>
            <th className="px-4 py-2 text-left">email</th>
            <th className="px-4 py-2 text-left">Creacion</th>
            <th className="px-4 py-2 text-left">ultima conexcion</th>
            <th className="px-4 py-2 text-left">N° de Telefono</th>
            <th className="px-4 py-2 text-left">Permiso al Panel</th>
            <th className="px-4 py-2 text-left">Administrador</th>
            <th className="px-4 py-2 text-left">SuperAdmin</th>
             <th className="px-4 py-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="px-4 py-2">{user.first_name}</td>
                <td className="px-4 py-2">{user.last_name}</td>
                <td className="px-4 py-2 max-w-xs truncate">{user.username}</td>
                <td className="px-4 py-2 ">{user.email}</td>
                <td className="px-4 py-2 ">{new Date(user.date_joinded).toLocaleDateString()}</td>
                <td className="px-4 py-2 ">{new Date(user.last_login).toLocaleDateString() }</td>
                <td className="px-4 py-2">{user.phone_number}</td>
                
                 <td className="px-4 py-2">
                  {user.is_staff  ? (
                    <span className="text-green-600 font-medium">Sí Posee</span>
                  ) : (
                    <span className="text-red-600 font-medium">No Posee</span>
                  )}
                </td>

                <td className="px-4 py-2">
                  {user.is_admin  ? (
                    <span className="text-green-600 font-medium">Sí</span>
                  ) : (
                    <span className="text-red-600 font-medium">No</span>
                  )}
                </td>
                
                 <td className="px-4 py-2">
                  {user.is_superadmin  ? (
                    <span className="text-green-600 font-medium">Sí</span>
                  ) : (
                    <span className="text-red-600 font-medium">No</span>
                  )}
                </td>
                  
                 <td className="px-4 py-2">
                  {user.is_active  ? (
                    <span className="text-green-600 font-medium">Activa</span>
                  ) : (
                    <span className="text-red-600 font-medium">No Activa</span>
                  )}
                </td>
          
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                No hay Usuarios Registrados
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
