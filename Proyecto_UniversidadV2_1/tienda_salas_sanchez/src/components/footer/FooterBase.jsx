import { Globe, AtSign, Camera, ExternalLink } from 'lucide-react';

function FooterBase() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <h3 className="text-xl font-bold text-white mb-4">
            <span className="text-indigo-500">Salas</span>Sanchez1629
          </h3>
          <p className="text-sm">
            Ofrecemos los mejores productos con una calidad inigualable. Explora nuestro catalogo y encuentra lo que necesitas para tu dia a dia.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Empresa</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-500 transition duration-300">Acerca de nosotros</a></li>
            <li><a href="#" className="hover:text-indigo-500 transition duration-300">Contactanos</a></li>
            <li><a href="#" className="hover:text-indigo-500 transition duration-300">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Soporte</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-500 transition duration-300">Preguntas frecuentes</a></li>
            <li><a href="#" className="hover:text-indigo-500 transition duration-300">Devoluciones</a></li>
            <li><a href="#" className="hover:text-indigo-500 transition duration-300">Politica de privacidad</a></li>
          </ul>
        </div>
      </div>

      <hr className="my-8 border-gray-700" />

      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} Ings.Casique Reymon Salas Esteban Cardenas Elias Prato Dylan. Todos los derechos reservados.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-indigo-500 transition duration-300"><Globe size={20} /></a>
          <a href="#" className="hover:text-indigo-500 transition duration-300"><AtSign size={20} /></a>
          <a href="#" className="hover:text-indigo-500 transition duration-300"><Camera size={20} /></a>
          <a href="#" className="hover:text-indigo-500 transition duration-300"><ExternalLink size={20} /></a>
        </div>
      </div>
    </footer>
  );
}

export default FooterBase;
