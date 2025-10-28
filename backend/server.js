// server.js
import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// 🔹 Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Variables para rutas absolutas (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================
// 🔹 RUTAS DE LA API
// ======================

// Ruta de prueba
app.get("/api", (req, res) => {
  res.send("API de Juegos funcionando 🎮");
});

// Obtener todos los juegos
app.get("/api/games", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM games ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener juegos:", err);
    res.status(500).json({ error: "Error al obtener juegos" });
  }
});

// Obtener un juego por ID
app.get("/api/games/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM games WHERE id=$1", [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Juego no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener juego:", err);
    res.status(500).json({ error: "Error al obtener juego" });
  }
});

// Agregar un nuevo juego
app.post("/api/games", async (req, res) => {
  const { name, descripction, platform, genre, year, developer, rating } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO games (name, descripction, platform, genre, year, developer, rating)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, descripction, platform, genre, year, developer, rating]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al agregar juego:", err);
    res.status(500).json({ error: "Error al agregar juego" });
  }
});

// Editar un juego existente
app.put("/api/games/:id", async (req, res) => {
  const { id } = req.params;
  const { name, descripction, platform, genre, year, developer, rating } =
    req.body;
  try {
    const result = await pool.query(
      `UPDATE games SET name=$1, descripction=$2, platform=$3, genre=$4, year=$5, developer=$6, rating=$7
       WHERE id=$8 RETURNING *`,
      [name, descripction, platform, genre, year, developer, rating, id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ error: "Juego no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar juego:", err);
    res.status(500).json({ error: "Error al actualizar juego" });
  }
});

// Eliminar un juego
app.delete("/api/games/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM games WHERE id=$1", [id]);
    if (result.rowCount === 0)
      return res.status(404).json({ error: "Juego no encontrado" });
    res.json({ message: "Juego eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar juego:", err);
    res.status(500).json({ error: "Error al eliminar juego" });
  }
});

// ======================
// 🔹 SERVIR FRONTEND
// ======================
const frontendPath = path.join(__dirname, "../frontend");

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(frontendPath, { extensions: ["html"] }));

// Manejar cualquier ruta que no empiece con /api → devolver index.html
app.get("*", (req, res) => {
  if (req.path.startsWith("/api"))
    return res.status(404).send("Ruta de API no encontrada");
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ======================
// 🔹 PUERTO
// ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
);
