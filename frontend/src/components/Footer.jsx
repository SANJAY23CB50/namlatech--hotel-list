import { Link } from "react-router-dom";

function Footer() {
  function handleNewsletter(e) {
    e.preventDefault();
    alert("Thank you for subscribing to hotel updates!");
  }

  return (
    <footer className="site-footer">
      <div className="container footer-content">
        <div className="footer-col brand-col">
          <div className="footer-brand">
            <span className="brand-badge">NT</span>
            <strong>StayFind</strong>
          </div>
          <p className="copyright-text">
            © 2026 Copyright: <strong>NamlaTech India Private Limited</strong>. All rights reserved.
          </p>
          <p className="footer-desc">
            Full-stack Hotel Management & Listing SPA with CRUD operations, interactive map, and location discovery.
          </p>
        </div>

        <div className="footer-col">
          <h4>EXPLORE</h4>
          <ul>
            <li><Link to="/">All Hotels</Link></li>
            <li><Link to="/hotels/new">Add New Hotel</Link></li>
            <li><a href="#featured">Featured Stays</a></li>
            <li><a href="#popular">Popular Cities</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>INFORMATION</h4>
          <ul>
            <li><a href="#help">Help Center</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#contact">Contact Support</a></li>
          </ul>
        </div>

        <div className="footer-col newsletter-col">
          <h4>NEWSLETTER</h4>
          <p>Stay in touch with latest hotel listings, seasonal discounts, and best deals.</p>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input type="email" placeholder="Your email address" required aria-label="Newsletter email" />
            <button type="submit" className="btn-join">JOIN</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span className="payment-icons">💳 Verified Booking Platform</span>
          <span className="lang-select">🌐 English (IN)</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
