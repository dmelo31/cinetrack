const KEY = "cinetrack_state_v2";

const defaultState = {
  theme: "dark",
  watchlist: {},
  watched: {},
  ratings: {},
};

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(defaultState);
    const data = JSON.parse(raw);
    return {
      ...structuredClone(defaultState),
      ...data,
      watchlist: data.watchlist || {},
      watched: data.watched || {},
      ratings: data.ratings || {},
    };
  } catch {
    return structuredClone(defaultState);
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
