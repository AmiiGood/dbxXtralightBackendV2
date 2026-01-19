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
      console.log('🔄 AuthContext - Verificando autenticación...');
      if (authService.isAuthenticated()) {
        const storedUser = authService.getStoredUser();
        console.log('👤 AuthContext - Usuario encontrado en localStorage:', storedUser);
        setUsuario(storedUser);
      } else {
        console.log('❌ AuthContext - No hay token en localStorage');
      }
      setLoading(false);
      console.log('✅ AuthContext - Loading terminado');
    };

    checkAuth();
  }, []);

  const login = async (nombreUsuario, password) => {
    console.log('🔐 AuthContext - Iniciando login...');
    const result = await authService.login(nombreUsuario, password);
    if (result.success) {
      console.log('✅ AuthContext - Login exitoso, guardando usuario en estado:', result.data.usuario);
      setUsuario(result.data.usuario);
    } else {
      console.log('❌ AuthContext - Login fallido:', result.message);
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
