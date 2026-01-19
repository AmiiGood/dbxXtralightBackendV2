import api from './api';

const usuarioService = {
  // Obtener todos los roles
  async getRoles() {
    try {
      const response = await api.get('/usuarios/roles');
      return {
        success: response.data.status === 'success',
        data: response.data.data.roles,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener roles',
      };
    }
  },

  // Obtener todas las áreas
  async getAreas() {
    try {
      const response = await api.get('/usuarios/areas');
      return {
        success: response.data.status === 'success',
        data: response.data.data.areas,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener áreas',
      };
    }
  },

  // Listar usuarios con filtros
  async getUsuarios(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.activo !== undefined) params.append('activo', filters.activo);
      if (filters.rolId) params.append('rolId', filters.rolId);
      if (filters.areaId) params.append('areaId', filters.areaId);

      const response = await api.get(`/usuarios?${params.toString()}`);
      return {
        success: response.data.status === 'success',
        data: response.data.data.usuarios,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener usuarios',
      };
    }
  },

  // Obtener usuario por ID
  async getUsuario(id) {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return {
        success: response.data.status === 'success',
        data: response.data.data.usuario,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener usuario',
      };
    }
  },

  // Crear nuevo usuario
  async createUsuario(usuario) {
    try {
      const response = await api.post('/usuarios', usuario);
      return {
        success: response.data.status === 'success',
        data: response.data.data.usuario,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear usuario',
        errors: error.response?.data?.errors,
      };
    }
  },

  // Actualizar usuario
  async updateUsuario(id, usuario) {
    try {
      const response = await api.put(`/usuarios/${id}`, usuario);
      return {
        success: response.data.status === 'success',
        data: response.data.data.usuario,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar usuario',
        errors: error.response?.data?.errors,
      };
    }
  },

  // Activar usuario
  async activarUsuario(id) {
    try {
      const response = await api.patch(`/usuarios/${id}/activar`);
      return {
        success: response.data.status === 'success',
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al activar usuario',
      };
    }
  },

  // Desactivar usuario
  async desactivarUsuario(id) {
    try {
      const response = await api.patch(`/usuarios/${id}/desactivar`);
      return {
        success: response.data.status === 'success',
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al desactivar usuario',
      };
    }
  },

  // Resetear contraseña
  async resetPassword(id, nuevaPassword) {
    try {
      const response = await api.post(`/usuarios/${id}/reset-password`, {
        nuevaPassword,
      });
      return {
        success: response.data.status === 'success',
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al resetear contraseña',
      };
    }
  },
};

export default usuarioService;
