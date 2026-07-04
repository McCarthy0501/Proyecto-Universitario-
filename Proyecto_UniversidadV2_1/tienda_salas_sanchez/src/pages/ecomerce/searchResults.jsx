<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, DollarSign, Package, Star } from 'lucide-react';
import ProductCard from '../../components/complementos/productCard';
=======
import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, DollarSign, Package, Star } from 'lucide-react';
import ProductCard from '../../components/complementos/productCard';
import Pagination from '../../components/complementos/Pagination';
import Breadcrumb from '../../components/complementos/Breadcrumb';
import { useProductSearch } from '../../Hooks/main/useProductSearch';
>>>>>>> desarrollo
import { useCategorys } from '../../Hooks/main/useCategorys';
import { API_BASE_URL } from '../../api';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';

<<<<<<< HEAD
  const { categoriasOrdenadas } = useCategorys();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
=======
  const { products, loading, searchProducts, page, totalPages, totalCount, changePage } = useProductSearch();
  const { categoriasOrdenadas } = useCategorys();

>>>>>>> desarrollo
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
<<<<<<< HEAD
    sort: '',
    isAvailable: undefined,
=======
    inStock: false,
    minRating: '',
    sort: '-created_date',
>>>>>>> desarrollo
  });
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

<<<<<<< HEAD
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.isAvailable !== undefined) params.append('is_available', filters.isAvailable);

      try {
        const url = `${API_BASE_URL}/api/productos/buscar/?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Error ${res.status}`);
        const data = await res.json();
        setResults(Array.isArray(data) ? data : (data.results || []));
        setError(null);
      } catch (e) {
        console.error('Error en busqueda:', e);
        setError(e.message);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query, filters]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', sort: '', isAvailable: undefined });
=======
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
>>>>>>> desarrollo
  };

  const hasActiveFilters = filters.category || filters.minPrice || filters.maxPrice || filters.sort || filters.isAvailable !== undefined;

  const handlePageChange = (newPage) => {
    changePage(newPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<<<<<<< HEAD
=======

        <Breadcrumb
          items={[
            { label: 'Inicio', to: '/' },
            { label: 'Búsqueda' },
          ]}
          currentLabel={query || 'Todos los productos'}
        />

        {/* Header de búsqueda */}
>>>>>>> desarrollo
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {query ? `Resultados para: "${query}"` : 'Busqueda de Productos'}
              </h1>
              <p className="text-gray-600 mt-1">
<<<<<<< HEAD
                {results.length} {results.length === 1 ? 'producto encontrado' : 'productos encontrados'}
=======
                {totalCount} {totalCount === 1 ? 'producto encontrado' : 'productos encontrados'}
>>>>>>> desarrollo
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

<<<<<<< HEAD
=======
          {/* Barra de búsqueda */}
>>>>>>> desarrollo
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
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
              Buscar
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {showFilters && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filtros
                  </h2>
                  {hasActiveFilters && (
<<<<<<< HEAD
                    <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-800">Limpiar</button>
=======
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Limpiar
                    </button>
>>>>>>> desarrollo
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                    <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="">Todas las categorias</option>
                      {categoriasOrdenadas?.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.category_name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" /> Rango de Precio
                    </label>
                    <div className="space-y-2">
                      <input type="number" placeholder="Precio minimo" value={filters.minPrice}
                        onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" />
                      <input type="number" placeholder="Precio maximo" value={filters.maxPrice}
                        onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" min="0" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar</label>
                    <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="-created_date">Mas recientes</option>
                      <option value="price_asc">Precio: menor a mayor</option>
                      <option value="price_desc">Precio: mayor a menor</option>
                      <option value="name">Nombre A-Z</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" checked={filters.isAvailable === true}
                        onChange={(e) => handleFilterChange('isAvailable', e.target.checked ? true : undefined)}
                        className="w-4 h-4 text-blue-600 rounded" />
                      <span className="text-sm font-medium text-gray-700 flex items-center">
                        <Package className="w-4 h-4 mr-1" /> Solo disponibles
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

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
<<<<<<< HEAD
                ))}
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Search className="w-24 h-24 text-red-400 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Error en la busqueda</h2>
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={() => window.location.reload()}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                  Reintentar
                </button>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map(product => (
                  <ProductCard key={product.id} product={product} />
=======
>>>>>>> desarrollo
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
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Sin resultados</h2>
                <p className="text-gray-600 mb-6">
<<<<<<< HEAD
                  {query ? `No se encontraron productos para "${query}"` : 'No se encontraron productos con los filtros seleccionados'}
                </p>
                <div className="space-x-4">
                  <button onClick={() => { clearFilters(); navigate('/search'); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                    Limpiar Busqueda
=======
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
>>>>>>> desarrollo
                  </button>
                  <button onClick={() => navigate('/productos')}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors">
                    Ver Catalogo
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
