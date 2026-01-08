import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { User, Mail, Phone, MapPin, ShoppingBag, Settings, Edit, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import EditProfileForm from '../../components/formularios/editProfileForm'
import ChangePasswordForm from '../../components/formularios/changePasswordForm'

export default function MiCuenta(){
    const { user, logout, refreshUserInfo } = useAuth()
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('perfil')
    const [showEditProfile, setShowEditProfile] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)

    // Debug: Mostrar datos del usuario en consola
    useEffect(() => {
        console.log('🔍 Datos del usuario en MiCuenta:', user);
    }, [user])

    // Función de prueba para verificar el endpoint
    const testEndpoint = async () => {
        const token = localStorage.getItem('accessToken');
        console.log('🔑 Token actual:', token);
        console.log('🔑 Token length:', token ? token.length : 'No token');
        
        // Probar diferentes URLs para debug
        const urls = [
            'http://localhost:8000/api/test/',  // Endpoint de prueba sin autenticación
            'http://localhost:8000/api/users/me/',
            'http://localhost:8000/api/current-user/',
            'http://localhost:8000/users/me/',
            'http://localhost:8000/api/token/',  // Para verificar si el servidor responde
        ];
        
        for (const url of urls) {
            console.log(`🧪 Probando: ${url}`);
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                console.log(`📡 ${url} - Status:`, response.status);
                if (response.ok) {
                    const data = await response.json();
                    console.log(`✅ ÉXITO en ${url}:`, data);
                    break;
                } else {
                    const errorText = await response.text();
                    console.log(`❌ Error en ${url}:`, response.status, errorText.substring(0, 100));
                }
            } catch (error) {
                console.error(`💥 Error de red en ${url}:`, error.message);
            }
        }
        
        return; // Salir después de probar todas las URLs
    }

    const handleLogout = () => {
        logout()
        alert("Sesión cerrada con éxito!")
        navigate('/')
    }

    const tabs = [
        { id: 'perfil', label: 'Mi Perfil', icon: User },
        { id: 'pedidos', label: 'Mis Pedidos', icon: ShoppingBag },
        { id: 'configuracion', label: 'Configuración', icon: Settings }
    ]

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {user?.first_name && user?.last_name 
                                    ? `${user.first_name} ${user.last_name}` 
                                    : user?.username || user?.email || 'Usuario'
                                }
                            </h1>
                            <p className="text-gray-600">{user?.email}</p>
                            {user?.first_name === 'Usuario' && user?.last_name === 'Autenticado' && (
                                <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 rounded-lg">
                                    <p className="text-sm text-yellow-800">
                                        ⚠️ Mostrando datos básicos. El endpoint del servidor no está disponible.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar de navegación */}
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <nav className="space-y-2">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                                activeTab === tab.id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        >
                                            <Icon className="w-5 h-5" />
                                            <span className="font-medium">{tab.label}</span>
                                        </button>
                                    )
                                })}
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    <span className="font-medium">Cerrar Sesión</span>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Contenido principal */}
                    <div className="lg:w-3/4">
                        {activeTab === 'perfil' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-xl font-bold text-gray-900">Información Personal</h2>
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => setShowEditProfile(true)}
                                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                            <span>Editar</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nombre
                                            </label>
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <User className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {user?.first_name || 'No especificado'}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Apellido
                                            </label>
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <User className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {user?.last_name || 'No especificado'}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Correo Electrónico
                                            </label>
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-900">{user?.email}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Usuario
                                            </label>
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <User className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {user?.username || 'No especificado'}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Teléfono
                                            </label>
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <Phone className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {user?.phone || 'No especificado'}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Dirección
                                            </label>
                                            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                                <MapPin className="w-5 h-5 text-gray-400" />
                                                <span className="text-gray-900">
                                                    {user?.address || 'No especificado'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'pedidos' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Mis Pedidos</h2>
                                
                                <div className="text-center py-12">
                                    <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
                                    <p className="text-gray-600 mb-6">Cuando realices tu primer pedido, aparecerá aquí</p>
                                    <button 
                                        onClick={() => navigate('/')}
                                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                                    >
                                        Comenzar a Comprar
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'configuracion' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Configuración de Cuenta</h2>
                                
                                <div className="space-y-6">
                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Seguridad</h3>
                                        <ChangePasswordForm />
                                    </div>

                                    <div className="border-b border-gray-200 pb-4">
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Notificaciones</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <h4 className="font-medium text-gray-900">Notificaciones por Email</h4>
                                                    <p className="text-sm text-gray-600">Recibe actualizaciones sobre tus pedidos</p>
                                                </div>
                                                <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-3">Privacidad</h3>
                                        <div className="space-y-3">
                                            <button className="w-full text-left p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">Eliminar Cuenta</h4>
                                                        <p className="text-sm text-gray-600">Eliminar permanentemente tu cuenta</p>
                                                    </div>
                                                    <span className="text-red-600 text-sm font-medium">Eliminar</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Modal de edición de perfil */}
            {showEditProfile && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <EditProfileForm
                            onClose={() => setShowEditProfile(false)}
                            onUpdate={() => {
                                refreshUserInfo();
                                setShowEditProfile(false);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}