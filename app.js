movie.poster
import { loadState, saveState } from "./storage.js";
import { MOVIES_DB } from "./data.js";

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

ui.grid.addEventListener("click", onGridClick);
ui.grid.addEventListener("keydown", onGridKeyDown);

function searchLocal(query) {
  const q = query.toLowerCase();
  return MOVIES_DB.filter(m =>
    m.title.toLowerCase().includes(q) ||
    String(m.year).includes(q) ||
    (m.genres || []).join(" ").toLowerCase().includes(q)
  );
}

function wireUI() {
  ui.howToBtn.addEventListener("click", () => ui.helpDialog.showModal());
  ui.closeHelp.addEventListener("click", () => ui.helpDialog.close());

  ui.themeBtn.addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState(state);
    applyTheme(state.theme);
  });

  // debounce simples
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
     loadFromLocal(query);
    }, 350);
  });

  ui.sort.addEventListener("change", render);

  // filtros
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => {
        c.classList.remove("active");
        c.setAttribute("aria-pressed", "false");
      });

      chip.classList.add("active");
      chip.setAttribute("aria-pressed", "true");
      filter = chip.dataset.filter;
      render();
    });
  });
}

function applyTheme(theme) {
  const t = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = t;
  ui.themeBtn.textContent = t === "dark" ? "🌙 Tema" : "☀️ Tema";
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

function loadFromLocal(q) {
  currentList = searchLocal(q);
  render();
}

function filteredMovies() {
  let list = [...currentList];

  list = list.filter((m) => {
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
          Digite no campo de busca para carregar filmes do TMDB.
          Seus status (quero ver/assistido/nota) ficam salvos no LocalStorage.
        </div>
      </div>
    </div>
  `;
}

function render() {
  if (!query || query.length < 2) {
    renderEmptyState();
    return;
  }

  renderStats();

  const list = filteredMovies();
  if (list.length === 0) {
    ui.grid.innerHTML = `
      <div class="card">
        <div class="content">
          <h2>Nada encontrado</h2>
          <div class="desc">Tente outro termo ou mude o filtro.</div>
        </div>
      </div>
    `;
    return;
  }

  ui.grid.innerHTML = list.map(cardHTML).join("");
}

function cardHTML(movie) {
  const s = getMovieStatus(movie.id);

  const badges = [
    s.inWatchlist ? `<span class="badge blue">Quero ver</span>` : "",
    s.watched ? `<span class="badge green">Assistido</span>` : "",
    s.rating > 0 ? `<span class="badge">⭐ ${s.rating}/5</span>` : "",
  ].join("");

  const posterStyle = movie.poster
  ? `background-image:url('${movie.poster}'); background-size:cover; background-position:center;`
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

      <div class="stars" role="radiogroup" aria-label="Avaliar filme de 1 a 5">
        ${starsHTML(movie.id, s.rating)}
      </div>

      <div class="actions">
        <button class="btn secondary" type="button" id="wl-${movie.id}">
          ${s.inWatchlist ? "✓ Na Watchlist" : "＋ Quero ver"}
        </button>

        <button class="btn secondary" type="button" id="watched-${movie.id}">
          ${s.watched ? "👁 Assistido" : "👁 Marcar assistido"}
        </button>

        <button class="btn danger" type="button" id="clear-${movie.id}">Limpar</button>
      </div>
    </div>
  </article>
  `;
}

function starsHTML(movieId, rating) {
  let html = "";
  for (let i = 1; i <= 5; i++) {
    const filled = i <= rating ? "filled" : "";
    const checked = i === rating ? "true" : "false";
    html += `
      <button
        class="star ${filled}"
        type="button"
        aria-checked="${checked}"
        role="radio"
        data-movie="${movieId}"
        data-star="${i}"
        title="${i} estrela(s)"
      >★</button>
    `;
  }
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
        <div class="desc">
          ${escapeHtml(msg)}<br/><br/>
          Verifique se você colocou sua TMDB_API_KEY em <b>api.js</b>.
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function onGridClick(e) {
  const t = e.target;

  if (t.id?.startsWith("wl-")) {
    const id = Number(t.id.replace("wl-", ""));
    const s = getMovieStatus(id);
    setWatchlist(id, !s.inWatchlist);
    return;
  }

  if (t.id?.startsWith("watched-")) {
    const id = Number(t.id.replace("watched-", ""));
    const s = getMovieStatus(id);
    setWatched(id, !s.watched);
    return;
  }

  if (t.id?.startsWith("clear-")) {
    const id = Number(t.id.replace("clear-", ""));
    setWatchlist(id, false);
    setWatched(id, false);
    setRating(id, 0);
    return;
  }

  if (t.classList?.contains("star") && t.dataset.movie) {
    const id = Number(t.dataset.movie);
    const star = Number(t.dataset.star);
    setRating(id, star);
  }
}

function onGridKeyDown(e) {
  const t = e.target;
  if (!(t.classList?.contains("star") && t.dataset.movie)) return;

  const movieId = Number(t.dataset.movie);
  let star = Number(t.dataset.star);

  if (e.key === "ArrowRight" || e.key === "ArrowUp") {
    e.preventDefault();
    star = Math.min(5, star + 1);
    focusStar(movieId, star);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
    e.preventDefault();
    star = Math.max(1, star - 1);
    focusStar(movieId, star);
  } else if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    setRating(movieId, star);
  }
}

function focusStar(movieId, star) {
  const btn = document.querySelector(`.star[data-movie="${movieId}"][data-star="${star}"]`);
  if (btn) btn.focus();
}




