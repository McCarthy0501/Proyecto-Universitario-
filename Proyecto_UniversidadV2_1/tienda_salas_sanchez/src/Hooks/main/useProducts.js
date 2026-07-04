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
  };
};
