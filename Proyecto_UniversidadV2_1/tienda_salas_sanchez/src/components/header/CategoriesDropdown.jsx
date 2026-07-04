import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Grid3X3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api';

function CategoriesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/categorias/`);
        if (res.ok) {
          const data = await res.json();
          setCategories(data.results || data || []);
        }
      } catch {}
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCategoryClick = (categoryId) => {
    setIsOpen(false);
    navigate(`/categoriasPorProductos/${categoryId}`);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-gray-300 hover:text-white transition-colors"
      >
        <Grid3X3 className="w-5 h-5" />
        <span className="hidden md:inline text-sm">Categorias</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && categories.length > 0 && (
        <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.id)}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
              >
                {cat.category_name || cat.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setIsOpen(false); navigate('/categorias'); }}
            className="w-full text-center text-sm text-blue-600 py-2 border-t hover:bg-gray-50"
          >
            Ver todas las categorias
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoriesDropdown;
