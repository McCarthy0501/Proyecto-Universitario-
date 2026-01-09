import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Edit, Trash2, Eye, Download, Filter, X, Plus, AlertTriangle, Package, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function TableProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [stockFilter, setStockFilter] = useState("all"); // all, low, out, in
    const [priceSort, setPriceSort] = useState("none"); // none, asc, desc
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      fetchProducts();
      fetchCategories();
    }, []);

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = "http://localhost:8000/api/productos";
        const peti = await fetch(url);
        const data = await peti.json();
        setProducts(data);
      } catch (e) {
        console.log("error en los datos", e);
        alert("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const url = "http://localhost:8000/api/categorias";
        const response = await fetch(url);
        const data = await response.json();
        setCategories(data);
      } catch (e) {
        console.log("error al cargar categorías", e);
      }
    };
    // Funciones de filtrado y búsqueda
    const filteredProducts = useMemo(() => {
      let filtered = [...products];

      // Búsqueda por texto
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        filtered = filtered.filter(p => 
          p.product_name?.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search) ||
          p.slug?.toLowerCase().includes(search)
        );
      }

      // Filtro por categoría
      if (selectedCategory) {
        filtered = filtered.filter(p => 
          p.category === parseInt(selectedCategory) || 
          p.category?.id === parseInt(selectedCategory)
        );
      }

      // Filtro por stock
      if (stockFilter === "low") {
        filtered = filtered.filter(p => p.stock <= 5 && p.stock > 0);
      } else if (stockFilter === "out") {
        filtered = filtered.filter(p => p.stock === 0);
      } else if (stockFilter === "in") {
        filtered = filtered.filter(p => p.stock > 5);
      }

      // Ordenamiento por precio
      if (priceSort === "asc") {
        filtered.sort((a, b) => a.price - b.price);
      } else if (priceSort === "desc") {
        filtered.sort((a, b) => b.price - a.price);
      }

      return filtered;
    }, [products, searchTerm, selectedCategory, stockFilter, priceSort]);

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    // Estadísticas
    const stats = useMemo(() => {
      const total = products.length;
      const lowStock = products.filter(p => p.stock <= 5 && p.stock > 0).length;
      const outOfStock = products.filter(p => p.stock === 0).length;
      const inStock = products.filter(p => p.stock > 5).length;
      const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
      const averagePrice = total > 0 ? products.reduce((sum, p) => sum + p.price, 0) / total : 0;

      return { total, lowStock, outOfStock, inStock, totalValue, averagePrice };
    }, [products]);

    // Funciones de acciones
    const handleDelete = async (productId) => {
      try {
        const token = localStorage.getItem('accessToken') || '';
        const response = await fetch(`http://localhost:8000/api/productos/${productId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json',
          },
        });

        if (response.ok || response.status === 204) {
          alert('Producto eliminado exitosamente');
          fetchProducts();
          setShowDeleteModal(false);
          setProductToDelete(null);
        } else {
          alert('Error al eliminar el producto');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el producto');
      }
    };

    const handleEdit = (productId) => {
      navigate(`/admin/editproduct/${productId}`);
    };

    const handleView = (product) => {
      // Mostrar vista rápida del producto
      alert(`Producto: ${product.product_name}\nPrecio: $${product.price}\nStock: ${product.stock}\nDescripción: ${product.description?.substring(0, 100)}...`);
    };

    const handleExport = () => {
      const csvContent = [
        ['ID', 'Nombre', 'Precio', 'Stock', 'Categoría', 'Disponible', 'Fecha Creación'].join(','),
        ...filteredProducts.map(p => [
          p.id,
          p.product_name,
          p.price,
          p.stock,
          p.category?.category_name || 'Sin categoría',
          p.is_available ? 'Sí' : 'No',
          new Date(p.created_date).toLocaleDateString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `productos_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
    };

    const handleClearFilters = () => {
      setSearchTerm("");
      setSelectedCategory("");
      setStockFilter("all");
      setPriceSort("none");
      setCurrentPage(1);
    };

    if (loading) {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

  return (
    <div className="space-y-6">
      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">En Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inStock}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Stock Bajo</p>
              <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Sin Stock</p>
              <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filtro por categoría */}
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.category_name}</option>
            ))}
          </select>

          {/* Filtro por stock */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los stocks</option>
            <option value="in">En stock (>5)</option>
            <option value="low">Stock bajo (≤5)</option>
            <option value="out">Sin stock</option>
          </select>

          {/* Ordenamiento por precio */}
          <select
            value={priceSort}
            onChange={(e) => {
              setPriceSort(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="none">Ordenar por precio</option>
            <option value="asc">Precio: Menor a Mayor</option>
            <option value="desc">Precio: Mayor a Menor</option>
          </select>

          {/* Botones de acción */}
          <div className="flex gap-2">
            {(searchTerm || selectedCategory || stockFilter !== "all" || priceSort !== "none") && (
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors flex items-center"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </button>
            )}
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center"
            >
              <Download className="w-4 h-4 mr-1" />
              Exportar
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>Mostrando {currentProducts.length} de {filteredProducts.length} productos</p>
          <p>Valor total del inventario: <span className="font-bold text-green-600">${stats.totalValue.toFixed(2)}</span></p>
        </div>
      </div>

      {/* Tabla de productos */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Imagen</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-center">Precio</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Creado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      {product.images ? (
                        <img
                          src={product.images}
                          alt={product.product_name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-gray-900">{product.product_name}</p>
                        <p className="text-xs text-gray-500">{product.slug}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {product.category?.category_name || 'Sin categoría'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold text-green-600">${product.price}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.stock === 0 ? (
                        <div>
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {product.stock}
                          </span>
                          <p className="text-xs text-red-500 mt-1">¡Agotado!</p>
                        </div>
                      ) : product.stock <= 5 ? (
                        <div>
                          <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {product.stock}
                          </span>
                          <p className="text-xs text-orange-500 mt-1">¡Casi Agotado!</p>
                        </div>
                      ) : (
                        <div>
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            {product.stock}
                          </span>
                          <p className="text-xs text-green-700 mt-1">Disponible</p>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {product.is_available ? (
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Activo
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-600">
                      {product.created_date ? new Date(product.created_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button
                          type="button"
                          onClick={() => handleView(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleEdit(product.id)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-500">No se encontraron productos</p>
                      {searchTerm && (
                        <button
                          onClick={handleClearFilters}
                          className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Limpiar filtros
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Siguiente
              </button>
            </div>
            <span className="text-sm text-gray-600">
              {itemsPerPage} por página
            </span>
          </div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && productToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Confirmar Eliminación</h3>
                <p className="text-sm text-gray-600">Esta acción no se puede deshacer</p>
              </div>
            </div>
            <p className="mb-4 text-gray-700">
              ¿Estás seguro de que deseas eliminar el producto <strong>{productToDelete.product_name}</strong>?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(productToDelete.id)}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
