const Usuario = require("../models/Usuario");
const db = require("../config/database");
const { generateToken } = require("../utils/jwt");
const { catchAsync, sendSuccess, AppError } = require("../utils/errorHandler");
const {
  registrarLog,
  obtenerIP,
  obtenerUserAgent,
} = require("../utils/logger");

/**
 * Login de usuario
 */
const login = catchAsync(async (req, res, next) => {
  const { nombreUsuario, password } = req.body;

  // Validar que se proporcionen credenciales
  if (!nombreUsuario || !password) {
    return next(
      new AppError("Por favor proporciona nombre de usuario y contraseña", 400)
    );
  }

  // Buscar usuario
  const usuario = await Usuario.findByUsername(nombreUsuario);

  if (!usuario) {
    // Registrar intento fallido
    await registrarLog({
      usuarioId: null,
      accion: "LOGIN_FAILED",
      modulo: "Auth",
      descripcion: `Intento de login fallido para usuario: ${nombreUsuario}`,
      ipAddress: obtenerIP(req),
      userAgent: obtenerUserAgent(req),
    });

    return next(new AppError("Credenciales incorrectas", 401));
  }

  // Verificar si el usuario está activo
  if (!usuario.activo) {
    await registrarLog({
      usuarioId: usuario.id,
      accion: "LOGIN_FAILED",
      modulo: "Auth",
      descripcion: "Intento de login con cuenta desactivada",
      ipAddress: obtenerIP(req),
      userAgent: obtenerUserAgent(req),
    });

    return next(
      new AppError(
        "Tu cuenta ha sido desactivada. Contacta al administrador.",
        403
      )
    );
  }

  // Verificar contraseña
  const isPasswordValid = await Usuario.comparePassword(
    password,
    usuario.password_hash
  );

  if (!isPasswordValid) {
    await registrarLog({
      usuarioId: usuario.id,
      accion: "LOGIN_FAILED",
      modulo: "Auth",
      descripcion: "Intento de login con contraseña incorrecta",
      ipAddress: obtenerIP(req),
      userAgent: obtenerUserAgent(req),
    });

    return next(new AppError("Credenciales incorrectas", 401));
  }

  // Actualizar último acceso
  await Usuario.updateLastAccess(usuario.id);

  // Generar token
  const token = generateToken({
    id: usuario.id,
    nombreUsuario: usuario.nombre_usuario,
    rol: usuario.rol_nombre,
  });

  // Registrar login exitoso
  await registrarLog({
    usuarioId: usuario.id,
    accion: "LOGIN_SUCCESS",
    modulo: "Auth",
    descripcion: "Inicio de sesión exitoso",
    ipAddress: obtenerIP(req),
    userAgent: obtenerUserAgent(req),
  });

  // Enviar respuesta (sin incluir el password_hash)
  sendSuccess(
    res,
    200,
    {
      token,
      usuario: {
        id: usuario.id,
        uuid: usuario.uuid,
        nombreUsuario: usuario.nombre_usuario,
        email: usuario.email,
        nombreCompleto: usuario.nombre_completo,
        rol: {
          id: usuario.rol_id,
          nombre: usuario.rol_nombre,
          esAdmin: usuario.es_admin,
        },
        area: {
          id: usuario.area_id,
          nombre: usuario.area_nombre,
        },
      },
    },
    "Inicio de sesión exitoso"
  );
});

/**
 * Obtener información del usuario actual
 */
const getMe = catchAsync(async (req, res, next) => {
  const usuario = await Usuario.findById(req.usuario.id);

  if (!usuario) {
    return next(new AppError("Usuario no encontrado", 404));
  }

  sendSuccess(res, 200, {
    usuario: {
      id: usuario.id,
      uuid: usuario.uuid,
      nombreUsuario: usuario.nombre_usuario,
      email: usuario.email,
      nombreCompleto: usuario.nombre_completo,
      rol: {
        id: usuario.rol_id,
        nombre: usuario.rol_nombre,
        esAdmin: usuario.es_admin,
      },
      area: {
        id: usuario.area_id,
        nombre: usuario.area_nombre,
      },
      ultimoAcceso: usuario.ultimo_acceso,
    },
  });
});

/**
 * Cambiar contraseña del usuario actual
 */
const changePassword = catchAsync(async (req, res, next) => {
  const { passwordActual, passwordNueva } = req.body;

  if (!passwordActual || !passwordNueva) {
    return next(
      new AppError("Debes proporcionar la contraseña actual y la nueva", 400)
    );
  }

  if (passwordNueva.length < 6) {
    return next(
      new AppError("La nueva contraseña debe tener al menos 6 caracteres", 400)
    );
  }

  // Obtener usuario con password
  const usuario = await Usuario.findById(req.usuario.id);

  if (!usuario) {
    return next(new AppError("Usuario no encontrado", 404));
  }

  // Obtener el hash de la contraseña actual
  const result = await db.query(
    "SELECT password_hash FROM usuarios WHERE id = $1",
    [usuario.id]
  );
  const passwordHash = result.rows[0].password_hash;

  // Verificar contraseña actual
  const isPasswordValid = await Usuario.comparePassword(
    passwordActual,
    passwordHash
  );

  if (!isPasswordValid) {
    await registrarLog({
      usuarioId: req.usuario.id,
      accion: "CHANGE_PASSWORD_FAILED",
      modulo: "Auth",
      descripcion:
        "Intento de cambio de contraseña con contraseña actual incorrecta",
      ipAddress: obtenerIP(req),
      userAgent: obtenerUserAgent(req),
    });

    return next(new AppError("La contraseña actual es incorrecta", 401));
  }

  // Actualizar contraseña
  await Usuario.update(req.usuario.id, { password: passwordNueva });

  // Registrar cambio de contraseña
  await registrarLog({
    usuarioId: req.usuario.id,
    accion: "CHANGE_PASSWORD",
    modulo: "Auth",
    descripcion: "Contraseña cambiada exitosamente",
    ipAddress: obtenerIP(req),
    userAgent: obtenerUserAgent(req),
  });

  sendSuccess(res, 200, null, "Contraseña actualizada exitosamente");
});

/**
 * Logout (opcional, principalmente para registrar en logs)
 */
const logout = catchAsync(async (req, res, next) => {
  await registrarLog({
    usuarioId: req.usuario.id,
    accion: "LOGOUT",
    modulo: "Auth",
    descripcion: "Cierre de sesión",
    ipAddress: obtenerIP(req),
    userAgent: obtenerUserAgent(req),
  });

  sendSuccess(res, 200, null, "Sesión cerrada exitosamente");
});

module.exports = {
  login,
  getMe,
  changePassword,
  logout,
};
