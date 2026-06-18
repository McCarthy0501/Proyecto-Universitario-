import { HashRouter , Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminAuthProvider, useAdminAuth } from './contexts/AdminAuthContext';
import { CartProvider } from './contexts/CartContext';
import { ExchangeRateProvider } from './contexts/ExchangeRateContext';
import { Toaster } from 'react-hot-toast';

import Home from './pages/ecomerce/home';
import Login from './pages/ecomerce/login';
import Register from './pages/ecomerce/register';
import MostrarProductos from './pages/ecomerce/mostrarProductos';
import MostrarCategorys from './pages/ecomerce/mostrarCategorias';
import MostrarProductosPorCategorias from './pages/ecomerce/mostrarProductosPorCategorias';
import CartPage from './pages/ecomerce/cartpage';
import MainLayout from '././components/main/MainLayout';
import MiCuenta from './pages/ecomerce/miCuenta';
import MisPedidos from './pages/ecomerce/misPedidos';
import ForgotPasswordForm from './components/formularios/forgotPasswordForm';
import SearchResults from './pages/ecomerce/searchResults';
import ProductDetailPage from './pages/ecomerce/productDetail';
import AdminRecovery from './pages/ecomerce/adminRecovery';


import FormAdmin from './components/adminComponents/LoginAdmin';
import EditCategory from './components/adminComponents/categorys/EditCategory';
import DeleteCategory from './components/adminComponents/categorys/DeleteCategory';
import EditProducts from './components/adminComponents/products/EditProducts';
import AdminLayout from './pages/admin/AdminLayout';
import AdminPanel from './pages/admin/AdminPanel';

function ProtectedAdminRoute({ children }) {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <CartProvider>
          <AdminAuthProvider>
            <ExchangeRateProvider>
            <div className="flex flex-col min-h-screen bg-gray-100">
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Home />}></Route>
                  <Route path="/login" element={<Login />}></Route>
                  <Route path="/register" element={<Register />}></Route>
                  <Route path="/forgot-password" element={<ForgotPasswordForm />}></Route>
                  <Route path="/productos" element={<MostrarProductos />}></Route>
                  <Route path="/producto/:id" element={<ProductDetailPage />}></Route>
                  <Route path="/categorias" element={<MostrarCategorys />}></Route>
                  <Route path='/categoriasPorProductos/:id' element={<MostrarProductosPorCategorias/>}></Route>
                  <Route path="/cart" element={<CartPage />}></Route>
                  <Route path='/micuenta' element={<MiCuenta/>}></Route>
                  <Route path='/mis-pedidos' element={<MisPedidos/>}></Route>
                  <Route path="/search" element={<SearchResults />}></Route>
                  <Route path="/admin-recovery" element={<AdminRecovery />}></Route>
                </Route>

                <Route path="/admin" element={<FormAdmin />}></Route>

                <Route element={<AdminLayout />}>
                  <Route path='/adminPanel' element={
                    <ProtectedAdminRoute>
                      <AdminPanel/>
                    </ProtectedAdminRoute>
                  }></Route>
                  <Route path='/editcategory/:id' element={
                    <ProtectedAdminRoute>
                      <EditCategory/>
                    </ProtectedAdminRoute>
                  }></Route>
                  <Route path='/deletecategory/:id' element={
                    <ProtectedAdminRoute>
                      <DeleteCategory/>
                    </ProtectedAdminRoute>
                  }></Route>
                  <Route path='/admin/editproduct/:id' element={
                    <ProtectedAdminRoute>
                      <EditProducts/>
                    </ProtectedAdminRoute>
                  }></Route>
                </Route>
              </Routes>
            </div>
            </ExchangeRateProvider>
          </AdminAuthProvider>
        </CartProvider>
      </AuthProvider>
    </>
  );
}

export default App;