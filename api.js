const TMDB_BASE = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w342";

// Cole sua chave aqui
export const TMDB_API_KEY = "25d17526608e4a19ce0749e2c09502fc";

export function posterUrl(path) {
  if (!path) return null;
  return `${IMG_BASE}${path}`;
}

export async function searchMovies(query) {
  const url =
    `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}` +
    `&language=pt-BR&include_adult=false&query=${encodeURIComponent(query)}`;

  const res = await fetch(url);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.status_message || "Erro ao buscar no TMDB");
  }

  return (data.results || []).map((m) => ({
    id: m.id,
    title: m.title,
    year: m.release_date ? m.release_date.slice(0, 4) : "—",
    popularity: Math.round(m.popularity || 0),
    desc: m.overview || "Sem descrição.",
    poster_path: m.poster_path,
  }));
}







