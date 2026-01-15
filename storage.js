const KEY = "cinetrack:v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return normalize(parsed);
  } catch {
    return defaultState();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function defaultState() {
  return {
    watchlist: {}, // id -> true
    watched: {},   // id -> true
    ratings: {},   // id -> 1..5
    theme: "dark",
  };
}

function normalize(s) {
  const base = defaultState();
  return {
    watchlist: s.watchlist && typeof s.watchlist === "object" ? s.watchlist : base.watchlist,
    watched: s.watched && typeof s.watched === "object" ? s.watched : base.watched,
    ratings: s.ratings && typeof s.ratings === "object" ? s.ratings : base.ratings,
    theme: s.theme === "light" ? "light" : "dark",
  };
}
