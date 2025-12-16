
//import BarraBusqueda from "../barraBusqueda"
import { Logo } from "../header/logo"




function NavAdmin(){
    return(<>
        <nav className="w-full flex flex-col md:flex-row justify-between items-center bg-gray-900 p-4 text-white sticky top-0 z-50 ">
          <div className="mb-4 md:mb-0">
            <a href="/admin" > <Logo /></a>
          </div>
          <div className="md:flex-grow md:mx-10">
           
            
          </div>
          <div className="mt-4 md:mt-0">
           
            
          </div>
        </nav>
      </>)
}
export default NavAdmin