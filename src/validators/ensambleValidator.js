const { body, query } = require("express-validator");

const createProduccionValidation = [
  body("turnoId")
    .notEmpty().withMessage("El turno es requerido")
    .isInt({ min: 1 }).withMessage("turnoId debe ser entero positivo"),

  body("areaProduccionId")
    .notEmpty().withMessage("El área de producción es requerida")
    .isInt({ min: 1 }).withMessage("areaProduccionId debe ser entero positivo"),

  body("sku")
    .notEmpty().withMessage("El SKU es requerido")
    .isString().withMessage("El SKU debe ser texto")
    .isLength({ max: 100 }).withMessage("SKU máximo 100 caracteres"),

  body("paresProducidos")
    .notEmpty().withMessage("Los pares producidos son requeridos")
    .isInt({ min: 1 }).withMessage("paresProducidos debe ser entero positivo"),

  body("fechaProduccion")
    .notEmpty().withMessage("La fecha de producción es requerida")
    .isDate().withMessage("fechaProduccion debe ser una fecha válida (YYYY-MM-DD)"),
];

const updateProduccionValidation = [
  body("turnoId")
    .optional()
    .isInt({ min: 1 }).withMessage("turnoId debe ser entero positivo"),

  body("areaProduccionId")
    .optional()
    .isInt({ min: 1 }).withMessage("areaProduccionId debe ser entero positivo"),

  body("sku")
    .optional()
    .isString().withMessage("El SKU debe ser texto")
    .isLength({ max: 100 }).withMessage("SKU máximo 100 caracteres"),

  body("paresProducidos")
    .optional()
    .isInt({ min: 1 }).withMessage("paresProducidos debe ser entero positivo"),

  body("fechaProduccion")
    .optional()
    .isDate().withMessage("fechaProduccion debe ser una fecha válida (YYYY-MM-DD)"),
];

const getProduccionValidation = [
  query("fechaInicio").optional().isISO8601().withMessage("Fecha inválida"),
  query("fechaFin").optional().isISO8601().withMessage("Fecha inválida"),
  query("turnoId").optional().isInt({ min: 1 }).withMessage("turnoId debe ser entero positivo"),
  query("areaProduccionId").optional().isInt({ min: 1 }).withMessage("areaProduccionId debe ser entero positivo"),
  query("sku").optional().isString(),
  query("limit").optional().isInt({ min: 1, max: 500 }).withMessage("limit entre 1 y 500"),
  query("offset").optional().isInt({ min: 0 }).withMessage("offset debe ser >= 0"),
];

const getResumenValidation = [
  query("fechaInicio").notEmpty().withMessage("fechaInicio es requerida").isISO8601().withMessage("Fecha inválida"),
  query("fechaFin").notEmpty().withMessage("fechaFin es requerida").isISO8601().withMessage("Fecha inválida"),
  query("turnoId").optional().isInt({ min: 1 }),
  query("sku").optional().isString(),
];

module.exports = {
  createProduccionValidation,
  updateProduccionValidation,
  getProduccionValidation,
  getResumenValidation,
};
