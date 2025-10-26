import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// 🔹 Variables para rutas absolutas (ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 API CRUD
app.get("/movies", async (req, res) => {
  const result = await pool.query("SELECT * FROM movies");
  res.json(result.rows);
});

app.get("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("SELECT * FROM movies WHERE id=$1", [id]);
  res.json(result.rows[0]);
});

app.post("/movies", async (req, res) => {
  const { title, director, year } = req.body;
  const result = await pool.query(
    "INSERT INTO movies (title, director, year) VALUES ($1, $2, $3) RETURNING *",
    [title, director, year]
  );
  res.json(result.rows[0]);
});

app.put("/movies/:id", async (req, res) => {
  const { id } = req.params;
  const { title, director, year } = req.body;
  const result = await pool.query(
    "UPDATE movies SET title=$1, director=$2, year=$3 WHERE id=$4 RETURNING *",
    [title, director, year, id]
  );
  res.json(result.rows[0]);
});

app.delete("/movies/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM movies WHERE id=$1", [id]);
  res.json({ message: "Movie deleted" });
});

// 🔹 Servir frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Ruta catch-all para SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// 🔹 Puerto dinámico (Render asigna PORT automáticamente)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
