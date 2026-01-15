const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w342";

// IMPORTANTE: NÃO deixe chave real no GitHub público.
// Coloque "SUA_CHAVE_AQUI" e use sua chave só localmente.
export const TMDB_API_KEY = "SUA_CHAVE_AQUI";

export function posterUrl(path) {
  if (!path) return null;
  return `${IMG_BASE}${path}`;
}

export async function searchMovies(query) {
  if (!TMDB_API_KEY || TMDB_API_KEY === "SUA_CHAVE_AQUI") {
    throw new Error("TMDB_API_KEY não configurada em api.js");
  }

  const url =
    `${TMDB_BASE}/search/movie?api_key=${encodeURIComponent(TMDB_API_KEY)}` +
    `&query=${encodeURIComponent(query)}&language=pt-BR&page=1&include_adult=false`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB erro: ${res.status}`);

  const data = await res.json();
  const results = Array.isArray(data.results) ? data.results : [];

  return results.map((m) => ({
    id: m.id,
    title: m.title || m.original_title || "Sem título",
    year: (m.release_date || "").slice(0, 4) || "—",
    popularity: Math.round((m.popularity || 0) * 10) / 10,
    desc: m.overview || "Sem descrição.",
    poster_path: m.poster_path || null,
  }));
}
