import { useState } from 'react';
import { ShieldAlert, KeyRound, Mail, ArrowLeft, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../api';

function AdminRecovery() {
 const [email, setEmail] = useState('');
 const [recoveryCode, setRecoveryCode] = useState('');
 const [newPassword, setNewPassword] = useState('');
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState('');
 const navigate = useNavigate();

 const handleSubmit = async (e) => {
 e.preventDefault();
 setLoading(true);
 setMessage('');

 if (newPassword.length < 8) {
 setMessage('La contraseña debe tener al menos 8 caracteres');
 setLoading(false);
 return;
 }

 try {
 const response = await fetch(`${API_BASE_URL}/api/admin/recovery-reset/`, {
 method: 'POST',
 headers: {
 'Content-Type': 'application/json',
 },
 body: JSON.stringify({
 email,
 recovery_code: recoveryCode,
 new_password: newPassword,
 }),
 });

 const data = await response.json();

 if (response.ok) {
 setMessage(`Contraseña restablecida. Ya puedes iniciar sesion como ${email}`);
 } else {
 setMessage(data.detail || 'Error al restablecer la contraseña');
 }
 } catch (error) {
 console.error('Error:', error);
 setMessage('Error de conexion. Intenta mas tarde');
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
 <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
 <div className="flex flex-col items-center mb-6">
 <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
 <ShieldAlert className="w-8 h-8 text-red-600" />
 </div>
 <h2 className="text-2xl font-bold text-center text-gray-800">
 Recuperacion de Administrador
 </h2>
 <p className="text-sm text-gray-600 text-center mt-2">
 Solo usa esta pagina si eres el responsable del sistema y tienes el codigo maestro de recuperacion
 </p>
 </div>

 <form className="space-y-4" onSubmit={handleSubmit}>
 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Email del administrador
 </label>
 <div className="relative">
 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 placeholder="admin@tienda.com"
 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
 required
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Codigo maestro de recuperacion
 </label>
 <div className="relative">
 <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
 <input
 type="text"
 value={recoveryCode}
 onChange={(e) => setRecoveryCode(e.target.value)}
 placeholder="Codigo secreto del sistema"
 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
 required
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-gray-700 mb-2">
 Nueva contraseña
 </label>
 <div className="relative">
 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
 <input
 type="password"
 value={newPassword}
 onChange={(e) => setNewPassword(e.target.value)}
 placeholder="Minimo 8 caracteres"
 className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
 required
 minLength={8}
 />
 </div>
 </div>

 {message && (
 <div className={`p-3 rounded-lg text-sm ${
 message.includes('restablecida') || message.includes('Ya puedes')
 ? 'bg-green-100 text-green-800'
 : 'bg-red-100 text-red-800'
 }`}>
 {message}
 </div>
 )}

 <button
 type="submit"
 disabled={loading}
 className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
 >
 {loading ? 'Procesando...' : 'Restablecer Contraseña'}
 </button>

 <button
 type="button"
 onClick={() => navigate('/admin')}
 className="w-full flex items-center justify-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
 >
 <ArrowLeft className="w-4 h-4" />
 <span>Volver al Panel Admin</span>
 </button>
 </form>
 </div>
 </div>
 );
}

export default AdminRecovery;
