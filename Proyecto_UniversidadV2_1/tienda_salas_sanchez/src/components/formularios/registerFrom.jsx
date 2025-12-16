// src/components/forms/RegisterForm.jsx
import  { useState } from 'react';
import {LogoForm} from"../header/logo";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
function RegisterForm() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username:'',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  //redireccion
  const navegar=useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    //validamos datos antes de enviarlos
    if (!formData.first_name || !formData.last_name || !formData.username  || !formData.password){
      alert("Campos Obligatorios");
      return;
    }
    if (formData.password != formData.confirm_password){
      alert("contraseñas no coinciden");
      return;
    }

    const url = "http://localhost:8000/api/register_user/";
    try {
      const peticion = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const respuesta= await peticion.json();
      if (!peticion.ok){
        alert(respuesta.message || "error al registrar el Usuario");
        return;
      }

      // Guardar JWT en localStorage
      localStorage.setItem("accessToken", respuesta.access);
      localStorage.setItem("refreshToken", respuesta.refresh);

      // Actualizar el contexto de autenticación
      login({ 
        email: formData.email,
        username: formData.username,
        token: respuesta.access 
      });

      console.log("accessToken", respuesta.access);
      console.log("refreshToken", respuesta.refresh);
      
      alert("Usuario registrado con exito !! ")
      navegar('/')
      
    } catch (error) {
      console.error(error);
        alert(respuesta.message || "usuario registrado exitosamente");
    };

  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          {/* Logo de la empresa */}
            <a href="/register">  <LogoForm alt="Logo de la Empresa" 
            className="w-20 h-20 mb-2"/> </a>
          <h2 className="text-2xl font-bold text-center text-gray-800">Crea tu cuenta</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nombre y Apellido */}
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <input
              type="text"
              name="first_name"
              placeholder="Nombre"
              value={formData.first_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="last_name"
              placeholder="Apellido"
              value={formData.last_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <input
              type="text"
              name="username"
              placeholder="nombre de usuario"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
         

          {/*  Email */}
         
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Teléfono */}
          <input
            type="tel"
            name="phone_number"
            placeholder="Teléfono"
            value={formData.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Contraseña */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Confirmar Contraseña */}
          <input
            type="password"
            name="confirm_password"
            placeholder="Confirmar contraseña"
            value={formData.confirm_password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
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