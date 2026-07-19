// Application footer with stable product and legal links.
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <span>© 2026 SafeRoad · v1.0.0</span>
      <nav aria-label="Footer">
        <a href="#support">Support</a>
        <a href="#privacy">Privacy</a>
        <a href="#terms">Terms</a>
      </nav>
    </footer>
  );
};
