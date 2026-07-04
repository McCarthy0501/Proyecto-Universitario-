import { Link } from 'react-router-dom';
import { useRecentlyViewed } from '../../contexts/RecentlyViewedContext';

function RecentlyViewedSection() {
 const { items } = useRecentlyViewed();

 if (items.length === 0) return null;

 return (
 <div className="py-8">
 <div className="flex items-center justify-between mb-6">
 <h2 className="text-2xl font-bold text-gray-900">
 Vistos Recientemente
 </h2>
 </div>
 <div className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
 {items.map((product) => (
 <Link
 key={product.id}
 to={`/producto/${product.id}`}
 className="min-w-[160px] bg-white rounded-lg shadow-md p-3 hover:shadow-lg transition-shadow flex-shrink-0"
 >
 <img
 src={product.images}
 alt={product.product_name}
 loading="lazy"
 className="w-full h-32 object-cover rounded mb-2"
 />
 <p className="text-sm font-medium text-gray-900 truncate">
 {product.product_name}
 </p>
 <p className="text-sm font-semibold text-indigo-600">
 ${product.price}
 </p>
 </Link>
 ))}
 </div>
 </div>
 );
}

export default RecentlyViewedSection;
