import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ROUTE_LABELS = {
 'productos': 'Productos',
 'categorias': 'Categorías',
 'cart': 'Carrito',
 'search': 'Búsqueda',
 'micuenta': 'Mi Cuenta',
 'mis-pedidos': 'Mis Pedidos',
 'wishlist': 'Favoritos',
 'login': 'Iniciar Sesión',
 'register': 'Registro',
};

function Breadcrumb({ currentLabel, items }) {
 const { pathname } = useLocation();

 if (items) {
 return (
 <nav className="flex items-center gap-1.5 text-sm text-gray-500 py-3">
 {items.map((item, i) => (
 <span key={i} className="flex items-center gap-1.5">
 {i > 0 && <ChevronRight size={14} />}
 {item.to ? (
 <Link to={item.to} className="hover:text-indigo-600 transition-colors">
 {item.label}
 </Link>
 ) : (
 <span className="text-gray-900 font-medium">{item.label}</span>
 )}
 </span>
 ))}
 {currentLabel && (
 <>
 <ChevronRight size={14} />
 <span className="text-gray-900 font-medium truncate max-w-[200px]">
 {currentLabel}
 </span>
 </>
 )}
 </nav>
 );
 }

 const segments = pathname.split('/').filter(Boolean);
 const builtItems = [{ label: 'Inicio', to: '/' }];

 segments.forEach((seg, i) => {
 const isLast = i === segments.length - 1;
 const to = '/' + segments.slice(0, i + 1).join('/');
 const label = ROUTE_LABELS[seg] || seg.replace(/-/g, ' ');

 builtItems.push({
 label: isLast && currentLabel ? currentLabel : label,
 to: isLast ? null : to,
 });
 });

 return (
 <nav className="flex items-center gap-1.5 text-sm text-gray-500 py-3 flex-wrap">
 {builtItems.map((item, i) => (
 <span key={i} className="flex items-center gap-1.5">
 {i > 0 && <ChevronRight size={14} />}
 {item.to ? (
 <Link to={item.to} className="hover:text-indigo-600 transition-colors">
 {item.label}
 </Link>
 ) : (
 <span className="text-gray-900 font-medium">{item.label}</span>
 )}
 </span>
 ))}
 </nav>
 );
}

export default Breadcrumb;
