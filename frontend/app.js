// URL de la API del backend (Render)
const API_URL = "https://appdb2.onrender.com/movies";

// 🔹 Cargar todas las películas al iniciar
async function loadMovies() {
  try {
    const res = await fetch(API_URL);
    const movies = await res.json();

    const table = document.getElementById("movies-table");
    table.innerHTML = "";

    movies.forEach(movie => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${movie.id}</td>
        <td>${movie.title}</td>
        <td>${movie.director}</td>
        <td>${movie.year}</td>
        <td>
          <button onclick="editMovie(${movie.id}, '${movie.title}', '${movie.director}', ${movie.year})">Editar</button>
          <button onclick="deleteMovie(${movie.id})">Eliminar</button>
        </td>
      `;
      table.appendChild(row);
    });
  } catch (err) {
    console.error("Error cargando películas:", err);
  }
}

// 🔹 Agregar o actualizar una película
document.getElementById("movie-form").addEventListener("submit", async e => {
  e.preventDefault();

  const id = document.getElementById("movie-id").value;
  let title = document.getElementById("title").value;
  let director = document.getElementById("director").value;
  const year = parseInt(document.getElementById("year").value);

  // 🔹 Validación de longitud (100 caracteres máximo)
  if (title.length > 100) title = title.slice(0, 100);
  if (director.length > 100) director = director.slice(0, 100);

  const movie = { title, director, year };

  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(movie),
      });
    }
    document.getElementById("movie-form").reset();
    loadMovies();
  } catch (err) {
    console.error("Error guardando película:", err);
    alert("No se pudo guardar la película. Revisa los datos e inténtalo de nuevo.");
  }
});

// 🔹 Editar película
function editMovie(id, title, director, year) {
  document.getElementById("movie-id").value = id;
  document.getElementById("title").value = title;
  document.getElementById("director").value = director;
  document.getElementById("year").value = year;
}

// 🔹 Eliminar película
async function deleteMovie(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadMovies();
  } catch (err) {
    console.error("Error eliminando película:", err);
    alert("No se pudo eliminar la película.");
  }
}

// Inicializar al cargar
loadMovies();
