import { useState, useEffect } from "react";
import { Package, DollarSign, TrendingUp, TrendingDown, Users, ShoppingCart, AlertTriangle, BarChart3, Clock, CheckCircle, XCircle, RefreshCw, Ban } from "lucide-react";
import { API_BASE_URL } from "../../api";

function Estadistica() {
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalUsers: 0,
        totalOrders: 0,
        lowStockProducts: 0,
        outOfStockProducts: 0,
        totalInventoryValue: 0,
        averagePrice: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        orderStats: { New: 0, Accepted: 0, Completed: 0, Cancelled: 0 },
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [fetchErrors, setFetchErrors] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        setFetchErrors([]);
        const errors = [];

        const getToken = () => localStorage.getItem("adminToken") || localStorage.getItem("accessToken");
        const authHeaders = () => {
            const token = getToken();
            return token ? { 'Authorization': `Bearer ${token}` } : {};
        };

        let products = [];
        let categories = [];
        let usersData = [];
        let ordersData = [];

        try {
            const res = await fetch(`${API_BASE_URL}/api/productos?page_size=500`);
            if (res.ok) {
                const data = await res.json();
                products = data.results || data;
            } else {
                errors.push("Productos: error del servidor");
            }
        } catch {
            errors.push("Productos: error de conexion");
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/categorias?page_size=500`);
            if (res.ok) {
                const data = await res.json();
                categories = data.results || data;
            } else {
                errors.push("Categorias: error del servidor");
            }
        } catch {
            errors.push("Categorias: error de conexion");
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/users/?page_size=500`, { headers: authHeaders() });
            if (res.ok) {
                const data = await res.json();
                usersData = data.results || data;
            } else if (res.status === 401) {
                errors.push("Usuarios: sesion expirada");
            } else {
                errors.push(`Usuarios: error ${res.status}`);
            }
        } catch {
            errors.push("Usuarios: error de conexion");
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/orders/`, { headers: authHeaders() });
            if (res.ok) {
                const data = await res.json();
                ordersData = Array.isArray(data) ? data : (data.results || data);
            } else if (res.status === 401) {
                errors.push("Ordenes: sesion expirada");
            } else if (res.status === 403) {
                errors.push("Ordenes: acceso denegado (requiere permisos de administrador)");
            } else {
                errors.push(`Ordenes: error ${res.status}`);
            }
        } catch {
            errors.push("Ordenes: error de conexion");
        }

        setFetchErrors(errors);

        const totalProducts = Array.isArray(products) ? products.length : 0;
        const lowStockProducts = Array.isArray(products) ? products.filter(p => p.stock <= 5 && p.stock > 0).length : 0;
        const outOfStockProducts = Array.isArray(products) ? products.filter(p => p.stock === 0).length : 0;
        const activeProducts = Array.isArray(products) ? products.filter(p => p.is_available).length : 0;
        const inactiveProducts = Array.isArray(products) ? products.filter(p => !p.is_available).length : 0;
        const totalInventoryValue = Array.isArray(products)
            ? products.reduce((sum, p) => sum + (parseFloat(p.price || 0) * parseInt(p.stock || 0)), 0) : 0;
        const averagePrice = totalProducts > 0
            ? products.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / totalProducts : 0;

        const orderStats = { New: 0, Accepted: 0, Completed: 0, Cancelled: 0 };
        let totalRevenue = 0;
        if (Array.isArray(ordersData)) {
            ordersData.forEach(o => {
                if (Object.prototype.hasOwnProperty.call(orderStats, o.status)) {
                    orderStats[o.status] += 1;
                }
                if (o.status === 'Completed' || o.status === 'Accepted' || o.status === 'New') {
                    totalRevenue += parseFloat(o.order_total || 0);
                }
            });
        }

        const categoryCount = {};
        if (Array.isArray(products)) {
            products.forEach(p => {
                const catName = p.category?.category_name || (typeof p.category === 'string' ? p.category : 'Sin categoria');
                categoryCount[catName] = (categoryCount[catName] || 0) + 1;
            });
        }
        const chart = Object.entries(categoryCount).map(([name, count]) => ({ name, count }));

        setStats({
            totalProducts,
            totalCategories: Array.isArray(categories) ? categories.length : 0,
            totalUsers: Array.isArray(usersData) ? usersData.length : 0,
            totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
            lowStockProducts,
            outOfStockProducts,
            totalInventoryValue,
            averagePrice,
            activeProducts,
            inactiveProducts,
            orderStats,
            totalRevenue,
        });
        setChartData(chart);
        setLoading(false);
    };

    const statusLabels = {
        New: { label: 'Nuevas', icon: Clock },
        Accepted: { label: 'Aceptadas', icon: CheckCircle },
        Completed: { label: 'Completadas', icon: CheckCircle },
        Cancelled: { label: 'Canceladas', icon: XCircle },
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard de Estadisticas</h2>
                <button
                    onClick={fetchStats}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Actualizar
                </button>
            </div>

            {fetchErrors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <h3 className="font-semibold text-amber-800">Algunos datos no pudieron cargarse</h3>
                    </div>
                    <ul className="space-y-1">
                        {fetchErrors.map((err, i) => (
                            <li key={i} className="text-sm text-amber-700 flex items-center gap-2">
                                <Ban className="w-3 h-3 flex-shrink-0" />
                                {err}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Total Productos</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProducts}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                {stats.activeProducts} activos, {stats.inactiveProducts} inactivos
                            </p>
                        </div>
                        <Package className="w-12 h-12 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Categorias</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCategories}</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Usuarios</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                        </div>
                        <Users className="w-12 h-12 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Ordenes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                        </div>
                        <ShoppingCart className="w-12 h-12 text-yellow-500" />
                    </div>
                </div>
            </div>

            {stats.totalOrders > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(statusLabels).map(([status, { label, icon }]) => {
                        const Icon = icon;
                        return (
                            <div key={status} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-300">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium">{label}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{stats.orderStats[status]}</p>
                                    </div>
                                    <Icon className="w-8 h-8 text-gray-400" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {stats.totalRevenue > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Ingresos Totales (ordenes activas)</p>
                            <p className="text-3xl font-bold text-green-600 mt-2">${stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-green-500" />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Valor del Inventario</h3>
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">${stats.totalInventoryValue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">Precio promedio: ${stats.averagePrice.toFixed(2)}</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Stock Bajo</h3>
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{stats.lowStockProducts}</p>
                    <p className="text-sm text-gray-500 mt-1">Productos con stock &le; 5 unidades</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Sin Stock</h3>
                        <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">{stats.outOfStockProducts}</p>
                    <p className="text-sm text-gray-500 mt-1">Productos agotados</p>
                </div>
            </div>

            {chartData.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos por Categoria</h3>
                    <div className="space-y-3">
                        {chartData.map((item, index) => {
                            const maxCount = Math.max(...chartData.map(c => c.count));
                            const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                            return (
                                <div key={index} className="space-y-1">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="font-medium text-gray-700">{item.name}</span>
                                        <span className="text-gray-600">{item.count} productos</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Estadistica;
