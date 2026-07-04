import { useState } from "react";
import { Package, Users, LogOut, ChevronDown, ChevronRight, PackageOpen, ClipboardList, BarChart3, Home, DollarSign } from "lucide-react";
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
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'categorias', label: 'Categorias', icon: Package },
    { id: 'productos', label: 'Productos', icon: PackageOpen },
    { id: 'usuarios', label: 'Usuarios', icon: Users },
    { id: 'ordenes', label: 'Ordenes', icon: ClipboardList },
    { id: 'tasa', label: 'Tasa BCV', icon: DollarSign },
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
          <div className="p-5 border-b border-gray-700">
            <div className="text-xl font-bold mb-1">Admin Panel</div>
            <div className="text-xs text-gray-400">
              {adminUser?.first_name} {adminUser?.last_name}
            </div>
          </div>

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

            <div className="mt-2 pt-2 border-t border-gray-700">
              <button
                onClick={() => setOpenCategorias(!openCategorias)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded transition"
              >
                <span className="flex items-center gap-3">
                  <Package />
                  Gestion Categorias
                </span>
                {openCategorias ? <ChevronDown /> : <ChevronRight />}
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

            <div className="pt-2 border-t border-gray-700">
              <button
                onClick={() => setOpenProducts(!openProducts)}
                className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-700 rounded transition"
              >
                <span className="flex items-center gap-3">
                  <PackageOpen />
                  Gestion Productos
                </span>
                {openProducts ? <ChevronDown /> : <ChevronRight />}
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

          <div className="p-4 border-t border-gray-700">
            <button
              className="w-full flex items-center gap-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
              onClick={handleLogout}
            >
              <LogOut />
              Cerrar sesion
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}
