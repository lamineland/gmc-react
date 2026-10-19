import React, { useEffect, useState } from 'react';
import movies from '../data/movies';
import { loadSavedMovies, STORAGE_KEY } from '../data/library';
import MovieList from './MovieList';

const SORT_OPTIONS = [
    { id: 'default', label: 'All movies' },
    { id: 'rating', label: 'Top rated' },
    { id: 'title', label: 'A → Z' }
];

function Filter() {

    const [movieList, setMovieList] = useState(loadSavedMovies);
    const [visibleMovies, setVisibleMovies] = useState(movieList);
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('default');

    // 1. Keep the rendered list in sync with the library, the search and the sort
    useEffect(() => {
        const query = search.trim().toLowerCase();

        let next = movieList.filter((movie) => {
            if (!query) return true;
            return (
                movie.title.toLowerCase().includes(query) ||
                movie.description.toLowerCase().includes(query)
            );
        });

        if (sort === 'rating') {
            next = [...next].sort((a, b) => b.rating - a.rating);
        } else if (sort === 'title') {
            next = [...next].sort((a, b) => a.title.localeCompare(b.title));
        }

        setVisibleMovies(next);
    }, [movieList, search, sort]);

    // 2. Persist the library in the browser whenever it changes
    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(movieList));
    }, [movieList]);

    // 3. Mirror the library size in the document title (cleanup restores it)
    useEffect(() => {
        const previousTitle = document.title;
        document.title = movieList.length
            ? `CineScope · ${movieList.length} movies`
            : 'CineScope · empty library';

        return () => {
            document.title = previousTitle;
        };
    }, [movieList.length]);

    const addMovie = (draft) => {
        setMovieList((previous) => [
            ...previous,
            {
                id: Date.now(),
                title: draft.title.trim(),
                description: draft.description.trim(),
                posterURL: draft.posterURL.trim(),
                trailerURL: (draft.trailerURL || '').trim(),
                rating: Number(draft.rating) || 0
            }
        ]);
    };

    const resetLibrary = () => {
        setMovieList(movies);
        setSearch('');
        setSort('default');
    };

    const averageRating = movieList.length
        ? (movieList.reduce((sum, movie) => sum + (Number(movie.rating) || 0), 0) / movieList.length).toFixed(1)
        : '—';

    return (
        <section className="library" aria-label="Movie library">
            <div className="toolbar">
                <div className="search">
                    <label className="sr-only" htmlFor="movie-search">Search movies</label>
                    <svg className="search__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="M20 20l-3.2-3.2" strokeLinecap="round" />
                    </svg>
                    <input
                        id="movie-search"
                        className="search__input"
                        type="search"
                        placeholder="Search by title or description…"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <div className="tabs" role="group" aria-label="Sort movies">
                    {SORT_OPTIONS.map((option) => (
                        <button
                            key={option.id}
                            type="button"
                            className={`tab ${sort === option.id ? 'is-active' : ''}`}
                            aria-pressed={sort === option.id}
                            onClick={() => setSort(option.id)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="stats">
                <div className="stat">
                    <p className="stat__value">{movieList.length}</p>
                    <p className="stat__label">Movies in library</p>
                </div>
                <div className="stat">
                    <p className="stat__value">{averageRating}</p>
                    <p className="stat__label">Average rating</p>
                </div>
                <div className="stat">
                    <p className="stat__value">{visibleMovies.length}</p>
                    <p className="stat__label">Currently showing</p>
                </div>
            </div>

            <MovieList
                movies={visibleMovies}
                totalCount={movieList.length}
                onAddMovie={addMovie}
                onReset={resetLibrary}
            />
        </section>
    );
}

export default Filter;