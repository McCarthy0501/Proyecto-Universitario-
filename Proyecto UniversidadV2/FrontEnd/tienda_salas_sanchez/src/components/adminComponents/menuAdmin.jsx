import { useState } from "react";
import { FaBoxes, FaUsers, FaSignOutAlt, FaChevronDown, FaChevronRight, FaBoxOpen,FaClipboardList   } from "react-icons/fa";
import { useNavigate } from "react-router-dom";




export default function AdminSidebar({ setActiveSection }) {
  const [openCategorias, setOpenCategorias] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openProducts,setOpenProducts]=useState(false);
  const [openOrder,setOpenOrder]=useState(false);
  
  const navegador=useNavigate();
  //OJO ESTE CIERRE DE SESION ES SOLO DE PRUEBA 
   const cierre=()=>{
      localStorage.removeItem('user');
      alert("haz cerrado sesion")
      navegador("/admin")
      console.log("Sesion cerrada con exito")
    }

    


  return (
    <div className="w-64 bg-gray-900 text-white h-full flex flex-col shadow-xl">
      {/* Header */}
      <div className="p-5 text-2xl font-bold border-b border-gray-700">
       Panel de Navegacion
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {/* Categorías */}
        <div>
          <button
            onClick={() => setOpenCategorias(!openCategorias)}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded transition"
          >
            <span className="flex items-center gap-3">
              <FaBoxes />
              Categorías
            </span>
            {openCategorias ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openCategorias && (
            <div className="ml-8 mt-1 space-y-1">
              <button className="block w-full text-left px-3 py-1 hover:bg-gray-700 rounded"
               onClick={() => setActiveSection("categorias")} >
                Ver todas
              </button>
              <button className="block w-full text-left px-3 py-1 hover:bg-gray-700 rounded"
              onClick={() => setActiveSection("aggCategorias")}>
                Agregar nueva
              </button>
            </div>
          )}
        </div>

        {/* Usuarios */}
        <div>
          <button
            onClick={() => setOpenUsuarios(!openUsuarios)}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded transition"
          >
            <span className="flex items-center gap-3">
              <FaUsers />
              Usuarios
            </span>
            {openUsuarios ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openUsuarios && (
            <div className="ml-8 mt-1 space-y-1">
              <button className="block w-full text-left px-3 py-1 hover:bg-gray-700 rounded"
              onClick={()=>{ setActiveSection("users")}}>
                Lista de usuarios
              </button>
              
            </div>
          )}
        </div>

        {/* productos*/}
        <div>
          <button
            onClick={() => setOpenProducts(!openProducts)}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded transition"
          >
            <span className="flex items-center gap-3">
             <FaBoxOpen/>
              Productos
            </span>
            {openProducts ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openProducts && (
            <div className="ml-8 mt-1 space-y-1">
              <button className="block w-full text-left px-3 py-1 hover:bg-gray-700 rounded"
              onClick={() => setActiveSection("productos")}
              >
                Lista de productos
              </button>
              <button className="block w-full text-left px-3 py-1 hover:bg-gray-700 rounded"
              onClick={() => setActiveSection("aggProducts")}>
                Crear Producto
              </button>
            </div>
          )}
        </div>

           {/* ordenes*/}
        <div>
          <button
            onClick={() => setOpenOrder(!openOrder)}
            className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded transition"
          >
            <span className="flex items-center gap-3">
             <FaClipboardList/>
              Ordenes
            </span>
            {openOrder ? <FaChevronDown /> : <FaChevronRight />}
          </button>
          {openOrder && (
            <div className="ml-8 mt-1 space-y-1">
              <button className="block w-full text-left px-3 py-1 hover:bg-gray-700 rounded"
              onClick={() => setActiveSection("productos")}
              >
                Lista de Ordenes
              </button>
              
            </div>
          )}
        </div>


        
      </nav>

      {/* Cerrar sesión */}
      <div className="p-4 border-t border-gray-700">
        <button className="w-full flex items-center gap-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition" onClick={cierre}>
          <FaSignOutAlt />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
