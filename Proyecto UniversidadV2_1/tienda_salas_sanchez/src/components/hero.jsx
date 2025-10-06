import { useNavigate } from "react-router-dom"; //hook que te da una función para cambiar de ruta programáticamente dentro de tu aplicación React.

function Hero () {
  const navegacion=useNavigate(); // llamamos la funcion
  const hacerClick=()=>(
    navegacion('/productos')
  );// creamos una varianle  que contenga una funcion flecha que contendra la ruta a redirigir
  return (
    <div
      className="bg-cover bg-center h-96 flex items-center justify-center text-white"
      style={{
        backgroundImage:
          "url('https://source.unsplash.com/random/1200x800?tech')",
      }}
    >
      <div className="text-center bg-black bg-opacity-50 p-6 rounded-lg">
        <h1 className="text-5xl font-bold">
          Bienvenido a tu Distribuidora de Confianza
        </h1>
        <p className="mt-4 text-xl">
          Encuentra los productos que siempre has querido.
        </p>
        <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
          onClick={hacerClick} //llamamos la funcion creada con ele vento onClick
        >
          Comprar Ahora
          
        </button>
   
      </div>
    </div>
  );
};

export default Hero;