import { useState } from 'react';
import { LogoForm } from '../header/logo';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../api';
import toast from 'react-hot-toast';

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { refreshUserInfo } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo invalido';
    if (!formData.password) newErrors.password = 'La contrasena es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'Minimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const url = `${API_BASE_URL}/api/token/`;
    try {
      const peticion = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await peticion.json();
      if (peticion.ok) {
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("userEmail", formData.email);
        refreshUserInfo().catch(() => {});
        toast.success("Bienvenido! Has iniciado sesion");
        navigate("/");
      } else {
        toast.error(data.detail || "Email o contrasena incorrectos");
      }
    } catch (error) {
      toast.error("Error al iniciar sesion");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <a href="/login"><LogoForm alt="Logo de la Empresa" className="w-20 h-20 mb-2" /></a>
          <h2 className="text-2xl font-bold text-center text-gray-800">Inicia Sesion</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Correo electronico"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}

          <input
            type="password"
            name="password"
            placeholder="Contrasena"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesion
          </button>

          <div className="text-center mt-4">
            <a href="/#/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              Olvidaste tu contrasena?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
