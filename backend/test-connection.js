import { pool } from "./db.js";

try {
  const res = await pool.query("SELECT NOW()");
  console.log("✅ Conexión exitosa a PostgreSQL:", res.rows[0]);
  process.exit(0);
} catch (err) {
  console.error("❌ Error al conectar con PostgreSQL:", err);
  process.exit(1);
}
