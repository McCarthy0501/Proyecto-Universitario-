import  { useState,useEffect } from 'react';
import { LogoForm } from '../logo';
import { useNavigate } from "react-router-dom";

function FormAdmin() {
    const [data, setData] = useState({ email: "", password: ""});
    const [error, setError] = useState("");
    const navegate=useNavigate(); //esto es para que nos permita redirigirnos
   
    const capturarDatos=(e)=>{
        const {name,value}=e.target;
        setData({...data,[name]:value});


    }
   
    const peticion= async (e)=>{
        e.preventDefault();
        setError("");
        const url ="http://localhost:8000/api/admin/login/"
        try {
          const solicitud = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          if (!solicitud.ok){
            throw new Error("Credenciales inválidas o error en el servidor");
          }
           const result = await solicitud.json();  
            console.log("Respuesta del backend:", result);

            localStorage.setItem("user",JSON.stringify(result.user));
            alert("bienvenido Administrador")//guardamos los datos de la respuesta 
            console.log(result.user)
            navegate("/adminPanel");// si todo es correcto nos redirije al panel de administrador
            
          
        } catch (e) {
           console.error("Error en la petición:", e);
           setError("Error al iniciar sesión. Verifica tus datos.");
          
        }


        
        
       

        console.log('Datos del formulario de inicio de sesión:', data);

    }

    return(
        <>
        <div className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col items-center mb-6">
          <a href="/login">  <LogoForm alt="Logo de la Empresa" 
            className="w-20 h-20 mb-2" /></a>
         
          <h2 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión Administrativa</h2>
        </div>

        <form className="space-y-4" onSubmit={peticion}>
          {/* Campo de Correo */}
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={data.email}
            onChange={capturarDatos}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Campo de Contraseña */}
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
            className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
        </>
    )
    
}
export default FormAdmin