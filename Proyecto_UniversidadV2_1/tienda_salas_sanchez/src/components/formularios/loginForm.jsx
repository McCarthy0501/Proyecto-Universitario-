// src/components/forms/LoginForm.jsx
import  { useState } from 'react';
import {LogoForm} from '../header/logo'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
{/* creamos la funcion y el estado incial del formulario, 
  el campo email y password seran cadenas vacias  */}
function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  {
    /* // Capturamos lo que el usuario escribe en cada input a través de e.target.
// Usando name y value del input, actualizamos solo la propiedad correspondiente
// del estado formData. Los tres puntos (...formData) copian el estado actual
// para no perder los otros campos mientras actualizamos el que cambió.
    */
  }
  const navegar=useNavigate();
  const { login } = useAuth();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const url="http://localhost:8000/api/token/";
    try {
      const peticion= await fetch(url,{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await peticion.json();
      if (peticion.ok){
        localStorage.setItem("accessToken", data.access);
        localStorage.setItem("refreshToken", data.refresh);
        localStorage.setItem("userEmail", formData.email); // Guardar email para fallback

        // Obtener información completa del usuario
        try {
          const userResponse = await fetch('http://localhost:8000/api/users/me/', {
            headers: {
              'Authorization': `Bearer ${data.access}`,
              'Content-Type': 'application/json',
            },
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();
            // Actualizar el contexto de autenticación con datos completos
            login(userData);
          } else {
            // Si no se puede obtener la info del usuario, usar datos básicos
            const basicUserData = {
              id: 1,
              first_name: 'Usuario',
              last_name: 'Autenticado',
              email: formData.email,
              username: formData.email.split('@')[0]
            };
            login(basicUserData);
          }
        } catch (userError) {
          console.error('Error al obtener información del usuario:', userError);
          // Usar datos básicos como fallback
          const basicUserData = {
            id: 1,
            first_name: 'Usuario',
            last_name: 'Autenticado',
            email: formData.email,
            username: formData.email.split('@')[0]
          };
          login(basicUserData);
        }

        alert("Inicio de sesión exitoso 🔥");
        navegar("/");
      }else {
        alert(data.detail || "Email o contraseña incorrectos ❌");
      }
      
      
    } catch (error) {
      console.error(error);
      alert("Error al iniciar sesión ❌");
      
    }
    console.log('Datos del formulario de inicio de sesión:', formData);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <a href="/login">  <LogoForm alt="Logo de la Empresa" 
            className="w-20 h-20 mb-2" /></a>
         
          <h2 className="text-2xl font-bold text-center text-gray-800">Inicia Sesión</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Campo de Correo */}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Campo de Contraseña */}
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;