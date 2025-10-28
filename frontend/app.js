// URL de la API del backend (Render) para juegos
const API_URL = "https://appdb2.onrender.com/games";

// 🔹 Cargar todos los juegos al iniciar
async function loadGames() {
  try {
    const res = await fetch(API_URL);
    const games = await res.json();

    const table = document.getElementById("games-table");
    table.innerHTML = "";

    games.forEach(game => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${game.id}</td>
        <td>${game.name}</td>
        <td>${game.descripction}</td>
        <td>${game.platform}</td>
        <td>${game.genre}</td>
        <td>${game.year}</td>
        <td>${game.developer}</td>
        <td>${game.rating}</td>
        <td>
          <button onclick="editGame(${game.id}, '${game.name}', '${game.descripction}', '${game.platform}', '${game.genre}', ${game.year}, '${game.developer}', ${game.rating})">Editar</button>
          <button onclick="deleteGame(${game.id})">Eliminar</button>
        </td>
      `;
      table.appendChild(row);
    });
  } catch (err) {
    console.error("Error cargando juegos:", err);
  }
}

// 🔹 Agregar o actualizar un juego
document.getElementById("game-form").addEventListener("submit", async e => {
  e.preventDefault();

  const id = document.getElementById("game-id").value;
  let name = document.getElementById("name").value;
  let descripction = document.getElementById("descripction").value;
  let platform = document.getElementById("platform").value;
  let genre = document.getElementById("genre").value;
  const year = parseInt(document.getElementById("year").value);
  let developer = document.getElementById("developer").value;
  const rating = parseFloat(document.getElementById("rating").value);

  // Validación de longitud (100 caracteres máximo)
  if (name.length > 100) name = name.slice(0, 100);
  if (descripction.length > 200) descripction = descripction.slice(0, 200);
  if (platform.length > 50) platform = platform.slice(0, 50);
  if (genre.length > 50) genre = genre.slice(0, 50);
  if (developer.length > 100) developer = developer.slice(0, 100);

  const game = { name, descripction, platform, genre, year, developer, rating };

  try {
    if (id) {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(game),
      });
    } else {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(game),
      });
    }
    document.getElementById("game-form").reset();
    loadGames();
  } catch (err) {
    console.error("Error guardando juego:", err);
    alert("No se pudo guardar el juego. Revisa los datos e inténtalo de nuevo.");
  }
});

// 🔹 Editar juego
function editGame(id, name, descripction, platform, genre, year, developer, rating) {
  document.getElementById("game-id").value = id;
  document.getElementById("name").value = name;
  document.getElementById("descripction").value = descripction;
  document.getElementById("platform").value = platform;
  document.getElementById("genre").value = genre;
  document.getElementById("year").value = year;
  document.getElementById("developer").value = developer;
  document.getElementById("rating").value = rating;
}

// 🔹 Eliminar juego
async function deleteGame(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadGames();
  } catch (err) {
    console.error("Error eliminando juego:", err);
    alert("No se pudo eliminar el juego.");
  }
}

// Inicializar al cargar
loadGames();
