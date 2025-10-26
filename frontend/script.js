// 🔹 URL de la API (relativa para que funcione en Render y local)
const API_URL = "/movies";

// 🔹 Cargar todas las películas
async function loadMovies() {
  const res = await fetch(API_URL);
  const movies = await res.json();

  const table = document.getElementById("movies-table");
  table.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Título</th>
      <th>Director</th>
      <th>Año</th>
      <th>Acciones</th>
    </tr>
  `;

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
}

// 🔹 Agregar o actualizar una película
document.getElementById("movie-form").addEventListener("submit", async e => {
  e.preventDefault();

  const id = document.getElementById("movie-id").value;
  const movie = {
    title: document.getElementById("title").value,
    director: document.getElementById("director").value,
    year: parseInt(document.getElementById("year").value),
  };

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
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadMovies();
}

// 🔹 Inicializar tabla
loadMovies();
