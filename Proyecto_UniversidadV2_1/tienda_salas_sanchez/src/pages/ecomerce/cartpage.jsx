import { motion } from "framer-motion";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, CheckCircle, Loader2, Wallet, Building2, Banknote } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { API_BASE_URL } from "../../api";
import PriceDisplay from "../../components/complementos/PriceDisplay";

function CartPage() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getTotalItems, 
    getSubtotal, 
    getTax, 
    getTotal 
  } = useCart();
  
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1); // 1: Carrito, 2: Datos envío, 3: Método pago, 4: Confirmación
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('simulated');

  const paymentMethodLabels = {
    'simulated': 'Pago con Tarjeta',
    'transfer': 'Transferencia Bancaria',
    'cash': 'Contra Entrega'
  };

  const getPaymentMethodLabel = () => {
    return paymentMethodLabels[paymentMethod] || paymentMethod;
  };
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone_number || '',
    email: user?.email || '',
    address_line_1: '',
    address_line_2: '',
    country: 'Venezuela',
    city: '',
    state: '',
    order_note: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/cart');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const productsData = cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity
      }));

      const authToken = token || localStorage.getItem('accessToken');
      console.log("=== TOKEN USADO ===", authToken);
      console.log("=== USER ===", user);

      if (!authToken) {
        throw new Error("No has iniciado sesión. Por favor, inicia sesión para continuar.");
      }

      const response = await fetch(`${API_BASE_URL}/api/orders/create/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          ...formData,
          products_data: productsData,
          payment_method: paymentMethodLabels[paymentMethod] || 'Simulado'
        })
      });

      const data = await response.json();
      console.log("=== RESPUESTA ===", data);

      if (!response.ok) {
        const errorMsg = typeof data.error === 'object' ? JSON.stringify(data.error) : (data.error || 'Error al crear el pedido');
        throw new Error(errorMsg);
      }

      setOrderResult(data);
      setStep(4);
      clearCart();
      toast.success("¡Pedido confirmado! Gracias por tu compra");
    } catch (err) {
      console.error("=== ERROR ===", err);
      setError(err.message);
      toast.error(err.message || "Error al procesar el pedido");
    } finally {
      setLoading(false);
    }
  }

  if (cartItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="min-h-screen bg-gray-100 py-8"
      >
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-8">Agrega algunos productos para comenzar tu compra</p>
            <a 
              href="/" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Continuar Comprando
            </a>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-100 py-8"
    >
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Pasos */}
        <div className="flex items-center justify-center mb-8 space-x-4">
          <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>1</div>
            <span className="ml-2 font-medium">Carrito</span>
          </div>
          <div className="w-10 h-1 bg-gray-300"></div>
          <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>2</div>
            <span className="ml-2 font-medium">Envío</span>
          </div>
          <div className="w-10 h-1 bg-gray-300"></div>
          <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>3</div>
            <span className="ml-2 font-medium">Pago</span>
          </div>
          <div className="w-10 h-1 bg-gray-300"></div>
          <div className={`flex items-center ${step >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>4</div>
            <span className="ml-2 font-medium">Confirmado</span>
          </div>
        </div>

        {step === 1 && (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Carrito de Compras ({getTotalItems()} productos)
                  </h1>
                  <button
                    onClick={() => {
                      clearCart();
                      toast.success("Carrito vaciado");
                    }}
                    className="text-red-600 hover:text-red-800 font-medium"
                  >
                    Limpiar Carrito
                  </button>
                </div>

                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.images}
                        alt={item.product_name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product_name}</h3>
                        <p className="text-gray-600"><PriceDisplay priceUsd={item.price} showBs={false} /> c/u</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          <PriceDisplay priceUsd={(item.price * item.quantity).toFixed(2)} />
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(item.id);
                          toast.success("Producto eliminado");
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Resumen del Pedido</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">IVA (16%):</span>
                    <span className="font-semibold">${getTax().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-blue-600">${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2"
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Proceder al Pago</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Datos de Envío</h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Apellido</label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Teléfono</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Dirección</label>
                  <input
                    type="text"
                    name="address_line_1"
                    value={formData.address_line_1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Dirección (opcional)</label>
                  <input
                    type="text"
                    name="address_line_2"
                    value={formData.address_line_2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Ciudad</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Estado/Código Postal</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nota del pedido (opcional)</label>
                  <textarea
                    name="order_note"
                    value={formData.order_note}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    rows={2}
                  />
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>IVA (16%):</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg"
                >
                  Volver
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
                >
                  <Wallet className="w-5 h-5 mr-2" />
                  Seleccionar Método de Pago
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Método de Pago</h2>
              
              <div className="space-y-4 mb-6">
                <div 
                  onClick={() => setPaymentMethod('simulated')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'simulated' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'simulated' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'simulated' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Pago con Tarjeta (Simulado)</h3>
                      <p className="text-sm text-gray-500">Visa, Mastercard -Modo prueba-</p>
                    </div>
                    <CreditCard className="w-6 h-6 ml-auto text-gray-400" />
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'transfer' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'transfer' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'transfer' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Transferencia Bancaria</h3>
                      <p className="text-sm text-gray-500">Transferir a nuestra cuenta</p>
                    </div>
                    <Building2 className="w-6 h-6 ml-auto text-gray-400" />
                  </div>
                </div>

                <div 
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'cash' && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Contra Entrega</h3>
                      <p className="text-sm text-gray-500">Pagas cuando recibes</p>
                    </div>
                    <Banknote className="w-6 h-6 ml-auto text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>IVA (16%):</span>
                  <span>${getTax().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total a pagar:</span>
                  <span className="text-blue-600">${getTotal().toFixed(2)}</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-4 rounded-lg"
                >
                  Volver
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Confirmar Pedido
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 4 && orderResult && (
          <div className="max-w-2xl mx-auto">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg shadow-md p-8 text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Pedido Confirmado!</h2>
              <p className="text-gray-600 mb-2">Tu pedido ha sido creado exitosamente.</p>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-600">Número de orden:</p>
                <p className="text-xl font-bold text-blue-600">{orderResult.order_number}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">Método de pago:</p>
                <p className="text-lg font-semibold text-gray-900">{getPaymentMethodLabel()}</p>
              </div>
              <p className="text-lg font-semibold mb-6">
                Total pagado: <span className="text-green-600">${orderResult.order_total?.toFixed(2)}</span>
              </p>
              <div className="flex space-x-4 justify-center">
                <a
                  href="/"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
                >
                  Continuar Comprando
                </a>
                <button
                  onClick={() => {
                    setStep(1);
                    setOrderResult(null);
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-3 px-6 rounded-lg"
                >
                  Ver más pedidos
                </button>
              </div>
            </motion.div>
          </div>
        )}

      </div>
    </motion.div>
  );
}

export default CartPage