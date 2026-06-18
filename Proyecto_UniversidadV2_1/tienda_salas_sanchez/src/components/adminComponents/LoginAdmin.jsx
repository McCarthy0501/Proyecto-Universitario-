import { useState } from 'react';
import { LogoForm } from '../header/logo';
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { API_BASE_URL } from '../../api';

function FormAdmin() {
  const [data, setData] = useState({ email: "", password: ""});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAdminAuth();

  const capturarDatos = (e) => {
    const { name, value } = e.target;
    setData({...data, [name]: value});
  };

  const peticion = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Paso 1: Obtener token JWT
      const response = await fetch(`${API_BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Credenciales inválidas");
      }

      // Paso 2: Obtener datos del usuario
      const userResponse = await fetch(`${API_BASE_URL}/api/user/me/`, {
        headers: {
          'Authorization': `Bearer ${result.access}`,
        },
      });

      const userData = await userResponse.json();
      console.log("User data:", userData);

      // Paso 3: Verificar is_staff
      if (!userData.is_staff) {
        throw new Error("No tienes acceso al panel de administración");
      }

      // Paso 4: Guardar sesión
      login({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        is_staff: userData.is_staff,
        is_admin: userData.is_admin
      }, result.access);

      navigate("/adminPanel");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-100">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <a href="/">
            <LogoForm alt="Logo de la Empresa" className="w-20 h-20 mb-2" />
          </a>
          <h2 className="text-2xl font-bold text-center text-gray-800">
            Panel de Administración
          </h2>
          <p className="text-gray-500 text-sm mt-1">Ingresa tus credenciales</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={peticion}>
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={data.email}
            onChange={capturarDatos}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={data.password}
            onChange={capturarDatos}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="text-center mt-4 space-y-2">
          <a href="/" className="text-sm text-blue-600 hover:text-blue-800 block">
            ← Volver a la tienda
          </a>
          <a href="/#/admin-recovery" className="text-sm text-red-600 hover:text-red-800 block">
            ¿Olvidaste tu contraseña de administrador?
          </a>
        </div>
      </div>
    </div>
  );
}
export default FormAdmin;