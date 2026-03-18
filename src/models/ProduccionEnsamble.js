const db = require("../config/database");

class ProduccionEnsamble {
  static async create(data) {
    const { turnoId, areaProduccionId, sku, paresProducidos, fechaProduccion, registradoPor } = data;

    const query = `
      INSERT INTO produccion_ensamble (
        turno_id, area_produccion_id, sku,
        pares_producidos, fecha_produccion, registrado_por
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;

    const result = await db.query(query, [
      turnoId, areaProduccionId, sku,
      paresProducidos, fechaProduccion, registradoPor,
    ]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT
        pe.id,
        pe.turno_id,
        t.nombre AS turno,
        pe.area_produccion_id,
        ap.nombre AS area_produccion,
        pe.sku,
        pc.style_name,
        pc.color,
        pc.size,
        pe.pares_producidos,
        COALESCE(SUM(rd.pares_rechazados), 0)::INT AS pares_defectivos,
        (pe.pares_producidos - COALESCE(SUM(rd.pares_rechazados), 0))::INT AS pares_buenos,
        pe.fecha_produccion,
        pe.fecha_registro,
        pe.registrado_por,
        u.nombre_completo AS registrado_por_nombre
      FROM produccion_ensamble pe
      LEFT JOIN turnos t ON pe.turno_id = t.id
      LEFT JOIN areas_produccion ap ON pe.area_produccion_id = ap.id
      LEFT JOIN productos_crocs pc ON pe.sku = pc.sku
      LEFT JOIN usuarios u ON pe.registrado_por = u.id
      LEFT JOIN registros_defectos rd
        ON rd.sku = pe.sku
        AND rd.turno_id = pe.turno_id
        AND DATE(rd.fecha_registro) = pe.fecha_produccion
      WHERE 1=1
    `;

    const values = [];
    let p = 1;

    if (filters.fechaInicio) {
      query += ` AND pe.fecha_produccion >= $${p}`;
      values.push(filters.fechaInicio); p++;
    }
    if (filters.fechaFin) {
      query += ` AND pe.fecha_produccion <= $${p}`;
      values.push(filters.fechaFin); p++;
    }
    if (filters.turnoId) {
      query += ` AND pe.turno_id = $${p}`;
      values.push(filters.turnoId); p++;
    }
    if (filters.areaProduccionId) {
      query += ` AND pe.area_produccion_id = $${p}`;
      values.push(filters.areaProduccionId); p++;
    }
    if (filters.sku) {
      query += ` AND pe.sku ILIKE $${p}`;
      values.push(`%${filters.sku}%`); p++;
    }

    query += ` GROUP BY pe.id, t.nombre, ap.nombre, pc.style_name, pc.color, pc.size, u.nombre_completo`;
    query += ` ORDER BY pe.fecha_produccion DESC, pe.fecha_registro DESC`;

    if (filters.limit) {
      query += ` LIMIT $${p}`; values.push(filters.limit); p++;
    }
    if (filters.offset !== undefined && filters.offset !== null) {
      query += ` OFFSET $${p}`; values.push(filters.offset); p++;
    }

    const result = await db.query(query, values);
    return result.rows;
  }

  static async count(filters = {}) {
    let query = `SELECT COUNT(*) AS total FROM produccion_ensamble pe WHERE 1=1`;
    const values = [];
    let p = 1;

    if (filters.fechaInicio) { query += ` AND pe.fecha_produccion >= $${p}`; values.push(filters.fechaInicio); p++; }
    if (filters.fechaFin)    { query += ` AND pe.fecha_produccion <= $${p}`; values.push(filters.fechaFin);    p++; }
    if (filters.turnoId)     { query += ` AND pe.turno_id = $${p}`;          values.push(filters.turnoId);     p++; }
    if (filters.areaProduccionId) { query += ` AND pe.area_produccion_id = $${p}`; values.push(filters.areaProduccionId); p++; }
    if (filters.sku)         { query += ` AND pe.sku ILIKE $${p}`;           values.push(`%${filters.sku}%`); p++; }

    const result = await db.query(query, values);
    return parseInt(result.rows[0].total);
  }

