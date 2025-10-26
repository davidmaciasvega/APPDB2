// server.js
import express from "express";
import cors from "cors";
import { pool } from "./db.js"; // usamos la conexión ya configurada
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🟢 Ruta principal
app.get("/", (req, res) => {
  res.send("API de Películas funcionando 🎬");
});

// 🟢 Obtener todas las películas
app.get("/movies", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error al obtener películas:", err);
    res.status(500).json({ error: "Error al obtener películas" });
  }
});

// 🟢 Obtener una película por ID
app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM movies WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al obtener película:", err);
    res.status(500).json({ error: "Error al obtener película" });
  }
});

// 🟢 Agregar una nueva película
app.post("/movies", async (req, res) => {
  const { title, director, year } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO movies (title, director, year) VALUES ($1, $2, $3) RETURNING *",
      [title, director, year]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Error al agregar película:", err);
    res.status(500).json({ error: "Error al agregar película" });
  }
});

// 🟢 Editar una película existente
app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { title, director, year } = req.body;
  try {
    const result = await pool.query(
      "UPDATE movies SET title=$1, director=$2, year=$3 WHERE id=$4 RETURNING *",
      [title, director, year, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error al actualizar película:", err);
    res.status(500).json({ error: "Error al actualizar película" });
  }
});

// 🟢 Eliminar una película
app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("DELETE FROM movies WHERE id = $1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Película no encontrada" });
    }
    res.json({ message: "Película eliminada correctamente" });
  } catch (err) {
    console.error("Error al eliminar película:", err);
    res.status(500).json({ error: "Error al eliminar película" });
  }
});

// 🟢 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
