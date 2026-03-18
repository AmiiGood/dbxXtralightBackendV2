const ProduccionEnsamble = require("../models/ProduccionEnsamble");
const Turno = require("../models/Turno");
const AreaProduccion = require("../models/AreaProduccion");
const ProductoCrocs = require("../models/ProductoCrocs");
const { catchAsync, sendSuccess, AppError } = require("../utils/errorHandler");
const { registrarLog, obtenerIP, obtenerUserAgent } = require("../utils/logger");

/**
 * Buscar SKU en catálogo de productos
 * GET /api/ensamble/buscar-sku?q=texto  → búsqueda parcial (autocomplete)
 * GET /api/ensamble/buscar-sku?sku=XXXX → match exacto
 */
const buscarSku = catchAsync(async (req, res, next) => {
  const { sku, q } = req.query;

  if (!sku && !q) return next(new AppError("Se requiere el parámetro 'sku' o 'q'", 400));

  if (sku) {
    const producto = await ProductoCrocs.findBySku(sku.trim().toUpperCase());
    return sendSuccess(res, 200, { producto: producto || null });
  }

  // Búsqueda parcial — findAll ya tiene ILIKE en sku, upc, style_name, style_no
  const productos = await ProductoCrocs.findAll({ search: q.trim(), activo: true, limit: 10 });
  sendSuccess(res, 200, { productos });
});

const createProduccion = catchAsync(async (req, res, next) => {
  const { turnoId, areaProduccionId, sku, paresProducidos, fechaProduccion } = req.body;

  const [turno, area, producto] = await Promise.all([
    Turno.findById(turnoId),
    AreaProduccion.findById(areaProduccionId),
    ProductoCrocs.findBySku(sku),
  ]);

  if (!turno)    return next(new AppError("El turno especificado no existe", 400));
  if (!area)     return next(new AppError("El área de producción no existe", 400));
  if (!producto) return next(new AppError("El SKU no existe en el catálogo", 400));

  const nuevo = await ProduccionEnsamble.create({
    turnoId,
    areaProduccionId,
    sku,
    paresProducidos,
    fechaProduccion,
    registradoPor: req.usuario.id,
  });

  await registrarLog({
    usuarioId: req.usuario.id,
    accion: "CREATE",
    modulo: "Ensamble - Producción",
    tablaAfectada: "produccion_ensamble",
    registroId: nuevo.id,
    descripcion: `Producción registrada: SKU ${sku} - ${paresProducidos} pares`,
    ipAddress: obtenerIP(req),
    userAgent: obtenerUserAgent(req),
    datosNuevos: { turno: turno.nombre, area: area.nombre, sku, paresProducidos, fechaProduccion },
  });

  const completo = await ProduccionEnsamble.findById(nuevo.id);
  sendSuccess(res, 201, { produccion: completo }, "Producción registrada exitosamente");
});

const getProduccion = catchAsync(async (req, res, next) => {
  const { fechaInicio, fechaFin, turnoId, areaProduccionId, sku, limit = 50, offset = 0 } = req.query;

  const filters = {
    fechaInicio,
    fechaFin,
    turnoId:          turnoId          ? parseInt(turnoId)          : undefined,
    areaProduccionId: areaProduccionId ? parseInt(areaProduccionId) : undefined,
    sku,
    limit:  parseInt(limit),
    offset: parseInt(offset),
  };

  const [registros, total] = await Promise.all([
    ProduccionEnsamble.findAll(filters),
    ProduccionEnsamble.count(filters),
  ]);

  sendSuccess(res, 200, {
    registros,
    pagination: {
      total,
      limit: filters.limit,
      offset: filters.offset,
      pages: Math.ceil(total / filters.limit),
    },
  });
});

const getProduccionById = catchAsync(async (req, res, next) => {
  const registro = await ProduccionEnsamble.findById(req.params.id);
  if (!registro) return next(new AppError("Registro de producción no encontrado", 404));
  sendSuccess(res, 200, { produccion: registro });
});

const updateProduccion = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { turnoId, areaProduccionId, sku, paresProducidos, fechaProduccion } = req.body;

  const existente = await ProduccionEnsamble.findById(id);
  if (!existente) return next(new AppError("Registro de producción no encontrado", 404));

  if (turnoId && !(await Turno.findById(turnoId)))
    return next(new AppError("El turno especificado no existe", 400));
  if (areaProduccionId && !(await AreaProduccion.findById(areaProduccionId)))
    return next(new AppError("El área de producción no existe", 400));
  if (sku && !(await ProductoCrocs.findBySku(sku)))
    return next(new AppError("El SKU no existe en el catálogo", 400));

  await ProduccionEnsamble.update(id, { turnoId, areaProduccionId, sku, paresProducidos, fechaProduccion });

  await registrarLog({
    usuarioId: req.usuario.id,
    accion: "UPDATE",
    modulo: "Ensamble - Producción",
    tablaAfectada: "produccion_ensamble",
    registroId: parseInt(id),
    descripcion: `Producción actualizada: ID ${id}`,
    ipAddress: obtenerIP(req),
    userAgent: obtenerUserAgent(req),
    datosAnteriores: { sku: existente.sku, paresProducidos: existente.pares_producidos },
    datosNuevos: { sku, paresProducidos },
  });

  const actualizado = await ProduccionEnsamble.findById(id);
  sendSuccess(res, 200, { produccion: actualizado }, "Producción actualizada exitosamente");
});

const deleteProduccion = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const existente = await ProduccionEnsamble.findById(id);
  if (!existente) return next(new AppError("Registro de producción no encontrado", 404));

  await ProduccionEnsamble.delete(id);

  await registrarLog({
    usuarioId: req.usuario.id,
    accion: "DELETE",
    modulo: "Ensamble - Producción",
    tablaAfectada: "produccion_ensamble",
    registroId: parseInt(id),
    descripcion: `Producción eliminada: SKU ${existente.sku} - ${existente.pares_producidos} pares`,
    ipAddress: obtenerIP(req),
    userAgent: obtenerUserAgent(req),
    datosAnteriores: { sku: existente.sku, paresProducidos: existente.pares_producidos },
  });

  sendSuccess(res, 200, null, "Registro eliminado exitosamente");
});

const getResumenPorSku = catchAsync(async (req, res, next) => {
  const { fechaInicio, fechaFin, turnoId, sku } = req.query;

  if (!fechaInicio || !fechaFin)
    return next(new AppError("Se requieren fechaInicio y fechaFin", 400));

  const resumen = await ProduccionEnsamble.getResumenPorSku({
    fechaInicio,
    fechaFin,
    turnoId: turnoId ? parseInt(turnoId) : undefined,
    sku,
  });

  sendSuccess(res, 200, { resumen });
});

module.exports = {
  buscarSku,
  createProduccion,
  getProduccion,
  getProduccionById,
  updateProduccion,
  deleteProduccion,
  getResumenPorSku,
};
