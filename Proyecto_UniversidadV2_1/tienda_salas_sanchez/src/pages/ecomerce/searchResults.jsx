import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, DollarSign, Package, Star } from 'lucide-react';
import ProductCard from '../../components/complementos/productCard';
import Pagination from '../../components/complementos/Pagination';
import Breadcrumb from '../../components/complementos/Breadcrumb';
import { useProductSearch } from '../../Hooks/main/useProductSearch';
import { useCategorys } from '../../Hooks/main/useCategorys';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

  const { products, loading, searchProducts, page, totalPages, totalCount, changePage } = useProductSearch();
  const { categoriasOrdenadas } = useCategorys();

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    minRating: '',
    sort: '-created_date',
  });
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const doSearch = useCallback((currentFilters, pageNum = 1) => {
    searchProducts({
      query: query,
      category: currentFilters.category || undefined,
      minPrice: currentFilters.minPrice || undefined,
      maxPrice: currentFilters.maxPrice || undefined,
      sort: currentFilters.sort,
      isAvailable: currentFilters.inStock || undefined,
      minRating: currentFilters.minRating || undefined,
    }, pageNum);
  }, [query, searchProducts]);

  useEffect(() => {
    doSearch(filtersRef.current, 1);
  }, [query, doSearch]);

  const handleFilterChange = (name, value) => {
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    doSearch(newFilters, 1);
  };

  const handleClearFilters = () => {
    const cleared = {
      category: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      minRating: '',
      sort: '-created_date',
    };
    setFilters(cleared);
    doSearch(cleared, 1);
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.inStock || filters.minRating;

  const handlePageChange = (newPage) => {
    changePage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <Breadcrumb
          items={[
            { label: 'Inicio', to: '/' },
            { label: 'Búsqueda' },
          ]}
          currentLabel={query || 'Todos los productos'}
        />

        {/* Header de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `Resultados para: "${query}"` : 'Búsqueda de Productos'}
              </h1>
              <p className="text-gray-600 mt-1">
                {totalCount} {totalCount === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              <span>Filtros</span>
            </button>
          </div>

          {/* Barra de búsqueda */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              const searchQuery = formData.get('search');
              if (searchQuery) {
                navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
            className="flex items-center space-x-2"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="search"
                defaultValue={query}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Buscar
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Panel de filtros */}
          {showFilters && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filtros Avanzados
                  </h2>
                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Limpiar
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  {/* Filtro por categoría */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoría
                    </label>
                    <select
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todas las categorías</option>
                      {categoriasOrdenadas.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro por precio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Rango de Precio
                    </label>
                    <div className="space-y-2">
                      <input
                        type="number"
                        placeholder="Precio mínimo"
                        value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                      <input
                        type="number"
                        placeholder="Precio máximo"
                        value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>

                  {/* Filtro por stock */}
                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.inStock}
                        onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <Package className="w-4 h-4 mr-1" />
                        Solo productos disponibles
                      </span>
                    </label>
                  </div>

                  {/* Filtro por rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Valoración Mínima
                    </label>
                    <select
                      value={filters.minRating}
                      onChange={(e) => handleFilterChange('minRating', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todas las valoraciones</option>
                      <option value="4">4 estrellas o más</option>
                      <option value="3">3 estrellas o más</option>
                      <option value="2">2 estrellas o más</option>
                      <option value="1">1 estrella o más</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Resultados de búsqueda */}
          <div className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Search className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Producto no encontrado
                </h2>
                <p className="text-gray-600 mb-6">
                  {query
                    ? `No se encontraron productos que coincidan con "${query}"`
                    : 'No se encontraron productos con los filtros seleccionados'
                  }
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => {
                      handleClearFilters();
                      navigate('/search');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Limpiar Búsqueda
                  </button>
                  <button
                    onClick={() => navigate('/productos')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors"
                  >
                    Ver Todos los Productos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;
