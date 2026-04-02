import { useState } from "react";
import { FaBoxes, FaUsers, FaSignOutAlt, FaChevronDown, FaChevronRight, FaBoxOpen, FaClipboardList, FaChartBar, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAdminAuth } from "../../contexts/AdminAuthContext";

export default function AdminSidebar({ setActiveSection, activeSection }) {
  const [openCategorias, setOpenCategorias] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [openOrder, setOpenOrder] = useState(false);
  
  const navigate = useNavigate();
  const { logout, adminUser } = useAdminAuth();

  const handleLogout = () => {
    logout();
  };

  const animacion_menu = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartBar },
    { id: 'categorias', label: 'Categorías', icon: FaBoxes },
    { id: 'productos', label: 'Productos', icon: FaBoxOpen },
    { id: 'usuarios', label: 'Usuarios', icon: FaUsers },
    { id: 'ordenes', label: 'Órdenes', icon: FaClipboardList },
  ];

  return (
    <>
      <motion.div
        variants={animacion_menu}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="w-64 bg-gray-900 text-white h-full flex flex-col shadow-xl">
          {/* Header */}
          <div className="p-5 border-b border-gray-700">
            <div className="text-xl font-bold mb-1">Admin Panel</div>
            <div className="text-xs text-gray-400">
              {adminUser?.first_name} {adminUser?.last_name}
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            {/* Categorías dropdown */}
            <div className="mt-2 pt-2 border-t border-gray-700">
              <button
                onClick={() => setOpenCategorias(!openCategorias)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded transition"
              >
                <span className="flex items-center gap-3">
                  <FaBoxes />
                  Gestión Categorías
                </span>
                {openCategorias ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              {openCategorias && (
                <div className="ml-6 mt-1 space-y-1">
                  <button
                    className={`block w-full text-left px-3 py-2 rounded ${
                      activeSection === 'categorias' ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setActiveSection("categorias");
                      setOpenCategorias(false);
                    }}
                  >
                    Ver todas
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 rounded ${
                      activeSection === 'aggCategorias' ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setActiveSection("aggCategorias");
                      setOpenCategorias(false);
                    }}
                  >
                    Agregar nueva
                  </button>
                </div>
              )}
            </div>

            {/* Productos dropdown */}
            <div className="pt-2 border-t border-gray-700">
              <button
                onClick={() => setOpenProducts(!openProducts)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded transition"
              >
                <span className="flex items-center gap-3">
                  <FaBoxOpen />
                  Gestión Productos
                </span>
                {openProducts ? <FaChevronDown /> : <FaChevronRight />}
              </button>
              {openProducts && (
                <div className="ml-6 mt-1 space-y-1">
                  <button
                    className={`block w-full text-left px-3 py-2 rounded ${
                      activeSection === 'productos' ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setActiveSection("productos");
                      setOpenProducts(false);
                    }}
                  >
                    Lista de productos
                  </button>
                  <button
                    className={`block w-full text-left px-3 py-2 rounded ${
                      activeSection === 'aggProducts' ? 'bg-blue-600' : 'hover:bg-gray-700'
                    }`}
                    onClick={() => {
                      setActiveSection("aggProducts");
                      setOpenProducts(false);
                    }}
                  >
                    Crear Producto
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Cerrar sesión */}
          <div className="p-4 border-t border-gray-700">
            <button
              className="w-full flex items-center gap-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              Cerrar sesión
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}