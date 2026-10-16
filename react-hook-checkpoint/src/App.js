import './App.css';
import Filter from './component/Filter';

function App() {
  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href="#top">
          <span className="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" role="presentation">
              <path d="M4 4.6c0-1.2 1.3-2 2.3-1.4l11.2 6.4c1 .6 1 2 0 2.6L6.3 18.8c-1 .6-2.3-.2-2.3-1.4V4.6z" />
            </svg>
          </span>
          <span className="brand__text">
            <strong>CineScope</strong>
            <small>Movie library</small>
          </span>
        </a>
        <p className="topbar__tagline">Curate, rate and explore your favourite films.</p>
      </header>

      <main className="shell" id="top">
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
      </main>

      <footer className="footer">
        <p>
          Built with React hooks (<code>useState</code>, <code>useEffect</code>) and hand-written
          CSS — no UI frameworks.
        </p>
      </footer>
    </div>
  );
}

export default App;