  static async findById(id) {
    const query = `
      SELECT
        pe.id,
        pe.turno_id,
        t.nombre AS turno,
        pe.area_produccion_id,
        ap.nombre AS area_produccion,
        pe.sku,
        pc.style_name,
        pc.color,
        pc.size,
        pe.pares_producidos,
        COALESCE(SUM(rd.pares_rechazados), 0)::INT AS pares_defectivos,
        (pe.pares_producidos - COALESCE(SUM(rd.pares_rechazados), 0))::INT AS pares_buenos,
        pe.fecha_produccion,
        pe.fecha_registro,
        pe.registrado_por,
        u.nombre_completo AS registrado_por_nombre
      FROM produccion_ensamble pe
      LEFT JOIN turnos t ON pe.turno_id = t.id
      LEFT JOIN areas_produccion ap ON pe.area_produccion_id = ap.id
      LEFT JOIN productos_crocs pc ON pe.sku = pc.sku
      LEFT JOIN usuarios u ON pe.registrado_por = u.id
      LEFT JOIN registros_defectos rd
        ON rd.sku = pe.sku
        AND rd.turno_id = pe.turno_id
        AND DATE(rd.fecha_registro) = pe.fecha_produccion
      WHERE pe.id = $1
      GROUP BY pe.id, t.nombre, ap.nombre, pc.style_name, pc.color, pc.size, u.nombre_completo
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, data) {
    const fields = [];
    const values = [];
    let p = 1;

    if (data.turnoId !== undefined)         { fields.push(`turno_id = $${p}`);          values.push(data.turnoId);          p++; }
    if (data.areaProduccionId !== undefined) { fields.push(`area_produccion_id = $${p}`); values.push(data.areaProduccionId); p++; }
    if (data.sku !== undefined)             { fields.push(`sku = $${p}`);               values.push(data.sku);              p++; }
    if (data.paresProducidos !== undefined)  { fields.push(`pares_producidos = $${p}`);  values.push(data.paresProducidos);  p++; }
    if (data.fechaProduccion !== undefined)  { fields.push(`fecha_produccion = $${p}`);  values.push(data.fechaProduccion);  p++; }

    if (fields.length === 0) throw new Error("No hay campos para actualizar");

    values.push(id);
    const query = `
      UPDATE produccion_ensamble SET ${fields.join(", ")}
      WHERE id = $${p}
      RETURNING *
    `;
    const result = await db.query(query, values);
    return result.rows[0];
  }

  static async delete(id) {
    const result = await db.query(
      `DELETE FROM produccion_ensamble WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }

  /**
   * Resumen agrupado por SKU para un rango de fechas/turno
   * Útil para reportes
   */
  static async getResumenPorSku(filters = {}) {
    let query = `
      SELECT
        pe.sku,
        pc.style_name,
        pc.color,
        pc.size,
        t.nombre AS turno,
        pe.fecha_produccion,
        SUM(pe.pares_producidos)::INT AS total_producidos,
        COALESCE(SUM(rd.pares_rechazados), 0)::INT AS total_defectivos,
        (SUM(pe.pares_producidos) - COALESCE(SUM(rd.pares_rechazados), 0))::INT AS total_buenos
      FROM produccion_ensamble pe
      LEFT JOIN turnos t ON pe.turno_id = t.id
      LEFT JOIN productos_crocs pc ON pe.sku = pc.sku
      LEFT JOIN registros_defectos rd
        ON rd.sku = pe.sku
        AND rd.turno_id = pe.turno_id
        AND DATE(rd.fecha_registro) = pe.fecha_produccion
      WHERE 1=1
    `;

    const values = [];
    let p = 1;

    if (filters.fechaInicio) { query += ` AND pe.fecha_produccion >= $${p}`; values.push(filters.fechaInicio); p++; }
    if (filters.fechaFin)    { query += ` AND pe.fecha_produccion <= $${p}`; values.push(filters.fechaFin);    p++; }
    if (filters.turnoId)     { query += ` AND pe.turno_id = $${p}`;          values.push(filters.turnoId);     p++; }
    if (filters.sku)         { query += ` AND pe.sku ILIKE $${p}`;           values.push(`%${filters.sku}%`); p++; }

    query += ` GROUP BY pe.sku, pc.style_name, pc.color, pc.size, t.nombre, pe.fecha_produccion`;
    query += ` ORDER BY pe.fecha_produccion DESC, total_producidos DESC`;

    const result = await db.query(query, values);
    return result.rows;
  }
}

module.exports = ProduccionEnsamble;
