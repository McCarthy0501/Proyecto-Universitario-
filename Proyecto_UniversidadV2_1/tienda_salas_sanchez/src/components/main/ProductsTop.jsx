import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, TrendingUp, Star, Package } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../../api';
import PriceDisplay from '../complementos/PriceDisplay';

const TopSellingProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/productos/top/`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Error al cargar productos top:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesion para agregar productos al carrito');
      navigate('/login');
      return;
    }
    addToCart(product, 1);
    toast.success(`${product.product_name} agregado al carrito`);
  };

  const handleProductClick = (product) => {
    navigate(`/producto/${product.id}`);
  };

  const renderStars = (rating) => (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          fill={star <= Math.round(rating || 0) ? "#fbbf24" : "transparent"}
          stroke={star <= Math.round(rating || 0) ? "#fbbf24" : "#d1d5db"}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full text-center py-10">
      <div className="flex items-center justify-center mb-10">
        <TrendingUp className="w-8 h-8 text-indigo-600 mr-3"/>
        <h2 className="text-4xl font-extrabold text-gray-900">
          Productos Mas Vendidos
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div className="relative w-full h-48 md:h-64 overflow-hidden">
                <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                  Lo Mas Vendido
                </span>
                {product.images ? (
                  <img
                    src={product.images}
                    alt={product.product_name}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="p-4 md:p-6 text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">
                  {product.product_name}
                </h3>
                {product.total_sold && (
                  <p className="text-xs text-gray-500 mb-2">{product.total_sold} vendidos</p>
                )}
                <div className="flex justify-between items-center mt-4">
                  <PriceDisplay priceUsd={product.price} />
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={!product.is_available || product.stock <= 0}
                    className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label={`Agregar ${product.product_name} al carrito`}
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No hay productos vendidos aun. Los mas populares apareceran aqui.</p>
          <button
            onClick={() => navigate('/productos')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Ver catalogo
          </button>
        </div>
      )}

      <button
        className="mt-12 px-10 py-3 bg-gray-200 text-gray-800 font-bold text-lg rounded-lg hover:bg-gray-300 transition-colors shadow-md"
        onClick={() => navigate('/productos')}
      >
        Ver Todos los Productos
      </button>
    </div>
  );
};

export default TopSellingProducts;
