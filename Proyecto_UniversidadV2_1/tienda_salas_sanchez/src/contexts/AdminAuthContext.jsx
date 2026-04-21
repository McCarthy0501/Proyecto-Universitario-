import { useState, useEffect, createContext, useContext } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = () => {
    const userStr = localStorage.getItem("adminUser");
    const token = localStorage.getItem("adminToken");
    if (userStr && token) {
      try {
        const user = JSON.parse(userStr);
        if (user.is_staff) {
          setAdminUser(user);
        } else {
          localStorage.removeItem("adminUser");
          localStorage.removeItem("adminToken");
        }
      } catch (e) {
        localStorage.removeItem("adminUser");
        localStorage.removeItem("adminToken");
      }
    }
    setLoading(false);
  };

  const login = (userData, token) => {
    setAdminUser(userData);
    localStorage.setItem("adminUser", JSON.stringify(userData));
    localStorage.setItem("adminToken", token);
  };

  const logout = () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("adminToken");
    setAdminUser(null);
    window.location.href = "/admin";
  };

  const value = {
    adminUser,
    loading,
    login,
    logout,
    isAuthenticated: !!adminUser
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth debe usarse dentro de AdminAuthProvider");
  }
  return context;
};