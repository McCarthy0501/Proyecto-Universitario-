import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock } from 'lucide-react';
import { API_BASE_URL } from '../../api';

const SEARCH_HISTORY_KEY = 'search_history';
const MAX_HISTORY = 5;

function getHistory() {
  try { return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || []; }
  catch { return []; }
}

function addToHistory(term) {
  const history = getHistory().filter(h => h !== term);
  history.unshift(term);
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)));
}

function clearHistory() {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
}

function BarraBusqueda() {
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const debounceRef = useRef(null);

    const refreshHistory = () => setHistory(getHistory());

    useEffect(() => { refreshHistory(); }, []);

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
                    `${API_BASE_URL}/api/productos/buscar/?q=${encodeURIComponent(searchTerm)}&page_size=5`
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
            addToHistory(searchTerm.trim());
            refreshHistory();
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    const handleSelect = (product) => {
        setShowDropdown(false);
        setSearchTerm('');
        navigate(`/producto/${product.id}`);
    };

    const handleHistoryClick = (term) => {
        setShowDropdown(false);
        setSearchTerm('');
        navigate(`/search?q=${encodeURIComponent(term)}`);
    };

    const handleClear = () => {
        setSearchTerm('');
        setSuggestions([]);
        setShowDropdown(false);
    };

    const showHistorial = !searchTerm && history.length > 0;

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
                onFocus={() => {
                  refreshHistory();
                  if (suggestions.length > 0) setShowDropdown(true);
                  else if (!searchTerm) setShowDropdown(history.length > 0);
                }}
                onKeyDown={(e) => e.key === 'Escape' && setShowDropdown(false)}
                placeholder="Buscar productos..."
                className="w-full pl-10 pr-10 py-2 rounded-lg text-gray-900 bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Buscar productos"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Limpiar busqueda"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="ml-2 bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center"
              aria-label="Buscar"
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
                  <img loading="lazy" src={p.images} alt="" className="w-10 h-10 rounded object-cover" />
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

          {showHistorial && showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50">
              <div className="px-3 py-2 flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Busquedas recientes</span>
                <button onClick={() => { clearHistory(); refreshHistory(); setShowDropdown(false); }} className="text-blue-600 hover:underline">Limpiar</button>
              </div>
              {history.map((term, i) => (
                <button
                  key={i}
                  onClick={() => handleHistoryClick(term)}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-left text-sm text-gray-700"
                >
                  <Clock className="w-3 h-3 text-gray-400" />
                  {term}
                </button>
              ))}
            </div>
          )}
        </div>
      </>
    );
}

export default BarraBusqueda;
