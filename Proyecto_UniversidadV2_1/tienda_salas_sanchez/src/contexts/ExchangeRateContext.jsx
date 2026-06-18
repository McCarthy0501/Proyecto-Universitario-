import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../api';

const ExchangeRateContext = createContext();

export const useExchangeRate = () => {
  const context = useContext(ExchangeRateContext);
  if (!context) {
    throw new Error('useExchangeRate debe usarse dentro de ExchangeRateProvider');
  }
  return context;
};

export function ExchangeRateProvider({ children }) {
  const [rate, setRate] = useState(95.00);
  const [source, setSource] = useState('manual');
  const [loading, setLoading] = useState(true);

  const fetchRate = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/config/exchange-rate/`);
      if (response.ok) {
        const data = await response.json();
        setRate(data.rate);
        setSource(data.source);
      }
    } catch (e) {
      console.error('Error al obtener tasa de cambio:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const setManualRate = async (newRate, token) => {
    const response = await fetch(`${API_BASE_URL}/api/config/exchange-rate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ rate: newRate }),
    });
    if (response.ok) {
      const data = await response.json();
      setRate(data.rate);
      setSource(data.source);
    }
    return response;
  };

  const updateAutoRate = async (token) => {
    const response = await fetch(`${API_BASE_URL}/api/config/exchange-rate/update/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (response.ok) {
      const data = await response.json();
      setRate(data.rate);
      setSource(data.source);
    }
    return response;
  };

  const toBs = (usdPrice) => {
    return usdPrice * rate;
  };

  useEffect(() => {
    fetchRate();
  }, [fetchRate]);

  return (
    <ExchangeRateContext.Provider value={{ rate, source, loading, fetchRate, setManualRate, updateAutoRate, toBs }}>
      {children}
    </ExchangeRateContext.Provider>
  );
}
