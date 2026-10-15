import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      person: {
        fullName: "John Doe",
        bio: "A software developer",
        imgSrc: "https://randomuser.me/api/portraits/men/32.jpg",
        profession: "Developer"
      },
      show: false,
      elapsedSeconds: 0
    };
  }

  componentDidMount() {
    this.mountedAt = Date.now();
    this.intervalId = setInterval(() => {
      this.setState({
        elapsedSeconds: Math.floor((Date.now() - this.mountedAt) / 1000)
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  formatElapsed(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  render() {
    const { person, show, elapsedSeconds } = this.state;

    return (
      <div className="App">
        <main className="stage">
          <section className="profile-card">
            <header className="profile-card__header">
              <p className="profile-card__eyebrow">Profile</p>
              <span className={show ? "status-pill status-pill--on" : "status-pill"}>
                <span className="status-pill__dot" aria-hidden="true"></span>
                {show ? "Visible" : "Hidden"}
              </span>
            </header>

            <div
              className="profile-card__main"
              id="profile-details"
              aria-live="polite"
            >
              {show ? (
                <div className="profile-card__body">
                  <img
                    className="profile-card__avatar"
                    src={person.imgSrc}
                    alt={`Portrait of ${person.fullName}`}
                  />
                  <h1 className="profile-card__name">{person.fullName}</h1>
                  <p className="profile-card__bio">{person.bio}</p>
                  <p className="profile-card__profession">
                    <span className="profession-badge">{person.profession}</span>
                  </p>
                </div>
              ) : (
                <div className="profile-card__empty">
                  <span className="profile-card__empty-icon" aria-hidden="true">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <p className="profile-card__empty-title">Profile hidden</p>
                  <p className="profile-card__empty-hint">
                    Press "Show Profile" to reveal the details.
                  </p>
                </div>
              )}
            </div>

            <footer className="profile-card__footer">
              <div className="elapsed-field">
                <span className="elapsed-field__label">
                  <svg
                    className="elapsed-field__icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  Time since mounted
                </span>
                <span className="elapsed-field__value">
                  {this.formatElapsed(elapsedSeconds)}
                </span>
              </div>
              <button
                type="button"
                className="toggle-button"
                onClick={() => this.setState({ show: !show })}
                aria-expanded={show}
                aria-controls="profile-details"
              >
                <span className="toggle-button__icon" aria-hidden="true">
                  <svg
                    className="toggle-button__glyph toggle-button__glyph--eye"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <svg
                    className="toggle-button__glyph toggle-button__glyph--eye-off"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </span>
                <span className="toggle-button__label">
                  {show ? "Hide Profile" : "Show Profile"}
                </span>
              </button>
            </footer>
          </section>
        </main>
      </div>
    );
  }
}

export default App;