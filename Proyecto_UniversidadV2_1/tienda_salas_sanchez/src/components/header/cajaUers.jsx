import { User, LogOut, Settings, UserPlus, Heart } from 'lucide-react';
import ShopingCart from "../complementos/shopingCart";
import { useAuth } from '../../contexts/AuthContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useNavigate } from 'react-router-dom';

function CajitaUser() {
    const { isAuthenticated, user, logout } = useAuth();
    const { wishlistCount } = useWishlist();
    const navigate = useNavigate();

    console.log('🔍 Datos del usuario en cajaUers:', user);
    console.log('🔍 Usuario autenticado:', isAuthenticated);

    const miCuenta=()=>{
      navigate('/micuenta')
    }

    const handleLogout = () => {
        logout();
        alert("Sesion Cerrada con Exito!!")
        navigate('/');
    };

    return (
      <>
        <div className="flex items-center mt-4 md:mt-0 space-x-2 md:space-x-4">
          <a
            href="/#/wishlist"
            className="relative p-2 text-gray-300 hover:text-white"
          >
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </a>
          <ShopingCart />

          {isAuthenticated ? (
            // Usuario autenticado - mostrar opciones de usuario logueado
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                <User
                  size={24}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                />
                <span className="ml-2" onClick={miCuenta}>
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}` 
                    : user?.first_name 
                    ? user.first_name
                    : user?.username || user?.email || 'Mi Cuenta'
                  }
                </span>
                
              </div>
             
              <button
                onClick={handleLogout}
                className="w-full md:w-auto flex items-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                <LogOut
                  size={24}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                />
                <span className="ml-2">Cerrar Sesión</span>
              </button>
            </div>
          ) : (
            // Usuario no autenticado - mostrar opciones de login/registro
            <>
              <a
                href="/#/login"
                className="w-full md:w-auto flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <User
                  size={24}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                />
                Iniciar Sesión
              </a>
              <a
                href="/#/register"
                className="w-full md:w-auto flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                <UserPlus
                  size={24}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                />
                Registrarse
              </a>
            </>
          )}
        </div>
      </>
    );
    
}

export default CajitaUser;
