import api from './api';

const defectoService = {
  // Obtener catálogos (turnos, áreas, tipos de defecto)
  async getCatalogos() {
    try {
      const response = await api.get('/defectos/catalogos');
      return {
        success: response.data.status === 'success',
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener catálogos',
      };
    }
  },

  // Obtener turno actual
  async getTurnoActual() {
    try {
      const response = await api.get('/defectos/turno-actual');
      return {
        success: response.data.status === 'success',
        data: response.data.data.turno,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener turno actual',
      };
    }
  },

  // Listar registros de defectos con filtros
  async getDefectos(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.fechaInicio) params.append('fechaInicio', filters.fechaInicio);
      if (filters.fechaFin) params.append('fechaFin', filters.fechaFin);
      if (filters.turnoId) params.append('turnoId', filters.turnoId);
      if (filters.areaProduccionId) params.append('areaProduccionId', filters.areaProduccionId);
      if (filters.tipoDefectoId) params.append('tipoDefectoId', filters.tipoDefectoId);
      if (filters.registradoPor) params.append('registradoPor', filters.registradoPor);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);
      if (filters.orderBy) params.append('orderBy', filters.orderBy);
      if (filters.orderDir) params.append('orderDir', filters.orderDir);

      const response = await api.get(`/defectos?${params.toString()}`);
      return {
        success: response.data.status === 'success',
        data: response.data.data.registros,
        total: response.data.data.total,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener defectos',
      };
    }
  },

  // Obtener registro por ID
  async getDefecto(id) {
    try {
      const response = await api.get(`/defectos/${id}`);
      return {
        success: response.data.status === 'success',
        data: response.data.data.registro,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener defecto',
      };
    }
  },

  // Crear nuevo registro
  async createDefecto(defecto) {
    try {
      const response = await api.post('/defectos', defecto);
      return {
        success: response.data.status === 'success',
        data: response.data.data.registro,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al crear registro',
        errors: error.response?.data?.errors,
      };
    }
  },

  // Actualizar registro
  async updateDefecto(id, defecto) {
    try {
      const response = await api.put(`/defectos/${id}`, defecto);
      return {
        success: response.data.status === 'success',
        data: response.data.data.registro,
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al actualizar registro',
        errors: error.response?.data?.errors,
      };
    }
  },

  // Eliminar registro
  async deleteDefecto(id) {
    try {
      const response = await api.delete(`/defectos/${id}`);
      return {
        success: response.data.status === 'success',
        message: response.data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al eliminar registro',
      };
    }
  },

  // Obtener resumen por turno
  async getResumenTurno(fechaInicio, fechaFin) {
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);

      const response = await api.get(`/defectos/resumen-turno?${params.toString()}`);
      return {
        success: response.data.status === 'success',
        data: response.data.data.resumen,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener resumen',
      };
    }
  },

  // Obtener top defectos
  async getTopDefectos(limit = 10, fechaInicio, fechaFin) {
    try {
      const params = new URLSearchParams();
      params.append('limit', limit);
      if (fechaInicio) params.append('fechaInicio', fechaInicio);
      if (fechaFin) params.append('fechaFin', fechaFin);

      const response = await api.get(`/defectos/top-defectos?${params.toString()}`);
      return {
        success: response.data.status === 'success',
        data: response.data.data.topDefectos,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al obtener top defectos',
      };
    }
  },
};

export default defectoService;
