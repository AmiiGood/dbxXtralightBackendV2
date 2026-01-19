import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        const storedUser = authService.getStoredUser();
        setUsuario(storedUser);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (nombreUsuario, password) => {
    const result = await authService.login(nombreUsuario, password);
    if (result.success) {
      setUsuario(result.data.usuario);
    }
    return result;
  };

  const logout = async () => {
    await authService.logout();
    setUsuario(null);
  };

  const isAdmin = () => {
    return usuario?.rol?.esAdmin || false;
  };

  const hasArea = (areaName) => {
    return usuario?.area?.nombre === areaName;
  };

  const value = {
    usuario,
    loading,
    login,
    logout,
    isAdmin,
    hasArea,
    isAuthenticated: authService.isAuthenticated(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
