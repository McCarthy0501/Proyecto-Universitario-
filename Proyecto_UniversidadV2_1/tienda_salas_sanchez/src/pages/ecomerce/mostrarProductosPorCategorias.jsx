import ProductCard from "../../components/complementos/productCard";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumb from "../../components/complementos/Breadcrumb";
import { useCategorys } from "../../Hooks/main/useCategorys";
import { API_BASE_URL } from "../../api";

export default function MostrarProductosPorCategorias() {
 const { id } = useParams();
 const [productos, setProductos] = useState([]);
 const [cargando, setCargando] = useState(true);
 const [error, setError] = useState(null);
 const { categoriasOrdenadas } = useCategorys();

 const categoryName = useMemo(() => {
 const found = categoriasOrdenadas.find(c => c.id === parseInt(id));
 return found ? found.category_name : `Categoría ${id}`;
 }, [categoriasOrdenadas, id]);

 useEffect(() => {
 setCargando(true);
 setError(null);
 setProductos([]);
 const peticionApiProductosPorCategorias = async () => {
 try {
 const url = `${API_BASE_URL}/api/productosPorCategorias/${id}/`;
 const peticion = await fetch(url);

 if (!peticion.ok) {
 throw new Error(`Error HTTP: ${peticion.status}`);
 }
 const data = await peticion.json();

 if (Array.isArray(data)) {
 setProductos(data);
 } else {
 setProductos(data.results || []);
 }
 } catch (error) {
 console.error(error);
 setError(error.message);
 } finally {
 setCargando(false);
 }
 };
 if (id) {
 peticionApiProductosPorCategorias();
 } else {
 setCargando(false);
 }
 }, [id]);

 if (cargando) {
 return <p className="text-gray-700 text-lg font-semibold animate-pulse">Cargando Productos...</p>;
 }

 if (error) {
 return <p className="text-red-500 text-lg">Error: {error}</p>;
 }

 const animacion = {
 primera: { opacity: 0, x: -50 },
 segunda: { opacity: 1, x: 0 }
 };

 return (
 <>
 <Breadcrumb
 items={[
 { label: 'Inicio', to: '/' },
 { label: 'Categorías', to: '/categorias' },
 ]}
 currentLabel={categoryName}
 />
 <motion.div
 variants={animacion}
 initial="primera"
 whileInView="segunda"
 transition={{ duration: 0.9, ease: "easeInOut" }}
 >
 {productos.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
 {productos.map((producto) => (
 <ProductCard key={producto.id} product={producto} />
 ))}
 </div>
 ) : (
 <p className="text-gray-700 text-lg font-semibold animate-pulse">Cargando los Productos de su categoria...</p>
 )}
 </motion.div>
 </>
 );
}
