import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "../../api";

export const useProducts = (page = 1, filters = {}) => {
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('page_size', 12);

    if (filters.search) params.append('search', filters.search);
    if (filters.category) params.append('category', filters.category);
    if (filters.minPrice) params.append('min_price', filters.minPrice);
    if (filters.maxPrice) params.append('max_price', filters.maxPrice);
    if (filters.sort) params.append('ordering', filters.sort);
    if (filters.isAvailable !== undefined) params.append('is_available', filters.isAvailable);

    return `${API_BASE_URL}/api/productos/?${params.toString()}`;
  }, [page, filters]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = buildUrl();
        const response = await fetch(url);
        const data = await response.json();

        if (data.results) {
          setProducts(data.results);
          setTotalPages(Math.ceil(data.count / 12) || 1);
          setTotalProducts(data.count);
        } else {
          setProducts(data);
          setTotalPages(1);
          setTotalProducts(data.length);
        }
      } catch (e) {
        console.log("error en los datos", e);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [buildUrl]);

  return {
    products,
    loading,
    totalPages,
    totalProducts,
  };
};
