import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { Package, MapPin, Clock, CheckCircle, XCircle, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../api";

function MisPedidos() {
 const { token, isAuthenticated } = useAuth();
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState(null);

 useEffect(() => {
 fetchOrders();
 }, []);

 const fetchOrders = async () => {
 try {
 const response = await fetch(`${API_BASE_URL}/api/orders/my-orders/`, {
 headers: {
 'Authorization': `Bearer ${token}`,
 'Content-Type': 'application/json',
 },
 });

 if (!response.ok) {
 throw new Error('Error al cargar pedidos');
 }

 const data = await response.json();
 setOrders(data.orders || []);
 } catch (err) {
 setError(err.message);
 } finally {
 setLoading(false);
 }
 };

 const getStatusColor = (status) => {
 switch (status) {
 case 'New': return 'bg-blue-100 text-blue-800';
 case 'Accepted': return 'bg-yellow-100 text-yellow-800';
 case 'Completed': return 'bg-green-100 text-green-800';
 case 'Cancelled': return 'bg-red-100 text-red-800';
 default: return 'bg-gray-100 text-gray-800';
 }
 };

 const getStatusIcon = (status) => {
 switch (status) {
 case 'Completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
 case 'Cancelled': return <XCircle className="w-5 h-5 text-red-600" />;
 default: return <Clock className="w-5 h-5 text-blue-600" />;
 }
 };

 if (loading) {
 return (
 <div className="min-h-screen bg-gray-100 flex items-center justify-center">
 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
 </div>
 );
 }

 if (!isAuthenticated) {
 return (
 <div className="min-h-screen bg-gray-100 flex items-center justify-center">
 <div className="text-center">
 <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus pedidos</p>
 <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
 Iniciar Sesión
 </Link>
 </div>
 </div>
 );
 }

 return (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 className="min-h-screen bg-gray-100 py-8"
 >
 <div className="max-w-4xl mx-auto px-4">
 <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

 {error && (
 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
 {error}
 </div>
 )}

 {orders.length === 0 ? (
 <div className="bg-white rounded-lg shadow-md p-8 text-center">
 <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
 <p className="text-gray-600 mb-4">No tienes pedidos aún</p>
 <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
 Explorar Productos
 </Link>
 </div>
 ) : (
 <div className="space-y-4">
 {orders.map((order) => (
 <motion.div
 key={order.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 className="bg-white rounded-lg shadow-md p-6"
 >
 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
 <div>
 <p className="text-sm text-gray-500">Número de orden</p>
 <p className="text-lg font-bold text-gray-900">{order.order_number}</p>
 </div>
 <div className="flex items-center mt-2 md:mt-0">
 {getStatusIcon(order.status)}
 <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
 {order.status === 'New' ? 'Nuevo' : 
 order.status === 'Accepted' ? 'Aceptado' : 
 order.status === 'Completed' ? 'Completado' : 'Cancelado'}
 </span>
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
 <div className="flex items-start">
 <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-2" />
 <div>
 <p className="text-gray-500">Dirección de envío</p>
 <p className="text-gray-900">{order.address_line_1}, {order.city}</p>
 </div>
 </div>
 <div className="flex items-start">
 <Clock className="w-4 h-4 text-gray-400 mt-1 mr-2" />
 <div>
 <p className="text-gray-500">Fecha del pedido</p>
 <p className="text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
 </div>
 </div>
 <div>
 <p className="text-gray-500">Total</p>
 <p className="text-xl font-bold text-blue-600">${parseFloat(order.order_total).toFixed(2)}</p>
 </div>
 </div>

 <div className="border-t pt-4 mb-4">
 <div className="flex items-center justify-between">
 {['New', 'Accepted', 'Completed'].filter(s => order.status !== 'Cancelled' || s === 'New').map((step, idx, arr) => {
 const stepIndex = ['New', 'Accepted', 'Completed'].indexOf(step);
 const orderIndex = order.status === 'Completed' ? 2 : order.status === 'Accepted' ? 1 : 0;
 const isCompleted = orderIndex > stepIndex;
 const isCurrent = order.status === step;
 const isCancelled = order.status === 'Cancelled';
 const labels = { New: 'Pedido', Accepted: 'Aceptado', Completed: 'Completado' };

 return (
 <div key={step} className={`flex items-center ${idx < arr.length - 1 ? 'flex-1' : ''}`}>
 <div className="flex flex-col items-center">
 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
 isCompleted ? 'bg-green-500 text-white' :
 isCurrent ? 'bg-blue-600 text-white' :
 isCancelled ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'
 }`}>
 {isCompleted ? <CheckCircle className="w-4 h-4" /> :
 isCancelled ? <XCircle className="w-4 h-4" /> :
 stepIndex + 1}
 </div>
 <span className={`text-xs mt-1 ${isCurrent ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
 {isCancelled ? 'Cancelado' : labels[step]}
 </span>
 </div>
 {idx < arr.length - 1 && (
 <div className={`flex-1 h-1 mx-2 ${isCompleted ? 'bg-green-400' : 'bg-gray-200'}`} />
 )}
 </div>
 );
 })}
 </div>
 </div>

 {order.orderproduct_set && order.orderproduct_set.length > 0 && (
 <div className="border-t pt-4">
 <p className="text-sm font-medium text-gray-700 mb-2">Productos:</p>
 <div className="flex flex-wrap gap-2">
 {order.orderproduct_set.map((item) => (
 <div key={item.id} className="bg-gray-50 rounded-lg p-2 flex items-center space-x-2">
 {item.product?.images && (
 <img 
 loading="lazy"
 src={item.product.images} 
 alt={item.product?.product_name} 
 className="w-10 h-10 object-cover rounded"
 />
 )}
 <div>
 <p className="text-sm font-medium">{item.product?.product_name}</p>
 <p className="text-xs text-gray-500">Cant: {item.quantity}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 )}
 </motion.div>
 ))}
 </div>
 )}
 </div>
 </motion.div>
 );
}

export default MisPedidos;