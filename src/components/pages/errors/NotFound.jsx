import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500&display=swap');

        .nf-root {
          min-height: 100vh;
          background-color: #f8f6f1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
        }

        .nf-bg-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(210, 180, 140, 0.12);
          animation: pulse-ring 6s ease-in-out infinite;
        }
        .nf-bg-circle-1 { width: 500px; height: 500px; top: -120px; right: -120px; animation-delay: 0s; }
        .nf-bg-circle-2 { width: 320px; height: 320px; bottom: -80px; left: -80px; animation-delay: 3s; }

        @keyframes pulse-ring {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.08); opacity: 1; }
        }

        .nf-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 4rem 3.5rem;
          max-width: 520px;
          width: 90%;
          box-shadow: 0 4px 40px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
          position: relative;
          z-index: 1;
          animation: card-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes card-in {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .nf-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #b07d4a;
          background: #f5ede0;
          border-radius: 100px;
          padding: 5px 14px;
          margin-bottom: 1.75rem;
        }

        .nf-number {
          font-family: 'Playfair Display', serif;
          font-size: clamp(6rem, 18vw, 9rem);
          font-weight: 900;
          line-height: 1;
          color: #1a1a1a;
          letter-spacing: -0.04em;
          margin-bottom: 0;
          position: relative;
          display: inline-block;
        }

        .nf-number::after {
          content: '';
          display: block;
          height: 4px;
          background: linear-gradient(90deg, #c8a06a, #e8c99a);
          border-radius: 2px;
          margin-top: 0.5rem;
          animation: line-grow 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
          transform-origin: left;
        }

        @keyframes line-grow {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }

        .nf-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .nf-desc {
          font-size: 0.95rem;
          color: #7a7a7a;
          line-height: 1.7;
          margin-bottom: 2.25rem;
          font-weight: 300;
        }

        .nf-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #1a1a1a;
          color: #ffffff !important;
          border-radius: 100px;
          padding: 0.75rem 1.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none !important;
          letter-spacing: 0.02em;
          transition: background 0.2s, transform 0.15s;
        }

        .nf-btn:hover {
          background: #b07d4a;
          transform: translateY(-2px);
        }

        .nf-btn svg {
          width: 16px;
          height: 16px;
          transition: transform 0.2s;
        }

        .nf-btn:hover svg {
          transform: translateX(3px);
        }

        .nf-divider {
          display: inline-block;
          width: 1px;
          height: 16px;
          background: rgba(255,255,255,0.35);
          margin: 0 4px;
        }

        .nf-link-secondary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.875rem;
          color: #7a7a7a !important;
          text-decoration: none !important;
          font-weight: 400;
          transition: color 0.2s;
        }

        .nf-link-secondary:hover {
          color: #1a1a1a !important;
        }

        .nf-footer {
          margin-top: 2.25rem;
          padding-top: 1.75rem;
          border-top: 1px solid #f0ece4;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        .nf-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #d4cdc2;
          display: inline-block;
        }
      `}</style>

      <div className="nf-root">
        <div className="nf-bg-circle nf-bg-circle-1" />
        <div className="nf-bg-circle nf-bg-circle-2" />

        <div className="nf-card text-center text-md-start">
          <span className="nf-badge">Error 404</span>

          <div>
            <span className="nf-number">404</span>
          </div>

          <h2 className="nf-title">Page not found</h2>
          <p className="nf-desc">
            The page you're looking for has been moved, deleted, or never
            existed. Let's get you back somewhere useful.
          </p>

          <div className="d-flex align-items-center flex-wrap gap-3">
            <Link to="/" className="nf-btn">
              Go home
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="nf-footer">
            <Link to="/contact" className="nf-link-secondary">
              Contact support
            </Link>
            <span className="nf-dot" />
            <Link to="/sitemap" className="nf-link-secondary">
              Sitemap
            </Link>
            <span className="nf-dot" />
            <button
              onClick={() => window.history.back()}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              className="nf-link-secondary"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
