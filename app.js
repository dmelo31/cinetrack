import { MOVIES } from "./data.js";
import { loadState, saveState } from "./storage.js";

const el = (id) => document.getElementById(id);

const ui = {
  grid: el("moviesGrid"),
  stats: el("stats"),
  search: el("searchInput"),
  sort: el("sortSelect"),
  themeBtn: el("themeBtn"),
  howToBtn: el("howToBtn"),
  helpDialog: el("helpDialog"),
  closeHelp: el("closeHelp"),
};

let state = loadState();
let filter = "all";
let query = "";

applyTheme(state.theme);
wireUI();
render();

function wireUI() {
  // Help dialog
  ui.howToBtn.addEventListener("click", (e) => {
    e.preventDefault();
    ui.helpDialog.showModal();
  });
  ui.closeHelp.addEventListener("click", () => ui.helpDialog.close());

  // Theme
  ui.themeBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState(state);
    applyTheme(state.theme);
  });

  // Search
  ui.search.addEventListener("input", (e) => {
    query = e.target.value.trim().toLowerCase();
    render();
  });

  // Sort
  ui.sort.addEventListener("change", () => render());

  // Filter chips
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      filter = chip.dataset.filter;
      render();
    });
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  ui.themeBtn.textContent = theme === "dark" ? "🌙 Tema" : "☀️ Tema";
}

function getMovieStatus(id) {
  return {
    inWatchlist: !!state.watchlist[id],
    watched: !!state.watched[id],
    rating: Number(state.ratings[id] || 0),
  };
}

function setWatchlist(id, value) {
  if (value) state.watchlist[id] = true;
  else delete state.watchlist[id];
  saveState(state);
  render();
}

function setWatched(id, value) {
  if (value) state.watched[id] = true;
  else delete state.watched[id];
  saveState(state);
  render();
}

function setRating(id, rating) {
  if (rating <= 0) delete state.ratings[id];
  else state.ratings[id] = rating;
  saveState(state);
  render();
}

function filteredMovies() {
  const q = query;

  let list = MOVIES.filter(m => {
    if (!q) return true;
    return (
      m.title.toLowerCase().includes(q) ||
      String(m.year).includes(q)
    );
  });

  list = list.filter(m => {
    const s = getMovieStatus(m.id);
    if (filter === "watchlist") return s.inWatchlist;
    if (filter === "watched") return s.watched;
    if (filter === "rated") return s.rating > 0;
    return true;
  });

  const sort = ui.sort.value;
  list.sort((a,b) => {
    const sa = getMovieStatus(a.id);
    const sb = getMovieStatus(b.id);

    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "rating_desc") return (sb.rating - sa.rating) || (b.popularity - a.popularity);
    if (sort === "rating_asc") return (sa.rating - sb.rating) || (b.popularity - a.popularity);

    // default popular
    return b.popularity - a.popularity;
  });

  return list;
}

function renderStats() {
  const total = MOVIES.length;
  const watchlistCount = Object.keys(state.watchlist).length;
  const watchedCount = Object.keys(state.watched).length;
  const ratedCount = Object.keys(state.ratings).length;

  ui.stats.innerHTML = `
    <div class="stat"><b>${total}</b><span>Filmes no catálogo</span></div>
    <div class="stat"><b>${watchlistCount}</b><span>Quero ver</span></div>
    <div class="stat"><b>${watchedCount}</b><span>Assistidos</span></div>
    <div class="stat"><b>${ratedCount}</b><span>Avaliados</span></div>
  `;
}

function render() {
  renderStats();

  const list = filteredMovies();
  if (list.length === 0) {
    ui.grid.innerHTML = `<div class="card"><div class="content"><h2>Nada encontrado</h2><div class="desc">Tente outro termo de busca ou mude o filtro.</div></div></div>`;
    return;
  }

  ui.grid.innerHTML = list.map(m => cardHTML(m)).join("");

  // bind events after render
  list.forEach(m => {
    const id = m.id;

    el(`wl-${id}`).addEventListener("click", () => {
      const s = getMovieStatus(id);
      setWatchlist(id, !s.inWatchlist);
    });

    el(`watched-${id}`).addEventListener("click", () => {
      const s = getMovieStatus(id);
      setWatched(id, !s.watched);
    });

    el(`clear-${id}`).addEventListener("click", () => {
      setWatchlist(id, false);
      setWatched(id, false);
      setRating(id, 0);
    });

    // stars
    for (let r=1; r<=5; r++) {
      el(`star-${id}-${r}`).addEventListener("click", () => setRating(id, r));
    }
  });
}

function cardHTML(movie) {
  const s = getMovieStatus(movie.id);
  const badges = [
    s.inWatchlist ? `<span class="badge blue">Quero ver</span>` : "",
    s.watched ? `<span class="badge green">Assistido</span>` : "",
    s.rating > 0 ? `<span class="badge">⭐ ${s.rating}/5</span>` : "",
  ].join("");

  return `
  <article class="card">
    <div class="poster">
      <div class="badges">${badges}</div>
    </div>

    <div class="content">
      <div class="title">
        <div>
          <h2>${escapeHtml(movie.title)}</h2>
          <div class="meta">${movie.year} • Popularidade: ${movie.popularity}</div>
        </div>
      </div>

      <div class="desc">${escapeHtml(movie.desc)}</div>

      <div class="stars" aria-label="Avaliação por estrelas">
        ${starsHTML(movie.id, s.rating)}
      </div>

      <div class="actions">
        <button class="btn secondary" id="wl-${movie.id}">
          ${s.inWatchlist ? "✓ Na Watchlist" : "＋ Quero ver"}
        </button>

        <button class="btn secondary" id="watched-${movie.id}">
          ${s.watched ? "👁 Assistido" : "👁 Marcar assistido"}
        </button>

        <button class="btn danger" id="clear-${movie.id}">Limpar</button>
      </div>
    </div>
  </article>
  `;
}

function starsHTML(id, rating) {
  let html = "";
  for (let i=1; i<=5; i++) {
    const filled = i <= rating ? "filled" : "";
    html += `<span class="star ${filled}" id="star-${id}-${i}" title="${i} estrela(s)">★</span>`;
  }
  return html;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}
