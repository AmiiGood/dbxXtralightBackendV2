const db = require("../config/database");

class RegistroDefecto {
  /**
   * Crear un nuevo registro de defecto
   */
  static async create(data) {
    const {
      turnoId,
      areaProduccionId,
      tipoDefectoId,
      paresRechazados,
      observaciones,
      registradoPor,
    } = data;

    const query = `
      INSERT INTO registros_defectos (
        turno_id,
        area_produccion_id,
        tipo_defecto_id,
        pares_rechazados,
        observaciones,
        registrado_por
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id, 
        turno_id, 
        area_produccion_id, 
        tipo_defecto_id, 
        pares_rechazados, 
        observaciones, 
        fecha_registro,
        registrado_por
    `;

    const values = [
      turnoId,
      areaProduccionId,
      tipoDefectoId,
      paresRechazados,
      observaciones || null,
      registradoPor,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Obtener todos los registros con filtros
   */
  static async findAll(filters = {}) {
    let query = `
      SELECT * FROM vista_registros_defectos
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    // Filtro por fecha inicio
    if (filters.fechaInicio) {
      query += ` AND fecha_registro >= $${paramCount}`;
      values.push(filters.fechaInicio);
      paramCount++;
    }

    // Filtro por fecha fin
    if (filters.fechaFin) {
      query += ` AND fecha_registro <= $${paramCount}`;
      values.push(filters.fechaFin);
      paramCount++;
    }

    // Filtro por turno
    if (filters.turnoId) {
      query += ` AND turno_id = $${paramCount}`;
      values.push(filters.turnoId);
      paramCount++;
    }

    // Filtro por área de producción
    if (filters.areaProduccionId) {
      query += ` AND area_produccion_id = $${paramCount}`;
      values.push(filters.areaProduccionId);
      paramCount++;
    }

    // Filtro por tipo de defecto
    if (filters.tipoDefectoId) {
      query += ` AND tipo_defecto_id = $${paramCount}`;
      values.push(filters.tipoDefectoId);
      paramCount++;
    }

    // Filtro por usuario que registró
    if (filters.registradoPor) {
      query += ` AND registrado_por = $${paramCount}`;
      values.push(filters.registradoPor);
      paramCount++;
    }

    // Ordenamiento
    const orderBy = filters.orderBy || "fecha_registro";
    const orderDir = filters.orderDir || "DESC";
    query += ` ORDER BY ${orderBy} ${orderDir}`;

    // Paginación
    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }

    if (filters.offset) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
      paramCount++;
    }

    const result = await db.query(query, values);
    return result.rows;
  }

  /**
   * Contar registros con filtros (para paginación)
   */
  static async count(filters = {}) {
    let query = `
      SELECT COUNT(*) as total
      FROM registros_defectos
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.fechaInicio) {
      query += ` AND fecha_registro >= $${paramCount}`;
      values.push(filters.fechaInicio);
      paramCount++;
    }

    if (filters.fechaFin) {
      query += ` AND fecha_registro <= $${paramCount}`;
      values.push(filters.fechaFin);
      paramCount++;
    }

    if (filters.turnoId) {
      query += ` AND turno_id = $${paramCount}`;
      values.push(filters.turnoId);
      paramCount++;
    }

    if (filters.areaProduccionId) {
      query += ` AND area_produccion_id = $${paramCount}`;
      values.push(filters.areaProduccionId);
      paramCount++;
    }

    if (filters.tipoDefectoId) {
      query += ` AND tipo_defecto_id = $${paramCount}`;
      values.push(filters.tipoDefectoId);
      paramCount++;
    }

    if (filters.registradoPor) {
      query += ` AND registrado_por = $${paramCount}`;
      values.push(filters.registradoPor);
      paramCount++;
    }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].total);
  }

  /**
   * Obtener registro por ID
   */
  static async findById(id) {
    const query = `
      SELECT * FROM vista_registros_defectos
      WHERE id = $1
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Actualizar registro de defecto
   */
  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.turnoId !== undefined) {
      fields.push(`turno_id = $${paramCount}`);
      values.push(data.turnoId);
      paramCount++;
    }

    if (data.areaProduccionId !== undefined) {
      fields.push(`area_produccion_id = $${paramCount}`);
      values.push(data.areaProduccionId);
      paramCount++;
    }

    if (data.tipoDefectoId !== undefined) {
      fields.push(`tipo_defecto_id = $${paramCount}`);
      values.push(data.tipoDefectoId);
      paramCount++;
    }

    if (data.paresRechazados !== undefined) {
      fields.push(`pares_rechazados = $${paramCount}`);
      values.push(data.paresRechazados);
      paramCount++;
    }

    if (data.observaciones !== undefined) {
      fields.push(`observaciones = $${paramCount}`);
      values.push(data.observaciones);
      paramCount++;
    }

    if (fields.length === 0) {
      throw new Error("No hay campos para actualizar");
    }

    values.push(id);
    const query = `
      UPDATE registros_defectos 
      SET ${fields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, turno_id, area_produccion_id, tipo_defecto_id, 
                pares_rechazados, observaciones, fecha_registro
    `;

    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Eliminar registro de defecto
   */
  static async delete(id) {
    const query = `
      DELETE FROM registros_defectos
      WHERE id = $1
      RETURNING id
    `;

    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Obtener resumen por turno
   */
  static async getResumenPorTurno(fechaInicio, fechaFin) {
    const query = `
      SELECT 
        turno,
        fecha,
        total_registros,
        total_pares_rechazados
      FROM vista_resumen_defectos_turno
      WHERE fecha >= $1 AND fecha <= $2
      ORDER BY fecha DESC, turno ASC
    `;

    const result = await db.query(query, [fechaInicio, fechaFin]);
    return result.rows;
  }

  /**
   * Obtener top defectos más frecuentes
   */
  static async getTopDefectos(limit = 10, fechaInicio = null, fechaFin = null) {
    let query = `
      SELECT 
        td.id,
        td.nombre as defecto,
        COUNT(rd.id) as total_registros,
        SUM(rd.pares_rechazados) as total_pares_rechazados
      FROM registros_defectos rd
      JOIN tipos_defectos td ON rd.tipo_defecto_id = td.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (fechaInicio) {
      query += ` AND rd.fecha_registro >= $${paramCount}`;
      values.push(fechaInicio);
      paramCount++;
    }

    if (fechaFin) {
      query += ` AND rd.fecha_registro <= $${paramCount}`;
      values.push(fechaFin);
      paramCount++;
    }

    query += `
      GROUP BY td.id, td.nombre
      ORDER BY total_pares_rechazados DESC, total_registros DESC
      LIMIT $${paramCount}
    `;
    values.push(limit);

    const result = await db.query(query, values);
    return result.rows;
  }
}

module.exports = RegistroDefecto;
