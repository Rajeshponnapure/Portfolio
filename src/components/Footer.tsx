import { PROFILE } from '../data/content';

export function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-grid">
        {/* About / Identity */}
        <div className="footer-section footer-identity">
          <div className="footer-brand">
            <span className="footer-mark">R</span>
            <span className="footer-name">{PROFILE.fullName}</span>
          </div>
          <p className="footer-tagline">{PROFILE.tagline}</p>
          <p className="footer-bio">
            {PROFILE.bio[0]}
          </p>
        </div>

        {/* What I Do */}
        <div className="footer-section footer-skills">
          <h3 className="footer-heading">What I Do</h3>
          <ul className="footer-list">
            {PROFILE.roles.map((role, i) => (
              <li key={i} className="footer-item">
                <span className="footer-bullet" aria-hidden="true">▸</span>
                <span>{role}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Details */}
        <div className="footer-section footer-contact">
          <h3 className="footer-heading">Contact</h3>
          <address className="footer-address">
            <a 
              href={`mailto:${PROFILE.email}`} 
              className="footer-link"
              aria-label={`Email: ${PROFILE.email}`}
            >
              <span className="footer-icon" aria-hidden="true">✉</span>
              <span>{PROFILE.email}</span>
            </a>
            <a 
              href={`tel:${PROFILE.phone}`} 
              className="footer-link"
              aria-label={`Phone: ${PROFILE.phone}`}
            >
              <span className="footer-icon" aria-hidden="true">📞</span>
              <span>{PROFILE.phone}</span>
            </a>
            <div className="footer-link footer-location">
              <span className="footer-icon" aria-hidden="true">📍</span>
              <span>{PROFILE.location}</span>
            </div>
          </address>
        </div>

        {/* Social Links */}
        <div className="footer-section footer-social">
          <h3 className="footer-heading">Connect</h3>
          <div className="footer-social-links">
            <a 
              href="https://github.com/Rajeshponnapure" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05a9.3 9.3 0 012.5-.34c.85 0 1.71.12 2.5.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0022 12.25C22 6.58 17.52 2 12 2Z"/>
              </svg>
              <span>GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/gnanarajeswarareddy/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M4.98 3.5a2.5 2.5 0 110 5.001 2.5 2.5 0 010-5.001ZM3 9h4v12H3V9Zm6 0h3.83v1.64h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V21H17.6v-5.45c0-1.3-.03-2.97-1.81-2.97-1.81 0-2.09 1.42-2.09 2.88V21H9V9Z"/>
              </svg>
              <span>LinkedIn</span>
            </a>
            <a 
              href="https://www.instagram.com/_rajeshponnapureddy_/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-social-link"
              aria-label="Instagram"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
              <span>Instagram</span>
            </a>
            <a 
              href="mailto:gnanarajeswarareddy1607@gmail.com" 
              className="footer-social-link"
              aria-label="Email"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <span>Email</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          Designed with logic, code and a lot of chai · © {new Date().getFullYear()} {PROFILE.short} Reddy
        </p>
        <p className="footer-made">
          Built with React, TypeScript, Framer Motion & Lenis
        </p>
      </div>
    </footer>
  );
}