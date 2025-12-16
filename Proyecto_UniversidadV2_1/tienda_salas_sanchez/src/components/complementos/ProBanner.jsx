import React from 'react';

const PromoCard = ({ titulo, subTitulo, ctaTexto, ctaLink, imageUrl }) => {
  return (
    // Contenedor principal: Diseño profesional, hover y el degradado de colores
    <div 
      className="relative overflow-hidden rounded-xl shadow-2xl 
                 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white
                 transition duration-500 ease-in-out transform hover:scale-[1.02]"
      style={{ maxWidth: '400px', minHeight: '350px' }} // Dimensiones para el card
    >
      {/* 1. Imagen de Fondo */}
      <div className="absolute inset-0 z-0"> {/* z-0 para que esté detrás del overlay */}
        <img 
          className="w-full h-full object-cover opacity-60 transition duration-500 hover:opacity-80" // Opacidad ajustada para el degradado
          src={imageUrl} 
          alt={titulo} 
        />
        {/* Capa de Oscurecimiento (Overlay) para asegurar que el texto se lea bien */}
        {/* Menos opacidad ya que el degradado ya le da oscuridad */}
        <div className="absolute inset-0 bg-black opacity-20"></div> 
      </div>

      {/* 2. Contenido de Texto (Alineado en la parte inferior para estilo moderno) */}
      <div className="relative z-10 p-6 flex flex-col justify-end h-full"> {/* z-10 para que el texto esté encima */}
        
        {/* Título Principal */}
        <h3 className="text-3xl font-extrabold tracking-tight mb-1 drop-shadow-lg">
          {titulo}
        </h3>
        
        {/* Subtítulo o Descuento */}
        <p className="text-lg font-medium text-white/90 mb-4 drop-shadow-md">
          {subTitulo}
        </p>

        {/* Botón CTA (Llamada a la Acción) */}
        <a 
          href={ctaLink}
          // El botón usa los colores de tu OfferBanner
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg shadow-md 
                     text-orange-600 bg-white hover:bg-orange-100 transition-colors duration-200 
                     uppercase tracking-wider self-start"
        >
          {ctaTexto}
        </a>
      </div>
    </div>
  );
};

export default PromoCard;