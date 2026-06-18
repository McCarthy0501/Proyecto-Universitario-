import { useState, useEffect } from 'react';
import { useExchangeRate } from '../../contexts/ExchangeRateContext';
import { DollarSign, RotateCw, Save, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ExchangeRatePanel() {
  const { rate, source, loading, setManualRate, updateAutoRate, fetchRate } = useExchangeRate();
  const [manualRate, setManualRateValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (rate) setManualRateValue(rate.toString());
  }, [rate]);

  const handleSaveManual = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('accessToken');
      const response = await setManualRate(parseFloat(manualRate), token);
      if (response.ok) {
        toast.success(`Tasa manual actualizada: Bs. ${manualRate}`);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Error al guardar tasa');
      }
    } catch (err) {
      toast.error('Error de conexión');
    } finally {
      setSaving(false);
    }
  };

  const handleAutoUpdate = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('accessToken');
      const response = await updateAutoRate(token);
      if (response.ok) {
        toast.success('Tasa actualizada automáticamente');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Error al consultar API externa');
      }
    } catch (err) {
      toast.error('Error de conexión');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
        <DollarSign className="w-6 h-6" />
        Tasa de Cambio BCV
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasa Actual</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-50 rounded-lg p-4 flex-1">
              <p className="text-sm text-gray-500 mb-1">1 USD =</p>
              <p className="text-3xl font-bold text-blue-600">Bs. {parseFloat(rate).toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 flex-1">
              <p className="text-sm text-gray-500 mb-1">Fuente</p>
              <p className="text-xl font-semibold text-gray-800 capitalize">{source}</p>
            </div>
          </div>
          <button
            onClick={handleAutoUpdate}
            disabled={updating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
          >
            {updating ? (
              <RotateCw className="w-5 h-5 animate-spin" />
            ) : (
              <TrendingUp className="w-5 h-5" />
            )}
            {updating ? 'Consultando API...' : 'Actualizar Tasa Automáticamente (API BCV)'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasa Manual</h3>
          <form onSubmit={handleSaveManual} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa en Bolívares por Dólar
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">Bs.</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={manualRate}
                  onChange={(e) => setManualRateValue(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Guardando...' : 'Guardar Tasa Manual'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
