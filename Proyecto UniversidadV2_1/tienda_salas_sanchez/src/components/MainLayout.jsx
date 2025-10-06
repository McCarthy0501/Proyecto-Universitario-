import Narbar from "./narbar";
import Footer from "./footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Narbar className="w-full ..."/>  {/* solo aparece en el frontend normal */}
       <main className="container mx-auto p-4 flex-1">
        <Outlet />  {/* renderiza la página correspondiente */}
      </main>
      <Footer className="w-full ..."/>
    </>
  );
}

export default MainLayout;
