import movies from './movies';

// Single source of truth for the saved library: the seed data plus anything
// the user added, persisted in the browser by the library page.
export const STORAGE_KEY = 'cinescope:movies';

export function loadSavedMovies() {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) return movies;
        const saved = JSON.parse(raw);
        return Array.isArray(saved) && saved.length > 0 ? saved : movies;
    } catch (error) {
        return movies;
    }
}

export function findMovieById(id) {
    return loadSavedMovies().find((movie) => String(movie.id) === String(id));
}