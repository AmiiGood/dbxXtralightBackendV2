import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Crear instancia de axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('📤 Request a:', config.url);
      console.log('🎫 Token enviado:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ Request sin token a:', config.url);
    }
    return config;
  },
  (error) => {
    console.error('❌ Error en request interceptor:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    console.log('📥 Response exitoso de:', response.config.url);
    return response;
  },
  (error) => {
    console.error('📥 Response con error de:', error.config?.url);
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);

    // Si el token expiró o no es válido, redirigir al login
    if (error.response && error.response.status === 401) {
      console.log('🚫 Error 401 - Limpiando sesión y redirigiendo...');
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      // Evitar redirección infinita si ya estamos en login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
