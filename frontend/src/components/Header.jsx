import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand">
          <span className="brand-mark">SF</span>
          <span>
            <strong>StayFind</strong>
            <small>Hotel list manager</small>
          </span>
        </Link>
        <nav className="nav">
          <NavLink to="/" end>
            Hotels
          </NavLink>
          <NavLink to="/hotels/new" className="nav-cta">
            Add hotel
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
