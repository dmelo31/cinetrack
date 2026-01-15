const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w342";

export const TMDB_API_KEY = "25d17526608e4a19ce0749e2c09502fc";

export function posterUrl(path) {
  if (!path) return null;
  return `${IMG_BASE}${path}`;
}

export async function searchMovies(query) {
  if (!TMDB_API_KEY || TMDB_API_KEY.includes("SUA_CHAVE_AQUI")) {
    throw new Error("TMDB_API_KEY não configurada em api.js");
  }

  const url =
    `${TMDB_BASE}/search/movie?api_key=${encodeURIComponent(TMDB_API_KEY)}` +
    `&language=pt-BR&include_adult=false&query=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Falha ao buscar no TMDB");
  const data = await res.json();

  return (data.results || []).map((m) => ({
    id: m.id,
    title: m.title || m.original_title || "Sem título",
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : "—",
    popularity: Math.round(m.popularity || 0),
    desc: m.overview || "Sem descrição disponível.",
    poster_path: m.poster_path || null,
  }));
}



