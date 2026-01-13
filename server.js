require("dotenv").config();
const app = require("./src/app");
const db = require("./src/config/database");

const PORT = process.env.PORT || 3000;

// Verificar conexión a la base de datos antes de iniciar el servidor
const startServer = async () => {
  try {
    // Test de conexión a la base de datos
    await db.query("SELECT NOW()");
    console.log("✅ Conexión a PostgreSQL establecida correctamente");

    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 Entorno: ${process.env.NODE_ENV || "development"}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
    });

    // Manejo de señales de terminación
    const gracefulShutdown = (signal) => {
      console.log(`\n⚠️  Recibida señal ${signal}. Cerrando servidor...`);
      server.close(() => {
        console.log("✅ Servidor cerrado correctamente");
        db.pool.end(() => {
          console.log("✅ Pool de base de datos cerrado");
          process.exit(0);
        });
      });

      // Si no se cierra en 10 segundos, forzar cierre
      setTimeout(() => {
        console.error("❌ No se pudo cerrar correctamente, forzando salida");
        process.exit(1);
      }, 10000);
    };

    // Escuchar señales de terminación
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Manejo de errores no capturados
    process.on("unhandledRejection", (err) => {
      console.error("❌ UNHANDLED REJECTION! 💥 Cerrando servidor...");
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    process.on("uncaughtException", (err) => {
      console.error("❌ UNCAUGHT EXCEPTION! 💥 Cerrando servidor...");
      console.error(err.name, err.message);
      process.exit(1);
    });
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:", error);
    console.error(
      "💡 Verifica que PostgreSQL esté corriendo y las credenciales en .env sean correctas"
    );
    process.exit(1);
  }
};

startServer();
