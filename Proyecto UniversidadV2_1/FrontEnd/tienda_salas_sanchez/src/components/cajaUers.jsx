
import { FaUser } from "react-icons/fa";

import { FaUserPlus } from "react-icons/fa";
import ShopingCart from "./shopingCart";



function CajitaUser() {
    return (
      <>
        <div className="flex items-center mt-4 md:mt-0 space-x-2 md:space-x-4">
            <ShopingCart/>
            

          <a
            href="/login"
            className="w-full md:w-auto flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <FaUser className="mr-2" />
            Iniciar Sesión
          </a>
          <a
            href="/register"
            className="w-full md:w-auto flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            <FaUserPlus className="mr-2" />
            Registrarse
          </a>
        </div>
      </>
    );
    
}

export default CajitaUser