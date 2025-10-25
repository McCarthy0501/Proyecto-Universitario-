import React from 'react';
import { Award, Zap } from 'lucide-react'; // Cambiamos 'Leaf' por 'Zap' (rapidez)

const BrandStatement = () => {
  return (
    // Contenedor principal: se mantiene el estilo limpio y neutro
    <div className="w-11/12 mx-auto mt-10 p-8 bg-gray-50 border-t border-b border-gray-200 rounded-lg shadow-sm">
      
      <div className="text-center max-w-4xl mx-auto">
        
        {/* TÍTULO H2: Enfocado en la conveniencia y la variedad de categorías */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
          SalasSanchez1629  Tu Distribuidor Centralizado de Productos Esenciales y Más
        </h2>
        
        {/* Párrafo 1: Enfoque en la Variedad (Mencionando tus rubros clave para SEO) */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Te facilitamos la vida. En SalasSanchez1629, consolidamos las mejores marcas y productos de múltiples rubros esenciales en un solo lugar. Ya sea que busques artículos de farmacia y hogar, insumos de papelería o productos para tus mascotas, nuestra plataforma te ofrece la variedad que necesitas sin tener que ir a varias tiendas.
        </p>

        {/* Párrafo 2: Enfoque en Logística, Rapidez y Confianza (El valor clave del distribuidor) */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Nos especializamos en la distribución ágil. Nuestro compromiso es la rapidez y la seguridad en cada entrega. Garantizamos productos originales y un despacho inmediato para que recibas todo lo que necesitas en tiempo récord. Somos tu aliado de confianza para tener a mano lo esencial con la mayor comodidad.
        </p>
        
        {/* Bloque de Valores (Ajustando los iconos a los valores de Distribución Rápida y Variedad) */}
        <div className="flex justify-center gap-8 mt-6">
            <div className="flex items-center text-blue-700 font-semibold">
                <Award className="w-5 h-5 mr-2"/>
                Variedad Garantizada en un Solo Lugar
            </div>
            <div className="flex items-center text-green-700 font-semibold">
                <Zap className="w-5 h-5 mr-2"/> {/* Usamos ZAP para velocidad */}
                Despacho Rápido y Seguro
            </div>
        </div>
      </div>
    </div>
  );
};

export default BrandStatement;