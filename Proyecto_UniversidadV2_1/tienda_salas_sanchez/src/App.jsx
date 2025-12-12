import { HashRouter , Routes, Route } from 'react-router-dom'; // esto nos permite realizar los enrrutamientos
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import Home from './pages/ecomerce/home';
import Login from './pages/ecomerce/login';
import Register from './pages/ecomerce/register';
import MostrarProductos from './pages/ecomerce/mostrarProductos';
import MostrarCategorys from './pages/ecomerce/mostrarCategorias';
import MostrarProductosPorCategorias from './pages/ecomerce/mostrarProductosPorCategorias';
import CartPage from './pages/ecomerce/cartpage';
import MainLayout from './components/MainLayout';
import MiCuenta from './pages/ecomerce/miCuenta';



import FormAdmin from './components/adminComponents/LoginAdmin';
import EditCategory from './components/adminComponents/categorys/EditCategory';
import DeleteCategory from './components/adminComponents/categorys/DeleteCategory';
import AdminLayout from './pages/admin/AdminLayout';
import AdminPanel from './pages/admin/AdminPanel';

function App() {


  
  return (
    <>
      {/* iniciamos con el nombramiento de rutas*/}
      <AuthProvider> {/* estados globales  */}
        <CartProvider>
          <div className="flex flex-col min-h-screen bg-gray-100">
            
              <Routes>
            <Route element={<MainLayout />}>
              
              {/* rutas apra usuarios normales */}
              <Route path="/" element={<Home />}></Route>
              {/*configuracion de pag de inicio del ecomerce*/}
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/productos" element={<MostrarProductos />}></Route>
              <Route path="/categorias" element={<MostrarCategorys />}></Route>
              <Route path='/categoriasPorProductos/:id' element={<MostrarProductosPorCategorias/>}></Route>
              <Route path="/cart" element={<CartPage />}></Route>
              <Route path='/micuenta' element={<MiCuenta/>}></Route>

            </Route>

            {/*configuracion de pag de inicio del ecomerce*/}
            <Route element={<AdminLayout />}>
              {/* rutas apra usuarios admins  */}
              <Route path="/admin" element={<FormAdmin />}></Route>
              <Route path='/adminPanel' element={<AdminPanel/>}></Route>
              <Route path='/editcategory/:id' element={<EditCategory/>}></Route>
              <Route path='/deletecategory/:id' element={<DeleteCategory/>}></Route>
            </Route>
          </Routes>
            
          </div>
        </CartProvider>
      </AuthProvider>
    </>
  );
}


export default App
