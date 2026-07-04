import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

function BarraBusqueda() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (searchTerm.length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        debounceRef.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `http://localhost:8000/api/productos/buscar/?q=${encodeURIComponent(searchTerm)}&page_size=5`
                );
                const data = await res.json();
                const results = data.results?.slice(0, 5) || [];
                setSuggestions(results);
                setShowDropdown(results.length > 0);
            } catch {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(debounceRef.current);
    }, [searchTerm]);

    useEffect(() => {
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDropdown(false);
        if (searchTerm.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    const handleSelect = (product) => {
        setShowDropdown(false);
        setSearchTerm('');
        navigate(`/producto/${product.id}`);
    };

    const handleClear = () => {
        setSearchTerm('');
        setSuggestions([]);
        setShowDropdown(false);
    };

    return (
      <>
        <div ref={containerRef} className="w-full md:flex-grow md:mx-4 relative">
          <form onSubmit={handleSubmit} className="flex items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                onKeyDown={(e) => e.key === 'Escape' && setShowDropdown(false)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-10 py-2 rounded-lg text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {showDropdown && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-gray-50 text-left"
                >
                  <img src={p.images} alt="" className="w-10 h-10 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{p.product_name}</p>
                    <p className="text-xs text-indigo-600 font-medium">${p.price}</p>
                  </div>
                </button>
              ))}
              <button
                onClick={handleSubmit}
                className="w-full text-center text-sm text-blue-600 py-2 border-t hover:bg-gray-50"
              >
                Ver todos los resultados
              </button>
            </div>
          )}
        </div>
      </>
    );
}

export default BarraBusqueda;
