import { loadState, saveState } from "./storage.js";
import { searchMovies, posterUrl } from "./api.js";

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
let currentList = [];

applyTheme(state.theme);
wireUI();
renderEmptyState();

function wireUI() {
document.querySelectorAll(".chip").forEach(c => {
  c.classList.remove("active");
  c.setAttribute("aria-pressed", "false");
});
chip.classList.add("active");
chip.setAttribute("aria-pressed", "true");
filter = chip.dataset.filter;
render();

  ui.howToBtn.addEventListener("click", (e) => {
    e.preventDefault();
    ui.helpDialog.showModal();
  });
}
  
  ui.closeHelp.addEventListener("click", () => ui.helpDialog.close());

  ui.themeBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState(state);
    applyTheme(state.theme);
  });

  let t = null;
  ui.search.addEventListener("input", (e) => {
    query = e.target.value.trim();
    clearTimeout(t);
    t = setTimeout(async () => {
      if (query.length < 2) {
        currentList = [];
        renderEmptyState();
        return;
      }
      await loadFromTMDB(query);
    }, 350);
  });

  ui.sort.addEventListener("change", () => render());

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

async function loadFromTMDB(q) {
  ui.grid.innerHTML = loadingHTML();
  try {
    currentList = await searchMovies(q);
    render();
  } catch (err) {
    currentList = [];
    ui.stats.innerHTML = "";
    ui.grid.innerHTML = errorHTML(err?.message || "Erro ao buscar");
  }
}

function filteredMovies() {
  let list = [...currentList];

  list = list.filter(m => {
    const s = getMovieStatus(m.id);
    if (filter === "watchlist") return s.inWatchlist;
    if (filter === "watched") return s.watched;
    if (filter === "rated") return s.rating > 0;
    return true;
  });

  const sort = ui.sort.value;
  list.sort((a, b) => {
    const sa = getMovieStatus(a.id);
    const sb = getMovieStatus(b.id);

    if (sort === "title") return a.title.localeCompare(b.title);
    if (sort === "rating_desc") return (sb.rating - sa.rating) || ((b.popularity || 0) - (a.popularity || 0));
    if (sort === "rating_asc") return (sa.rating - sb.rating) || ((b.popularity || 0) - (a.popularity || 0));
    return (b.popularity || 0) - (a.popularity || 0);
  });

  return list;
}

function renderStats() {
  const watchlistCount = Object.keys(state.watchlist).length;
  const watchedCount = Object.keys(state.watched).length;
  const ratedCount = Object.keys(state.ratings).length;

  ui.stats.innerHTML = `
    <div class="stat"><b>${watchlistCount}</b><span>Quero ver</span></div>
    <div class="stat"><b>${watchedCount}</b><span>Assistidos</span></div>
    <div class="stat"><b>${ratedCount}</b><span>Avaliados</span></div>
    <div class="stat"><b>${currentList.length}</b><span>Resultados (TMDB)</span></div>
  `;
}

function renderEmptyState() {
  ui.stats.innerHTML = `
    <div class="stat"><b>🔎</b><span>Digite pelo menos 2 letras para buscar</span></div>
    <div class="stat"><b>${Object.keys(state.watchlist).length}</b><span>Quero ver (salvos)</span></div>
    <div class="stat"><b>${Object.keys(state.watched).length}</b><span>Assistidos (salvos)</span></div>
  `;
  ui.grid.innerHTML = `
    <div class="card">
      <div class="content">
        <h2>Busque filmes reais</h2>
        <div class="desc">
          Digite no campo de busca para carregar filmes do TMDB com pôster e descrição.
          Seus status (quero ver/assistido/nota) continuam salvos no LocalStorage.
        </div>
      </div>
    </div>
  `;
}

function render() {
  if (!query || query.trim().length < 2) {
    renderEmptyState();
    return;
  }

  renderStats();

  const list = filteredMovies();
  if (list.length === 0) {
    ui.grid.innerHTML = `<div class="card"><div class="content"><h2>Nada encontrado</h2><div class="desc">Tente outro termo ou mude o filtro.</div></div></div>`;
    return;
  }

  ui.grid.innerHTML = list.map(m => cardHTML(m)).join("");

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

    for (let r = 1; r <= 5; r++) {
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

  const poster = posterUrl(movie.poster_path);
  const posterStyle = poster
    ? `background-image:url('${poster}'); background-size:cover; background-position:center;`
    : "";

  return `
  <article class="card">
    <div class="poster" style="${posterStyle}">
      <div class="badges">${badges}</div>
    </div>

    <div class="content">
      <div class="title">
        <div>
          <h2>${escapeHtml(movie.title)}</h2>
          <div class="meta">${escapeHtml(movie.year)} • Popularidade: ${escapeHtml(movie.popularity)}</div>
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
  let html = `<div class="stars" role="radiogroup" aria-label="Avaliar filme de 1 a 5">`;
  for (let i = 1; i <= 5; i++) {
    const filled = i <= rating ? "filled" : "";
    const checked = i === rating ? "true" : "false";
    html += `
      <button
        type="button"
        class="star ${filled}"
        id="star-${id}-${i}"
        role="radio"
        aria-checked="${checked}"
        aria-label="${i} de 5 estrelas"
        tabindex="${i === 1 ? "0" : "-1"}"
        data-movie="${id}"
        data-star="${i}"
      >★</button>
    `;
  }
  html += `</div>`;
  return html;
}

function loadingHTML() {
  return `
    <div class="card">
      <div class="content">
        <h2>Carregando…</h2>
        <div class="desc">Buscando filmes no TMDB.</div>
      </div>
    </div>
  `;
}

function errorHTML(msg) {
  return `
    <div class="card">
      <div class="content">
        <h2>Não foi possível buscar</h2>
        <div class="desc">${escapeHtml(msg)}<br/><br/>
        Verifique se você colocou sua TMDB_API_KEY em <b>js/api.js</b>.
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}


