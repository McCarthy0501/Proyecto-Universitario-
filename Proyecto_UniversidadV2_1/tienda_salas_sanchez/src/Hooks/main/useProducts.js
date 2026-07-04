<<<<<<< HEAD
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
=======
import { useState, useEffect, useMemo } from "react";

const API_BASE = 'http://localhost:8000';

export const useProducts = () => {
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('-created_date');

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `${API_BASE}/api/productos/?page=${page}&sort=${sort}`;
        const peti = await fetch(url);
        const json = await peti.json();
        if (!cancelled) {
          if (Array.isArray(json)) {
            setData({ results: json, count: json.length });
          } else {
            setData(json);
          }
        }
      } catch (e) {
        if (!cancelled) {
          console.log("error en los datos", e);
          setError(e.message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => { cancelled = true; };
  }, [page, sort]);

  const products = data.results || [];
  const totalCount = data.count || products.length;
  const totalPages = Math.ceil(totalCount / 12) || 1;

  const productosOrdenados = useMemo(() => {
    const copiaProductos = [...products];
    return copiaProductos.sort((a, b) => {
      const producto_A = a.product_name.toUpperCase();
      const producto_B = b.product_name.toUpperCase();
      if (producto_A < producto_B) return -1;
      else if (producto_A > producto_B) return 1;
      return 0;
    });
  }, [products]);

  return {
    product: products,
    productosOrdenados,
    loading,
    error,
    page,
    totalPages,
    totalCount,
    setPage,
    sort,
    setSort,
>>>>>>> desarrollo
  };
};
