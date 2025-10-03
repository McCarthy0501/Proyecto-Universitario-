
import BarraBusqueda from "./barraBusqueda";
import CajitaUser from "./cajaUers";
import { Logo } from "./logo";





function Narbar() {
    return (
      <>
        <nav className="w-full flex flex-col md:flex-row justify-between items-center bg-gray-900 p-4 text-white sticky top-0 z-50 ">
          <div className="mb-4 md:mb-0">
            <a href="/"> <Logo /></a>
            
          </div>
          <div className="md:flex-grow md:mx-10">
            <BarraBusqueda />
          </div>
          <div className="mt-4 md:mt-0">
            <CajitaUser />
          </div>
        </nav>
      </>
    );
    
}

export default Narbar