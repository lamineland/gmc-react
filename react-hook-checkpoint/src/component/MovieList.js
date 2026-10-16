import React, { useEffect, useState } from 'react';
import MovieCard from './MovieCard';

const EMPTY_FORM = {
    title: '',
    description: '',
    posterURL: '',
    rating: ''
};

function MovieList({ movies, totalCount, onAddMovie, onReset }) {

    const [form, setForm] = useState(EMPTY_FORM);
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');

    // Auto-hide the success notice, and clear the timer on unmount
    useEffect(() => {
        if (!notice) return undefined;
        const timer = window.setTimeout(() => setNotice(''), 3000);
        return () => window.clearTimeout(timer);
    }, [notice]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const title = form.title.trim();
        const description = form.description.trim();

        if (!title || !description) {
            setError('Title and description are required.');
            return;
        }

        const rating = Number(form.rating);
        if (form.rating !== '' && (Number.isNaN(rating) || rating < 0 || rating > 10)) {
            setError('Rating must be a number between 0 and 10.');
            return;
        }

        setError('');
        onAddMovie(form);
        setNotice(`“${title}” was added to your library.`);
        setForm(EMPTY_FORM);
    };

    const handleClear = () => {
        setForm(EMPTY_FORM);
        setError('');
    };

    return (
        <div className="movie-list">
            {movies.length > 0 ? (
                <div className="movie-grid">
                    {movies.map((movie, index) => (
                        <MovieCard
                            key={movie.id}
                            title={movie.title}
                            description={movie.description}
                            posterURL={movie.posterURL}
                            rating={movie.rating}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty">
                    <p className="empty__icon" aria-hidden="true">🎬</p>
                    <h3 className="empty__title">No movies found</h3>
                    <p className="empty__text">
                        {totalCount > 0
                            ? 'Nothing matches your search — try another keyword or reset the filters.'
                            : 'Your library is empty — add your first movie below.'}
                    </p>
                    <button type="button" className="btn btn--ghost btn--small" onClick={onReset}>
                        Reset library
                    </button>
                </div>
            )}

            <section className="panel">
                <div className="panel__header">
                    <h2 className="panel__title">Add a movie</h2>
                    <p className="panel__hint">Fields marked with * are required.</p>
                </div>

                <form className="form" aria-label="Add a movie" onSubmit={handleSubmit} noValidate>
                    <div className="form__row">
                        <div className="field">
                            <label className="field__label" htmlFor="movie-title">Title *</label>
                            <input
                                id="movie-title"
                                className="field__input"
                                name="title"
                                type="text"
                                placeholder="e.g. Blade Runner 2049"
                                value={form.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="field">
                            <label className="field__label" htmlFor="movie-rating">Rating (0–10)</label>
                            <input
                                id="movie-rating"
                                className="field__input"
                                name="rating"
                                type="number"
                                min="0"
                                max="10"
                                step="0.1"
                                placeholder="e.g. 8.5"
                                value={form.rating}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="movie-description">Description *</label>
                        <input
                            id="movie-description"
                            className="field__input"
                            name="description"
                            type="text"
                            placeholder="A short synopsis"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="field">
                        <label className="field__label" htmlFor="movie-poster">Poster URL</label>
                        <input
                            id="movie-poster"
                            className="field__input"
                            name="posterURL"
                            type="url"
                            placeholder="https://…"
                            value={form.posterURL}
                            onChange={handleChange}
                        />
                    </div>

                    {error ? (
                        <p className="form__message form__message--error" role="alert">{error}</p>
                    ) : null}

                    <div className="form__actions">
                        <button type="submit" className="btn btn--primary">Add movie</button>
                        <button type="button" className="btn btn--ghost" onClick={handleClear}>
                            Clear form
                        </button>
                    </div>
                </form>
            </section>

            {notice ? (
                <div className="toast" role="status">
                    <span className="toast__dot" aria-hidden="true" />
                    {notice}
                </div>
            ) : null}
        </div>
    );
}

export default MovieList;