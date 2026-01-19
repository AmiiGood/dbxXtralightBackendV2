import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');

    if (token && usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (err) {
        console.error('Error al parsear usuario:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      }
    }
    setLoading(false);
  }, []);

  const login = async (nombreUsuario, password) => {
    try {
      setError(null);
      const response = await authService.login(nombreUsuario, password);

      if (response.status === 'success') {
        const { token, usuario } = response.data;

        // Guardar token y usuario
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));

        setUsuario(usuario);
        return { success: true };
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Error al iniciar sesión. Verifica tus credenciales.';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Error al hacer logout:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      setUsuario(null);
    }
  };

  const value = {
    usuario,
    login,
    logout,
    loading,
    error,
    isAuthenticated: !!usuario,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
