import Narbar from "../header/narbar";
import Footer from "../footer/footer";
import { Outlet } from "react-router-dom";

function MainLayout({ user, setUser }) {
 return (
 <>
 <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">Saltar al contenido</a>
 <Narbar User={user} setuser={setUser} className="w-full ..."/>
 <main id="main-content" className="container mx-auto p-4 flex-1">
 <Outlet />
 </main>
 <Footer className="w-full ..."/>
 </>
 );
}

export default MainLayout;
