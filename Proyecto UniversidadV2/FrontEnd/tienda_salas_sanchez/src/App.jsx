import { BrowserRouter, Routes, Route } from 'react-router-dom'; // esto nos permite realizar los enrrutamientos

import Home from './pages/ecomerce/home';
import Login from './pages/ecomerce/login';
import Register from './pages/ecomerce/register';
import MostrarProductos from './pages/ecomerce/mostrarProductos';
import MostrarCategorys from './pages/ecomerce/mostrarCategorias';
import CartPage from './pages/ecomerce/cartpage';
import Narbar from './components/narbar';
import Footer from './components/footer';
import MainLayout from './components/MainLayout';
import AdminLayout from './pages/admin/AdminLayout';
import AdminPanel from './pages/admin/AdminPanel';


import FormAdmin from './components/adminComponents/LoginAdmin';


function App() {
  return (
    <>
      {/* iniciamos con el nombramiento de rutas*/}
      <div className="flex flex-col min-h-screen bg-gray-100">
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              
              {/* rutas apra usuarios normales */}
              <Route path="/" element={<Home />}></Route>
              {/*configuracion de pag de inicio del ecomerce*/}
              <Route path="/login" element={<Login />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/productos" element={<MostrarProductos />}></Route>
              <Route path="/categorias" element={<MostrarCategorys />}></Route>
              <Route path="/cart" element={<CartPage />}></Route>
            </Route>

            {/*configuracion de pag de inicio del ecomerce*/}
            <Route element={<AdminLayout />}>
              {/* rutas apra usuarios admins  */}
              <Route path="/admin" element={<FormAdmin />}></Route>
              <Route path='/adminPanel' element={<AdminPanel/>}></Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
}


export default App
