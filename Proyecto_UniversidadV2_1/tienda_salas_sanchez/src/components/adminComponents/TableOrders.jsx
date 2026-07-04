import { useEffect, useState } from "react";
import { Search, Package, MapPin, Calendar, CheckCircle, XCircle, Clock, Eye, ChevronDown, ChevronUp } from "lucide-react";
import { API_BASE_URL } from "../../api";

export default function TableOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/orders/?page_size=500`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.results || data);
      }
    } catch (e) {
      console.error("Error al cargar órdenes:", e);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken") || localStorage.getItem("accessToken");
      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (e) {
      console.error("Error al actualizar estado:", e);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm ||
      order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusStyles = (status) => {
    switch (status) {
      case 'New':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-800',
          border: 'border-orange-300',
          icon: 'text-orange-600',
          label: 'Pendiente'
        };
      case 'Accepted':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          border: 'border-green-300',
          icon: 'text-green-600',
          label: 'Aceptado'
        };
      case 'Completed':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          border: 'border-blue-300',
          icon: 'text-blue-600',
          label: 'Completado'
        };
      case 'Cancelled':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          border: 'border-red-300',
          icon: 'text-red-600',
          label: 'Rechazado'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-300',
          icon: 'text-gray-600',
          label: status
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Accepted':
        return <CheckCircle className="w-6 h-6" />;
      case 'Cancelled':
        return <XCircle className="w-6 h-6" />
      case 'Completed':
        return <Package className="w-6 h-6" />;
      default:
        return <Clock className="w-6 h-6" />;
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'New').length,
    accepted: orders.filter(o => o.status === 'Accepted').length,
    completed: orders.filter(o => o.status === 'Completed').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
    totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.order_total || 0), 0)
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Órdenes</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar orden..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todos los estados</option>
            <option value="New">Pendiente</option>
            <option value="Accepted">Aceptado</option>
            <option value="Completed">Completado</option>
            <option value="Cancelled">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-orange-50 rounded-lg shadow-md p-4 border border-orange-200">
          <p className="text-sm text-orange-700">Pendientes</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow-md p-4 border border-green-200">
          <p className="text-sm text-green-700">Aceptadas</p>
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow-md p-4 border border-blue-200">
          <p className="text-sm text-blue-700">Completadas</p>
          <p className="text-2xl font-bold text-blue-600">{stats.completed}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow-md p-4 border border-red-200">
          <p className="text-sm text-red-700">Rechazadas</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-600">Ingresos</p>
          <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      {/* Lista de Órdenes */}
      <div className="space-y-4">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => {
            const statusStyle = getStatusStyles(order.status);
            const products = order.orderproduct_set || [];

            return (
              <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${statusStyle.bg}`}>
                        <span className={statusStyle.icon}>
                          {getStatusIcon(order.status)}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-900">{order.order_number}</p>
                        <p className="text-sm text-gray-500">{order.first_name} {order.last_name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">{order.email}</p>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-green-600">${parseFloat(order.order_total || 0).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">IVA: ${parseFloat(order.tax || 0).toFixed(2)}</p>
                      </div>
                      <span className={`px-4 py-2 ${statusStyle.bg} ${statusStyle.text} rounded-full font-semibold`}>
                        {statusStyle.label}
                      </span>
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        {expandedOrder === order.id ? <ChevronUp /> : <ChevronDown />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Detalles expandidos */}
                {expandedOrder === order.id && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Info envío */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Información de Envío</h4>
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mt-1" />
                          <div>
                            <p>{order.address_line_1}</p>
                            <p>{order.address_line_2}</p>
                            <p>{order.city}, {order.state}, {order.country}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                          <Calendar className="w-4 h-4" />
                          <p>{order.created_at ? new Date(order.created_at).toLocaleString() : 'N/A'}</p>
                        </div>
                      </div>

                      {/* Productos */}
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Productos</h4>
                        <div className="space-y-2">
                          {products.length > 0 ? (
                            products.map((prod, idx) => (
                              <div key={idx} className="flex items-center gap-3 bg-white p-2 rounded">
                                <Package className="w-5 h-5 text-gray-400" />
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{prod.product?.product_name || 'Producto'}</p>
                                  <p className="text-xs text-gray-500">Cant: {prod.quantity} x ${prod.product_price}</p>
                                </div>
                                <p className="font-semibold text-sm">${(prod.quantity * prod.product_price).toFixed(2)}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">No hay productos</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="mt-4 pt-4 border-t flex gap-3">
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Accepted')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Aceptar
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                        Rechazar
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'Completed')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        <Package className="w-5 h-5" />
                        Completar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            {searchTerm || statusFilter !== "all" ? 'No se encontraron órdenes' : 'No hay órdenes registradas'}
          </div>
        )}
      </div>
    </div>
  );
}