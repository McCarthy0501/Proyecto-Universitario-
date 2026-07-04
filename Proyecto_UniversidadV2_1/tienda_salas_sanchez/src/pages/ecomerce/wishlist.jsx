import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useWishlist } from '../../contexts/WishlistContext';
import ProductCard from '../../components/complementos/productCard';

function WishlistPage() {
  const { wishlistIds, wishlistCount } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (wishlistIds.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/productos/');
        const data = await res.json();
        const results = Array.isArray(data) ? data : data.results || [];
        setProducts(results.filter((p) => wishlistIds.includes(p.id)));
      } catch (err) {
        console.error('Error loading wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [wishlistIds]);

  if (wishlistCount === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Heart size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          No tienes favoritos aún
        </h2>
        <p className="text-gray-500 mb-6">
          Guarda productos que te gusten para verlos después
        </p>
        <Link
          to="/productos"
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Mis Favoritos ({wishlistCount})
      </h1>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-200 rounded-xl h-72" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
