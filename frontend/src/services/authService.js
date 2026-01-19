import api from './api';

const authService = {
  // Login
  async login(nombreUsuario, password) {
    try {
      console.log('Intentando login con:', { nombreUsuario });
      console.log('API URL:', import.meta.env.VITE_API_URL);

      const response = await api.post('/auth/login', {
        nombreUsuario,
        password,
      });

      console.log('Respuesta del servidor:', response.data);

      if (response.data.status === 'success') {
        const { token, usuario } = response.data.data;

        // Guardar token y usuario en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('usuario', JSON.stringify(usuario));

        console.log('Login exitoso, usuario guardado:', usuario);

        return { success: true, data: response.data.data };
      }

      return { success: false, message: response.data.message };
    } catch (error) {
      console.error('Error en login:', error);
      console.error('Error response:', error.response?.data);

      // Manejar diferentes tipos de errores
      if (error.code === 'ERR_NETWORK') {
        return {
          success: false,
          message: 'No se puede conectar al servidor. Asegúrate de que el backend esté corriendo en http://localhost:3000',
        };
      }

      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Error al iniciar sesión',
      };
    }
  },

  // Logout
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
    }
  },

  // Obtener usuario actual
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      if (response.data.status === 'success') {
        const usuario = response.data.data.usuario;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        return { success: true, data: usuario };
      }
      return { success: false };
    } catch (error) {
      return { success: false };
    }
  },

  // Cambiar contraseña
  async changePassword(passwordActual, passwordNueva) {
    try {
      const response = await api.post('/auth/change-password', {
        passwordActual,
        passwordNueva,
      });

      return {
        success: response.data.status === 'success',
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al cambiar contraseña',
      };
    }
  },

  // Verificar si hay token
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener usuario desde localStorage
  getStoredUser() {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },
};

export default authService;
