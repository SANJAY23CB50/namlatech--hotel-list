import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-content-simple">
        <div className="footer-brand">
          <span className="brand-badge">NT</span>
          <strong>StayFind - Hotel Manager</strong>
        </div>
        <nav className="footer-nav-links" aria-label="Footer links">
          <Link to="/">Hotels</Link>
          <Link to="/hotels/new">Add Hotel</Link>
        </nav>
        <p className="copyright-text">
          © 2026 <strong>NamlaTech India Private Limited</strong>. Hotel List SPA.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
