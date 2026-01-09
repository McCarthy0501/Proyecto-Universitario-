import { useState, useEffect } from "react";
import { Package, DollarSign, TrendingUp, TrendingDown, Users, ShoppingCart, AlertTriangle, BarChart3 } from "lucide-react";

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
    });
    const [loading, setLoading] = useState(true);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Obtener productos
            const productsRes = await fetch("http://localhost:8000/api/productos");
            const productsData = await productsRes.json();
            
            // Obtener categorías
            const categoriesRes = await fetch("http://localhost:8000/api/categorias");
            const categoriesData = await categoriesRes.json();

            // Obtener usuarios (si el endpoint existe)
            let usersData = [];
            try {
                const token = localStorage.getItem('accessToken');
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const usersRes = await fetch("http://localhost:8000/api/users/", { headers });
                if (usersRes.ok) {
                    usersData = await usersRes.json();
                }
            } catch (e) {
                console.log("Error al cargar usuarios:", e);
            }

            // Obtener órdenes (si el endpoint existe)
            let ordersData = [];
            try {
                const token = localStorage.getItem('accessToken');
                const headers = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const ordersRes = await fetch("http://localhost:8000/api/orders/", { headers });
                if (ordersRes.ok) {
                    ordersData = await ordersRes.json();
                }
            } catch (e) {
                console.log("Error al cargar órdenes:", e);
            }

            // Calcular estadísticas
            const totalProducts = productsData.length || 0;
            const lowStockProducts = productsData.filter(p => p.stock <= 5 && p.stock > 0).length || 0;
            const outOfStockProducts = productsData.filter(p => p.stock === 0).length || 0;
            const activeProducts = productsData.filter(p => p.is_available).length || 0;
            const inactiveProducts = productsData.filter(p => !p.is_available).length || 0;
            const totalInventoryValue = productsData.reduce((sum, p) => sum + (parseFloat(p.price || 0) * parseInt(p.stock || 0)), 0);
            const averagePrice = totalProducts > 0 
                ? productsData.reduce((sum, p) => sum + parseFloat(p.price || 0), 0) / totalProducts 
                : 0;

            // Agrupar productos por categoría para el gráfico
            const categoryCount = {};
            productsData.forEach(p => {
                const catName = p.category?.category_name || 'Sin categoría';
                categoryCount[catName] = (categoryCount[catName] || 0) + 1;
            });
            const chart = Object.entries(categoryCount).map(([name, count]) => ({ name, count }));

            setStats({
                totalProducts,
                totalCategories: categoriesData.length || 0,
                totalUsers: Array.isArray(usersData) ? usersData.length : 0,
                totalOrders: Array.isArray(ordersData) ? ordersData.length : 0,
                lowStockProducts,
                outOfStockProducts,
                totalInventoryValue,
                averagePrice,
                activeProducts,
                inactiveProducts,
            });
            setChartData(chart);
        } catch (error) {
            console.error("Error al cargar estadísticas:", error);
        } finally {
            setLoading(false);
        }
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
                <h2 className="text-3xl font-bold text-gray-900">Dashboard de Estadísticas</h2>
                <button
                    onClick={fetchStats}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
                >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Actualizar
                </button>
            </div>

            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Productos */}
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

                {/* Categorías */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Categorías</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCategories}</p>
                        </div>
                        <BarChart3 className="w-12 h-12 text-green-500" />
                    </div>
                </div>

                {/* Usuarios */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Usuarios</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalUsers}</p>
                        </div>
                        <Users className="w-12 h-12 text-purple-500" />
                    </div>
                </div>

                {/* Órdenes */}
                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm font-medium">Órdenes</p>
                            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                        </div>
                        <ShoppingCart className="w-12 h-12 text-yellow-500" />
                    </div>
                </div>
            </div>

            {/* Estadísticas de inventario */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Valor del inventario */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Valor del Inventario</h3>
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-3xl font-bold text-green-600">${stats.totalInventoryValue.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 mt-1">Precio promedio: ${stats.averagePrice.toFixed(2)}</p>
                </div>

                {/* Stock bajo */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Stock Bajo</h3>
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-3xl font-bold text-orange-600">{stats.lowStockProducts}</p>
                    <p className="text-sm text-gray-500 mt-1">Productos con stock ≤ 5 unidades</p>
                </div>

                {/* Sin stock */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Sin Stock</h3>
                        <TrendingDown className="w-6 h-6 text-red-600" />
                    </div>
                    <p className="text-3xl font-bold text-red-600">{stats.outOfStockProducts}</p>
                    <p className="text-sm text-gray-500 mt-1">Productos agotados</p>
                </div>
            </div>

            {/* Gráfico de productos por categoría */}
            {chartData.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos por Categoría</h3>
                    <div className="space-y-3">
                        {chartData.map((item, index) => {
                            const maxCount = Math.max(...chartData.map(c => c.count));
                            const percentage = (item.count / maxCount) * 100;
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