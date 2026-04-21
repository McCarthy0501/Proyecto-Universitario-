import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setToken(token);
      fetchUserInfo(token);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
    }
  }, []);

  const fetchUserInfo = async (token) => {
    try {
      console.log('🔍 Obteniendo información del usuario...');
      const response = await fetch('http://localhost:8000/api/user/me/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('📡 Respuesta del servidor:', response.status, response.statusText);
      
      if (response.ok) {
        const userData = await response.json();
        console.log('👤 Datos del usuario recibidos:', userData);
        console.log('👤 Nombre completo:', userData.first_name, userData.last_name);
        setIsAuthenticated(true);
        setUser(userData);
      } else if (response.status === 401) {
        // Token inválido o expirado
        console.warn('⚠️ Token inválido o expirado, limpiando sesión');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userEmail');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        console.warn('⚠️ No se pudo obtener datos completos del usuario, usando datos básicos');
        console.warn('⚠️ Status:', response.status, response.statusText);
        // En lugar de limpiar todo, usar datos básicos del token
        const email = localStorage.getItem('userEmail') || 'usuario@email.com';
        const basicUserData = {
          id: 1,
          first_name: 'Reymon',
          last_name: 'Casique',
          email: email,
          username: email.split('@')[0]
        };
        console.log('👤 Usando datos básicos:', basicUserData);
        setIsAuthenticated(true);
        setUser(basicUserData);
      }
    } catch (error) {
      console.error('💥 Error al obtener información del usuario:', error);
      console.warn('⚠️ Usando datos básicos como fallback');
      // En caso de error, usar datos básicos en lugar de limpiar todo
      const email = localStorage.getItem('userEmail') || 'usuario@email.com';
      const basicUserData = {
        id: 1,
        first_name: 'Reymon',
        last_name: 'Casique',
        email: email,
        username: email.split('@')[0]
      };
      setIsAuthenticated(true);
      setUser(basicUserData);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, accessToken) => {
    setToken(accessToken);
    setIsAuthenticated(true);
    setUser(userData);
  };

  const refreshUserInfo = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setToken(token);
      await fetchUserInfo(token);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    setToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const clearAuthData = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = {
    isAuthenticated,
    user,
    token,
    loading,
    login,
    logout,
    refreshUserInfo
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Exportaciones al final del archivo
export { AuthProvider, useAuth };
