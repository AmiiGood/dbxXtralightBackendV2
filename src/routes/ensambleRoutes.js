const express = require("express");
const router = express.Router();
const ensambleController = require("../controllers/ensambleController");
const { authenticate, verificarPermiso } = require("../middlewares/auth");
const { validationResult } = require("express-validator");
const {
  createProduccionValidation,
  updateProduccionValidation,
  getProduccionValidation,
  getResumenValidation,
} = require("../validators/ensambleValidator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Errores de validación",
      errors: errors.array(),
    });
  }
  next();
};

router.use(authenticate);

// GET /api/ensamble/buscar-sku?sku=XXXX  — cualquier usuario autenticado
router.get("/buscar-sku", ensambleController.buscarSku);

// GET /api/ensamble/resumen
router.get(
  "/resumen",
  verificarPermiso("Reportes de Calidad", "leer"),
  getResumenValidation,
  handleValidationErrors,
  ensambleController.getResumenPorSku
);

// GET /api/ensamble
router.get(
  "/",
  verificarPermiso("Ensamble", "leer"),
  getProduccionValidation,
  handleValidationErrors,
  ensambleController.getProduccion
);

// GET /api/ensamble/:id
router.get(
  "/:id",
  verificarPermiso("Ensamble", "leer"),
  ensambleController.getProduccionById
);

// POST /api/ensamble
router.post(
  "/",
  verificarPermiso("Ensamble", "crear"),
  createProduccionValidation,
  handleValidationErrors,
  ensambleController.createProduccion
);

// PUT /api/ensamble/:id
router.put(
  "/:id",
  verificarPermiso("Ensamble", "editar"),
  updateProduccionValidation,
  handleValidationErrors,
  ensambleController.updateProduccion
);

// DELETE /api/ensamble/:id
router.delete(
  "/:id",
  verificarPermiso("Ensamble", "eliminar"),
  ensambleController.deleteProduccion
);

module.exports = router;
