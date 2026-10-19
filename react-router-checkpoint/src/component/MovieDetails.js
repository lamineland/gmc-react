import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { findMovieById } from '../data/library';

function MovieDetails() {

    const { id } = useParams();
    const movie = findMovieById(id);

    // Remember the poster URL that failed to load so we can show the fallback
    const [brokenPoster, setBrokenPoster] = useState('');

    if (!movie) {
        return (
            <section className="details" aria-label="Movie not found">
                <Link className="btn btn--ghost btn--small details__back" to="/">
                    ← Back to home
                </Link>
                <div className="empty">
                    <p className="empty__icon" aria-hidden="true">🎬</p>
                    <h1 className="empty__title">Movie not found</h1>
                    <p className="empty__text">
                        This movie isn’t part of your library — it may have been removed or the link is wrong.
                    </p>
                    <Link className="btn btn--primary btn--small" to="/">
                        Back to home
                    </Link>
                </div>
            </section>
        );
    }

    const score = Number(movie.rating) || 0;
    const filledStars = Math.round(score / 2);
    const initials = movie.title
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();
    const hasPoster = Boolean(movie.posterURL) && brokenPoster !== movie.posterURL;

    return (
        <section className="details" aria-label={`${movie.title} details`}>
            <Link className="btn btn--ghost btn--small details__back" to="/">
                ← Back to home
            </Link>

            <div className="details__layout">
                <div className="details__poster">
                    {hasPoster ? (
                        <img
                            src={movie.posterURL}
                            alt={`${movie.title} poster`}
                            onError={() => setBrokenPoster(movie.posterURL)}
                        />
                    ) : (
                        <div className="movie-card__fallback">
                            <span>{initials}</span>
                        </div>
                    )}
                    <span className="movie-card__badge">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />
                        </svg>
                        {score.toFixed(1)}
                    </span>
                </div>

                <div className="details__body">
                    <p className="hero__eyebrow">Movie details</p>
                    <h1 className="details__title">{movie.title}</h1>
                    <div className="movie-card__meta">
                        <span className="stars" role="img" aria-label={`Rated ${score.toFixed(1)} out of 10`}>
                            {[0, 1, 2, 3, 4].map((star) => (
                                <span key={star} className={`star ${star < filledStars ? 'is-filled' : ''}`} aria-hidden="true">
                                    ★
                                </span>
                            ))}
                        </span>
                        <span className="movie-card__score">{score.toFixed(1)} / 10</span>
                    </div>
                    <p className="details__desc">{movie.description}</p>
                </div>
            </div>

            <section className="details__trailer" aria-label={`${movie.title} trailer`}>
                <h2 className="panel__title">Trailer</h2>
                {movie.trailerURL ? (
                    <div className="details__frame">
                        <iframe
                            src={movie.trailerURL}
                            title={`${movie.title} trailer`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                ) : (
                    <p className="details__desc">No trailer available for this movie yet.</p>
                )}
            </section>
        </section>
    );
}

export default MovieDetails;