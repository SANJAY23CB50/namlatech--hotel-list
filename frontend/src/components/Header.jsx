import { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loadHotels, setPage, setSearchTitle } from "../store/hotelsSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const searchTitle = useSelector(function (state) {
    return state.hotels.searchTitle;
  });
  const [localSearch, setLocalSearch] = useState(searchTitle);

  function handleSearchSubmit(e) {
    e.preventDefault();
    dispatch(setSearchTitle(localSearch));
    dispatch(setPage(1));
    dispatch(loadHotels());
    if (location.pathname !== "/") {
      navigate("/");
    }
  }

  // Get current breadcrumbs based on pathname
  let pageTitle = "Hotels & Stays";
  let breadcrumbItem = "Listings";
  if (location.pathname === "/hotels/new") {
    pageTitle = "Add New Hotel";
    breadcrumbItem = "Add Hotel";
  } else if (location.pathname.endsWith("/edit")) {
    pageTitle = "Edit Hotel Details";
    breadcrumbItem = "Edit Hotel";
  } else if (location.pathname.startsWith("/hotels/")) {
    pageTitle = "Hotel Details & Map";
    breadcrumbItem = "Hotel Detail";
  }

  return (
    <header className="site-header">
      {/* Top Navbar */}
      <div className="top-nav">
        <div className="container top-nav-inner">
          <Link to="/" className="brand" aria-label="NamlaTech StayFind Home">
            <span className="brand-logo-badge">NT</span>
            <div className="brand-text">
              <strong className="brand-title">NamlaTech <span className="brand-sub">StayFind</span></strong>
              <small className="brand-tagline">Hotel Management & Discovery</small>
            </div>
          </Link>

          <form className="header-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              value={localSearch}
              onChange={function (e) {
                setLocalSearch(e.target.value);
              }}
              placeholder="Search hotel by name..."
              aria-label="Search hotels by title"
            />
            <button type="submit" className="header-search-btn" title="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          <nav className="header-nav" aria-label="Main navigation">
            <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Hotels
            </NavLink>
            <NavLink to="/hotels/new" className="btn-add-hotel">
              + Add Hotel
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Blue Sub-header / Breadcrumb Banner matching sample UI */}
      <div className="hero-banner">
        <div className="container hero-inner">
          <h1 className="hero-heading">{pageTitle}</h1>
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span className="breadcrumb-sep">»</span>
            <Link to="/">Hotels</Link>
            <span className="breadcrumb-sep">»</span>
            <span className="breadcrumb-current">{breadcrumbItem}</span>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
