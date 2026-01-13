const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Máximo de conexiones en el pool
  idleTimeoutMillis: 30000, // Tiempo de espera antes de cerrar una conexión inactiva
  connectionTimeoutMillis: 2000, // Tiempo de espera para obtener una conexión
});

// Verificar la conexión
pool.on("connect", () => {
  console.log("✅ Conectado a la base de datos PostgreSQL");
});

pool.on("error", (err) => {
  console.error("❌ Error inesperado en el cliente de PostgreSQL:", err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
