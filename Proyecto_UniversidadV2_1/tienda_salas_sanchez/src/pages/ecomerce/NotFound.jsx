import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-8xl font-bold text-gray-300 mb-4">404</div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Pagina no encontrada</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Lo sentimos, la pagina que buscas no existe o fue movida.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5" />
          Inicio
        </Link>
        <Link
          to="/productos"
          className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors"
        >
          <Search className="w-5 h-5" />
          Ver productos
        </Link>
      </div>
    </div>
  );
}
