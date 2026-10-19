import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Filter from './component/Filter';
import MovieDetails from './component/MovieDetails';

function Home() {
  return (
    <>
      <section className="hero">
        <p className="hero__eyebrow">React hooks · vanilla CSS</p>
        <h1 className="hero__title">
          Your personal <span>movie library</span>
        </h1>
        <p className="hero__subtitle">
          Search, sort and add movies — the list reacts automatically thanks to{' '}
          <code>useEffect</code>, and your collection is saved in your browser.
        </p>
      </section>

      <Filter />
    </>
  );
}

function NotFound() {
  return (
    <section className="details" aria-label="Page not found">
      <Link className="btn btn--ghost btn--small details__back" to="/">
        ← Back to home
      </Link>
      <div className="empty">
        <p className="empty__icon" aria-hidden="true">🎬</p>
        <h1 className="empty__title">Page not found</h1>
        <p className="empty__text">
          The page you are looking for doesn’t exist — head back to your library.
        </p>
        <Link className="btn btn--primary btn--small" to="/">
          Back to home
        </Link>
      </div>
    </section>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="topbar">
          <Link className="brand" to="/">
            <span className="brand__mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" role="presentation">
                <path d="M4 4.6c0-1.2 1.3-2 2.3-1.4l11.2 6.4c1 .6 1 2 0 2.6L6.3 18.8c-1 .6-2.3-.2-2.3-1.4V4.6z" />
              </svg>
            </span>
            <span className="brand__text">
              <strong>CineScope</strong>
              <small>Movie library</small>
            </span>
          </Link>
          <p className="topbar__tagline">Curate, rate and explore your favourite films.</p>
        </header>

        <main className="shell">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>
            Built with React hooks (<code>useState</code>, <code>useEffect</code>),{' '}
            <code>react-router</code> and hand-written CSS — no UI frameworks.
          </p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
