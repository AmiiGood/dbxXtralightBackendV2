const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");

// Inicializar app
const app = express();

// Middlewares de seguridad
app.use(helmet()); // Seguridad HTTP headers

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  }),
);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "API de Foam Creations",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "success",
    message: "Server is running",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Rutas de la API
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/usuarios", require("./routes/usuarioRoutes"));
app.use("/api/defectos", require("./routes/defectoRoutes"));
app.use("/api/logs", require("./routes/logRoutes"));
app.use("/api/catalogos", require("./routes/catalogoRoutes"));

// Manejo de rutas no encontradas
app.use(notFound);

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
