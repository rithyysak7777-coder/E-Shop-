import { useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Space+Mono:wght@700&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

  .unauth-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Sora', sans-serif;
    background: #F8F7F4;
    padding: 2rem 1rem;
    position: relative;
    overflow: hidden;
  }

  .unauth-bg-geo {
    position: absolute;
    inset: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
  }

  .unauth-card {
    position: relative;
    z-index: 2;
    background: #ffffff;
    border: 0.5px solid rgba(0,0,0,0.12);
    border-radius: 16px;
    padding: 2.5rem 2.5rem 2rem;
    max-width: 420px;
    width: 100%;
    text-align: center;
  }

  .unauth-icon-shell {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: #FCEBEB;
    border: 0.5px solid #F7C1C1;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1.5rem;
    animation: unauth-pulse 2.4s ease-in-out infinite;
  }

  @keyframes unauth-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(226,75,74,0.15); }
    50%       { box-shadow: 0 0 0 10px rgba(226,75,74,0); }
  }

  .unauth-icon-shell i {
    font-size: 30px;
    color: #A32D2D;
  }

  .unauth-badge {
    display: inline-block;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.12em;
    color: #A32D2D;
    background: #FCEBEB;
    border: 0.5px solid #F7C1C1;
    border-radius: 8px;
    padding: 3px 10px;
    margin-bottom: 1rem;
  }

  .unauth-title {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.6rem;
    letter-spacing: -0.02em;
    line-height: 1.25;
  }

  .unauth-sub {
    font-size: 14px;
    color: #6b6b6b;
    line-height: 1.65;
    margin: 0 0 1.75rem;
  }

  .unauth-divider {
    height: 0.5px;
    background: rgba(0,0,0,0.08);
    margin: 0 0 1.5rem;
  }

  .unauth-actions {
    display: flex;
    gap: 10px;
    justify-content: center;
  }

  .unauth-btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #E24B4A;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 9px 20px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.18s, transform 0.12s;
  }

  .unauth-btn-primary:hover  { background: #A32D2D; }
  .unauth-btn-primary:active { transform: scale(0.97); }

  .unauth-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: transparent;
    color: #6b6b6b;
    border: 0.5px solid rgba(0,0,0,0.18);
    border-radius: 8px;
    padding: 9px 20px;
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
  }

  .unauth-btn-ghost:hover {
    background: #F1F0EC;
    color: #1a1a1a;
  }

  .unauth-hint {
    margin-top: 1.25rem;
    font-size: 12px;
    color: #9a9a9a;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  .unauth-hint i { font-size: 13px; }

  .unauth-hint-link {
    color: #6b6b6b;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 3px;
    background: none;
    border: none;
    font-family: inherit;
    font-size: inherit;
    padding: 0;
  }
`;

const Unauthorized = () => {
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  return (
    <div className="unauth-root">
      {/* Background geometry */}
      <svg
        className="unauth-bg-geo"
        viewBox="0 0 1440 900"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="120" cy="150" r="180" fill="#FCEBEB" opacity="0.45" />
        <circle cx="1320" cy="750" r="240" fill="#FCEBEB" opacity="0.35" />
        <circle cx="1260" cy="100" r="88" fill="#F7C1C1" opacity="0.3" />
        <circle cx="180" cy="800" r="110" fill="#F0AFAF" opacity="0.2" />
        <line
          x1="0"
          y1="400"
          x2="1440"
          y2="600"
          stroke="#F7C1C1"
          strokeWidth="0.5"
          opacity="0.5"
        />
        <line
          x1="0"
          y1="640"
          x2="1440"
          y2="280"
          stroke="#F7C1C1"
          strokeWidth="0.5"
          opacity="0.4"
        />
      </svg>

      <div className="unauth-card">
        {/* Lock icon */}
        <div className="unauth-icon-shell">
          <i className="ti ti-lock" aria-hidden="true" />
        </div>

        {/* Error badge */}
        <div className="unauth-badge">ERROR 403</div>

        {/* Heading */}
        <h1 className="unauth-title">Access Denied</h1>
        <p className="unauth-sub">
          You don&apos;t have permission to view this page.
          <br />
          Please contact your administrator or sign in with an authorized
          account.
        </p>

        <div className="unauth-divider" />

        {/* Actions */}
        <div className="unauth-actions">
          <a href="/" className="unauth-btn-primary">
            <i className="ti ti-home" aria-hidden="true" />
            Go home
          </a>
          <button
            className="unauth-btn-ghost"
            onClick={() => window.history.back()}
          >
            <i className="ti ti-arrow-left" aria-hidden="true" />
            Go back
          </button>
        </div>

        {/* Hint */}
        <div className="unauth-hint">
          <i className="ti ti-info-circle" aria-hidden="true" />
          Need access?
          <button className="unauth-hint-link">Request permission</button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
