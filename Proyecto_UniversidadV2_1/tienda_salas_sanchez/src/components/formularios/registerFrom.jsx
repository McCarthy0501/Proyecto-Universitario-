import { useState } from 'react';
import { LogoForm } from "../header/logo";
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api';
import toast from 'react-hot-toast';

function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'El nombre es obligatorio';
    if (!formData.last_name) newErrors.last_name = 'El apellido es obligatorio';
    if (!formData.username) newErrors.username = 'El usuario es obligatorio';
    if (!formData.email) newErrors.email = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Correo invalido';
    if (!formData.password) newErrors.password = 'La contrasena es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'Minimo 6 caracteres';
    if (formData.password !== formData.confirm_password) newErrors.confirm_password = 'Las contrasenas no coinciden';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const url = `${API_BASE_URL}/api/register_user/`;
    try {
      const peticion = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const respuesta = await peticion.json();
      if (!peticion.ok) {
        toast.error(respuesta.message || "Error al registrar el usuario");
        return;
      }
      toast.success("Registro exitoso! Por favor inicia sesion");
      navigate('/login');
    } catch (error) {
      toast.error("Error al registrar el usuario");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <a href="/register"><LogoForm alt="Logo de la Empresa" className="w-20 h-20 mb-2" /></a>
          <h2 className="text-2xl font-bold text-center text-gray-800">Crea tu cuenta</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="w-full">
              <input
                type="text"
                name="first_name"
                placeholder="Nombre"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.first_name ? 'border-red-500' : ''}`}
              />
              {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>}
            </div>
            <div className="w-full">
              <input
                type="text"
                name="last_name"
                placeholder="Apellido"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.last_name ? 'border-red-500' : ''}`}
              />
              {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>}
            </div>
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : ''}`}
            />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electronico"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <input
            type="tel"
            name="phone_number"
            placeholder="Telefono"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div>
            <input
              type="password"
              name="password"
              placeholder="Contrasena"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div>
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirmar contrasena"
              value={formData.confirm_password}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirm_password ? 'border-red-500' : ''}`}
            />
            {errors.confirm_password && <p className="text-red-500 text-xs mt-1">{errors.confirm_password}</p>}
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
