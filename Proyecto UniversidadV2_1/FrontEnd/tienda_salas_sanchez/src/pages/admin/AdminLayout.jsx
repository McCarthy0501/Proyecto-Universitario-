import { Outlet } from "react-router-dom";
import NavAdmin from "../../components/adminComponents/NavAdmin";
import FooterAdmin from "../../components/adminComponents/FooterAdmin";

function AdminLayout() {
  return (
    <>
      
      <NavAdmin />
      {/* solo para admin */}
      <main className="flex-1 p-4 overflow-y-auto">
        <Outlet /> {/* renderiza las páginas del admin */}
      </main>
      <FooterAdmin />
    </>
  );
}

export default AdminLayout;
