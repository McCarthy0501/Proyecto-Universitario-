import { useState } from "react";
import { motion } from "framer-motion";
function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return alert("Por favor ingresa tu correo.");
    // Aquí podrías hacer fetch a tu API o servicio de suscripción
    alert(`Gracias por suscribirte con ${email}`);
    setEmail("");
  };

  return (
    <div className="bg-indigo-600 py-12 px-4 md:px-8 rounded-lg text-center text-white ">
      <h2 className="text-2xl md:text-3xl font-bold mb-4">
        Suscríbete a nuestro newsletter
      </h2>
      <p className="mb-6">Recibe un 10% de descuento en tu primera compra</p>
      <form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row justify-center items-center gap-4"
      >
        <input
          type="email"
          placeholder="Ingresa tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full sm:w-auto px-4 py-3 rounded-lg text-white-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 animate-pulse"
        />
        <button
          type="submit"
          className="bg-yellow-400 text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-yellow-500 transition animate-bounce"
        >
          Suscribirse
        </button>
      </form>
    </div>
  );
}

export default Newsletter;
