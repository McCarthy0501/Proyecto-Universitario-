import { useState, useEffect, useCallback, useRef } from "react";

import { API_BASE_URL } from '../../api';

const API_BASE = API_BASE_URL;

export const useProductSearch = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const lastFiltersRef = useRef({});

  const searchProducts = useCallback(async (filters = {}, pageNum = 1) => {
    setLoading(true);
    setError(null);
    lastFiltersRef.current = filters;

    try {
      const params = new URLSearchParams();

      if (filters.query) params.append('q', filters.query);
      if (filters.category) params.append('category', filters.category);
      if (filters.minPrice) params.append('min_price', filters.minPrice);
      if (filters.maxPrice) params.append('max_price', filters.maxPrice);
      if (filters.sort) params.append('sort', filters.sort);
      if (filters.isAvailable !== undefined) params.append('is_available', filters.isAvailable);
      if (filters.minRating) params.append('min_rating', filters.minRating);
      params.append('page', pageNum);

      const url = `${API_BASE}/api/productos/buscar/?${params.toString()}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setProducts(data);
        setTotalCount(data.length);
        setTotalPages(1);
      } else {
        setProducts(data.results || []);
        setTotalCount(data.count || 0);
        setTotalPages(Math.ceil((data.count || 0) / 12));
      }
      setPage(pageNum);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const changePage = useCallback((newPage) => {
    searchProducts(lastFiltersRef.current, newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchProducts]);

  return { products, loading, error, searchProducts, page, totalPages, totalCount, changePage };
};

export const useRelatedProducts = (productId) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchRelated = async () => {
      setLoading(true);

      try {
        const url = `${API_BASE}/api/productos/${productId}/relacionados/`;
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setRelatedProducts(data);
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [productId]);

  return { relatedProducts, loading };
};
