const db = require("../config/database");

class RegistroDefecto {
  static async create(data) {
    const {
      turnoId,
      areaProduccionId,
      tipoDefectoId,
      paresRechazados,
      observaciones,
      registradoPor,
      sku,
    } = data;

    const query = `
      INSERT INTO registros_defectos (
        turno_id, area_produccion_id, tipo_defecto_id,
        pares_rechazados, observaciones, registrado_por, sku
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING 
        id, turno_id, area_produccion_id, tipo_defecto_id,
        pares_rechazados, observaciones, fecha_registro, registrado_por, sku
    `;

    const values = [
      turnoId, areaProduccionId, tipoDefectoId,
      paresRechazados, observaciones || null, registradoPor, sku || null,
    ];

    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT 
        rd.id,
        rd.turno_id,
        t.nombre as turno,
        rd.area_produccion_id,
        ap.nombre as area_produccion,
        rd.tipo_defecto_id,
        td.nombre as tipo_defecto,
        rd.pares_rechazados,
        rd.observaciones,
        rd.fecha_registro,
        rd.registrado_por,
        u.nombre_completo as registrado_por_nombre,
        rd.sku
      FROM registros_defectos rd
      LEFT JOIN turnos t ON rd.turno_id = t.id
      LEFT JOIN areas_produccion ap ON rd.area_produccion_id = ap.id
      LEFT JOIN tipos_defectos td ON rd.tipo_defecto_id = td.id
      LEFT JOIN usuarios u ON rd.registrado_por = u.id
      WHERE 1=1
    `;

    const values = [];
    let paramCount = 1;

    if (filters.fechaInicio) {
      query += ` AND rd.fecha_registro >= $${paramCount}`;
      values.push(filters.fechaInicio);
      paramCount++;
    }
    if (filters.fechaFin) {
      query += ` AND rd.fecha_registro <= $${paramCount}`;
      values.push(filters.fechaFin);
      paramCount++;
    }
    if (filters.turnoId) {
      query += ` AND rd.turno_id = $${paramCount}`;
      values.push(filters.turnoId);
      paramCount++;
    }
    if (filters.areaProduccionId) {
      query += ` AND rd.area_produccion_id = $${paramCount}`;
      values.push(filters.areaProduccionId);
      paramCount++;
    }
    if (filters.tipoDefectoId) {
      query += ` AND rd.tipo_defecto_id = $${paramCount}`;
      values.push(filters.tipoDefectoId);
      paramCount++;
    }
    if (filters.registradoPor) {
      query += ` AND rd.registrado_por = $${paramCount}`;
      values.push(filters.registradoPor);
      paramCount++;
    }

    const orderByMap = {
      fecha_registro: "rd.fecha_registro",
      pares_rechazados: "rd.pares_rechazados",
      turno_nombre: "t.nombre",
      tipo_defecto_nombre: "td.nombre",
    };
    const orderBy = orderByMap[filters.orderBy] || "rd.fecha_registro";
    const orderDir = filters.orderDir === "ASC" ? "ASC" : "DESC";
    query += ` ORDER BY ${orderBy} ${orderDir}`;

    if (filters.limit) {
      query += ` LIMIT $${paramCount}`;
      values.push(filters.limit);
      paramCount++;
    }
    if (filters.offset !== undefined && filters.offset !== null) {
      query += ` OFFSET $${paramCount}`;
      values.push(filters.offset);
      paramCount++;
    }

    const result = await db.query(query, values);
    return result.rows;
  }

  static async count(filters = {}) {
    let query = `SELECT COUNT(*) as total FROM registros_defectos rd WHERE 1=1`;
    const values = [];
    let paramCount = 1;

    if (filters.fechaInicio) { query += ` AND rd.fecha_registro >= $${paramCount}`; values.push(filters.fechaInicio); paramCount++; }
    if (filters.fechaFin)    { query += ` AND rd.fecha_registro <= $${paramCount}`; values.push(filters.fechaFin); paramCount++; }
    if (filters.turnoId)     { query += ` AND rd.turno_id = $${paramCount}`; values.push(filters.turnoId); paramCount++; }
    if (filters.areaProduccionId) { query += ` AND rd.area_produccion_id = $${paramCount}`; values.push(filters.areaProduccionId); paramCount++; }
    if (filters.tipoDefectoId)    { query += ` AND rd.tipo_defecto_id = $${paramCount}`; values.push(filters.tipoDefectoId); paramCount++; }
    if (filters.registradoPor)    { query += ` AND rd.registrado_por = $${paramCount}`; values.push(filters.registradoPor); paramCount++; }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].total);
  }

  static async findById(id) {
    const query = `
      SELECT 
        rd.id, rd.turno_id,
        t.nombre as turno, t.nombre as turno_nombre,
        rd.area_produccion_id,
        ap.nombre as area_produccion, ap.nombre as area_produccion_nombre,
        rd.tipo_defecto_id,
        td.nombre as tipo_defecto, td.nombre as tipo_defecto_nombre,
        rd.pares_rechazados, rd.observaciones, rd.fecha_registro,
        rd.registrado_por, u.nombre_completo as registrado_por_nombre,
        rd.sku
      FROM registros_defectos rd
      LEFT JOIN turnos t ON rd.turno_id = t.id
      LEFT JOIN areas_produccion ap ON rd.area_produccion_id = ap.id
      LEFT JOIN tipos_defectos td ON rd.tipo_defecto_id = td.id
      LEFT JOIN usuarios u ON rd.registrado_por = u.id
      WHERE rd.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (data.turnoId !== undefined)          { fields.push(`turno_id = $${paramCount}`); values.push(data.turnoId); paramCount++; }
    if (data.areaProduccionId !== undefined) { fields.push(`area_produccion_id = $${paramCount}`); values.push(data.areaProduccionId); paramCount++; }
    if (data.tipoDefectoId !== undefined)    { fields.push(`tipo_defecto_id = $${paramCount}`); values.push(data.tipoDefectoId); paramCount++; }
    if (data.paresRechazados !== undefined)  { fields.push(`pares_rechazados = $${paramCount}`); values.push(data.paresRechazados); paramCount++; }
    if (data.observaciones !== undefined)    { fields.push(`observaciones = $${paramCount}`); values.push(data.observaciones); paramCount++; }
    if (data.sku !== undefined)              { fields.push(`sku = $${paramCount}`); values.push(data.sku || null); paramCount++; }

    if (fields.length === 0) throw new Error("No hay campos para actualizar");

    values.push(id);
    const query = `
      UPDATE registros_defectos 
      SET ${fields.join(", ")}
      WHERE id = $${paramCount}
      RETURNING id, turno_id, area_produccion_id, tipo_defecto_id,
                pares_rechazados, observaciones, fecha_registro, sku
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(`DELETE FROM registros_defectos WHERE id = $1 RETURNING id`, [id]);
    return result.rows[0];
  }

  static async getResumenPorTurno(fechaInicio, fechaFin) {
    const query = `
      SELECT 
        t.nombre as turno,
        DATE(rd.fecha_registro) as fecha,
        COUNT(*) as total_registros,
        SUM(rd.pares_rechazados) as total_pares_rechazados
      FROM registros_defectos rd
      JOIN turnos t ON rd.turno_id = t.id
      WHERE rd.fecha_registro >= $1 AND rd.fecha_registro <= $2
      GROUP BY t.nombre, DATE(rd.fecha_registro)
      ORDER BY fecha DESC, turno ASC
    `;
    const result = await db.query(query, [fechaInicio, fechaFin]);
    return result.rows;
  }

  static async getTopDefectos(limit = 10, fechaInicio = null, fechaFin = null) {
    let query = `
      SELECT 
        td.id, td.nombre as defecto,
        COUNT(rd.id) as total_registros,
        SUM(rd.pares_rechazados) as total_pares_rechazados
      FROM registros_defectos rd
      JOIN tipos_defectos td ON rd.tipo_defecto_id = td.id
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (fechaInicio) { query += ` AND rd.fecha_registro >= $${paramCount}`; values.push(fechaInicio); paramCount++; }
    if (fechaFin)    { query += ` AND rd.fecha_registro <= $${paramCount}`; values.push(fechaFin); paramCount++; }

    query += ` GROUP BY td.id, td.nombre ORDER BY total_pares_rechazados DESC, total_registros DESC LIMIT $${paramCount}`;
    values.push(limit);

    const result = await db.query(query, values);
    return result.rows;
  }
}

module.exports = RegistroDefecto;
