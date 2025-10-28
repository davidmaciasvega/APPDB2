import express from "express";
import cors from "cors";
import { pool } from "./db.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Variables absolutas para ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Rutas API

// Test route
app.get("/", (req, res) => res.send("API de Juegos funcionando 🎮"));

// Obtener todos los juegos
app.get("/games", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM games ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener juegos:", err);
    res.status(500).json({ error: "Error al obtener juegos" });
  }
});

// Obtener un juego por ID
app.get("/games/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM games WHERE id=$1", [id]);
    if (!result.rows.length) return res.status(404).json({ error: "Juego no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener juego:", err);
    res.status(500).json({ error: "Error al obtener juego" });
  }
});

// Agregar un nuevo juego
app.post("/games", async (req, res) => {
  const { name, descripction, platform, genre, year, developer, rating } = req.body;
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

// Editar juego
app.put("/games/:id", async (req, res) => {
  const { id } = req.params;
  const { name, descripction, platform, genre, year, developer, rating } = req.body;
  try {
    const result = await pool.query(
      `UPDATE games SET name=$1, descripction=$2, platform=$3, genre=$4, year=$5, developer=$6, rating=$7
       WHERE id=$8 RETURNING *`,
      [name, descripction, platform, genre, year, developer, rating, id]
    );
    if (!result.rows.length) return res.status(404).json({ error: "Juego no encontrado" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar juego:", err);
    res.status(500).json({ error: "Error al actualizar juego" });
  }
});

// Eliminar juego
app.delete("/games/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM games WHERE id=$1", [id]);
    if (!result.rowCount) return res.status(404).json({ error: "Juego no encontrado" });
    res.json({ message: "Juego eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar juego:", err);
    res.status(500).json({ error: "Error al eliminar juego" });
  }
});

// 🔹 Servir frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "../frontend")));

// Ruta catch-all para SPA (debe ir **al final**)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Puerto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`));
