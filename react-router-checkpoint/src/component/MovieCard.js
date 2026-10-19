import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function MovieCard({ id, title, description, posterURL, rating, index = 0 }) {

    const [poster, setPoster] = useState(posterURL);

    // Reset the poster whenever the movie's poster URL changes
    useEffect(() => {
        setPoster(posterURL);
    }, [posterURL]);

    const score = Number(rating) || 0;
    const filledStars = Math.round(score / 2);
    const initials = title
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    return (
        <article className="movie-card" style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}>
            <div className="movie-card__poster">
                {poster ? (
                    <img
                        src={poster}
                        alt={`${title} poster`}
                        loading="lazy"
                        onError={() => setPoster('')}
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

            <div className="movie-card__body">
                <h3 className="movie-card__title">{title}</h3>
                <p className="movie-card__desc">{description}</p>
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
                <p className="movie-card__cta">View details →</p>
            </div>

            <Link className="movie-card__link" to={`/movie/${id}`}>
                <span className="sr-only">View details for {title}</span>
            </Link>
        </article>
    );
}

export default MovieCard;