import { useState, useEffect } from "react";
import TableCategorys from "../../components/adminComponents/TableCategorys";
import TableProducts from "../../components/adminComponents/TableProducts";
import AdminSidebar from "../../components/adminComponents/menuAdmin";
import AggCategory from "../../components/adminComponents/categorys/AggCategory";
import AggProducts from "../../components/adminComponents/products/AggProducts";
import TableUsers from "../../components/adminComponents/users/TableUsers";
import TableOrders from "../../components/adminComponents/TableOrders";
import Estadistica from "../../components/adminComponents/estadsiticas";
import ExchangeRatePanel from "../../components/adminComponents/ExchangeRatePanel";
import { motion } from "framer-motion";

function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const secciones = {
    'dashboard': <Estadistica />,
    'categorias': <TableCategorys />,
    'productos': <TableProducts />,
    'aggCategorias': <AggCategory />,
    'aggProducts': <AggProducts />,
    'usuarios': <TableUsers />,
    'ordenes': <TableOrders />,
    'tasa': <ExchangeRatePanel />
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-100">
      <AdminSidebar 
        setActiveSection={setActiveSection} 
        activeSection={activeSection}
      />
      
      <main className="flex-1 w-full max-w-full overflow-y-auto p-4 sm:p-6">
        {secciones[activeSection] ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {secciones[activeSection]}
          </motion.div>
        ) : (
          <Estadistica />
        )}
      </main>
    </div>
  );
}
export default AdminPanel;