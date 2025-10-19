import { useState,useEffect} from "react";
import TableCategorys from "../../components/adminComponents/TableCategorys";
import TableProducts from "../../components/adminComponents/TableProducts";
import AdminSidebar from "../../components/adminComponents/menuAdmin";
import AggCategory from "../../components/adminComponents/categorys/AggCategory";
import AggProducts from "../../components/adminComponents/products/AggProducts";
import TableUsers from "../../components/adminComponents/users/TableUsers";
import TableOrders from "../../components/adminComponents/TableOrders";
import { motion } from "framer-motion";


function AdminPanel() {
    const [user,setUser]=useState(null)
    const [activeSection, setActiveSection] = useState(""); //estado para renderizar los compoenentes
    useEffect(()=>{
        const stronuser=localStorage.getItem("user");//llamamos los datos guardados del login
        if (stronuser) {
          try {
            setUser(JSON.parse(stronuser)); // 🔹 parsear de forma segura
          } catch (e) {
            console.error("Error al parsear usuario de localStorage:", e);
          }
        }
    },[]);

    const secciones={
      'categorias':<TableCategorys/>,
      'productos':<TableProducts/>,
      'aggCategorias':<AggCategory/>,
      'aggProducts':<AggProducts/>,
      'users':<TableUsers/>,
      'ordenes':<TableOrders/>


      
    }

    const animacionMenuAdmin={
      desaparece:{opacity:0,y:-50},
      aparece:{opacity:1,y:50},

    }
    
    return (
      <>
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-100">
          <AdminSidebar setActiveSection={setActiveSection} />
        
          <main className="flex-1 w-full max-w-full overflow-y-auto p-4 sm:p-6">
            {/* Si activeSection tiene valor, secciones[activeSection] muestra el componente correspondiente */}
            
              {activeSection ? secciones[activeSection] : ""}
           
            
          </main>
           
        </div>
        
      </>
    );
    
}
export default AdminPanel