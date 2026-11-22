import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import HotelCard from "../components/HotelCard";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import SuccessPopup from "../components/SuccessPopup";
import {
  clearSuccess,
  loadHotels,
  removeHotel,
  resetFilters,
  setMaxPrice,
  setMinPrice,
  setPage,
  setSearchTitle,
  setSort
} from "../store/hotelsSlice";

function HotelListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const resultsTopRef = useRef(null);

  const {
    items,
    total,
    page,
    limit,
    searchTitle,
    minPrice,
    maxPrice,
    sort,
    loading,
    error,
    successMessage
  } = useSelector(function (state) {
    return state.hotels;
  });

  // Local state for sidebar filter form inputs
  const [localTitle, setLocalTitle] = useState(searchTitle);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [hotelToDelete, setHotelToDelete] = useState(null);

  useEffect(
    function () {
      dispatch(loadHotels());
    },
    [dispatch, page, sort]
  );

  // Synchronize local filter inputs when Redux state changes (e.g. on reset or header search)
  useEffect(
    function () {
      setLocalTitle(searchTitle);
      setLocalMin(minPrice);
      setLocalMax(maxPrice);
    },
    [searchTitle, minPrice, maxPrice]
  );

  function handleApplyFilters(e) {
    if (e) e.preventDefault();
    dispatch(setSearchTitle(localTitle));
    dispatch(setMinPrice(localMin));
    dispatch(setMaxPrice(localMax));
    dispatch(setPage(1));
    dispatch(loadHotels());
  }

  function handleResetFilters() {
    setLocalTitle("");
    setLocalMin("");
    setLocalMax("");
    dispatch(resetFilters());
    dispatch(loadHotels());
  }

  function handleSortChange(e) {
    dispatch(setSort(e.target.value));
    dispatch(setPage(1));
  }

  function handlePageChange(nextPage) {
    dispatch(setPage(nextPage));
    // Scroll to the beginning of the hotel list after changing pages
    if (resultsTopRef.current) {
      resultsTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handleDeleteConfirm() {
    if (!hotelToDelete) {
      return;
    }
    dispatch(removeHotel(hotelToDelete.id)).then(function () {
      dispatch(loadHotels());
    });
    setHotelToDelete(null);
  }

  return (
    <main className="page list-page">
      <Helmet>
        <title>Hotel Listings | StayFind - NamlaTech Stays</title>
        <meta
          name="description"
          content="Browse luxury and budget hotels, filter by price range and hotel name, view on map and book your ideal stay."
        />
        <meta name="keywords" content="hotels, booking, stays, luxury resorts, hotel list, stayfind" />
      </Helmet>

      <div className="container main-layout">
        {/* Left Column: Filter Sidebar matching sample UI */}
        <aside className="sidebar-filters" aria-label="Filters">
          <div className="sidebar-card">
            {/* Filter by Title Section */}
            <div className="filter-section">
              <h3 className="filter-title">Search Hotel</h3>
              <div className="filter-input-group">
                <input
                  type="text"
                  value={localTitle}
                  onChange={function (e) {
                    setLocalTitle(e.target.value);
                  }}
                  onKeyDown={function (e) {
                    if (e.key === "Enter") handleApplyFilters(e);
                  }}
                  placeholder="Hotel name or keyword"
                  className="sidebar-input"
                  aria-label="Filter by hotel title"
                />
              </div>
            </div>

            {/* Price Filter Section with Min, Max & APPLY Button */}
            <div className="filter-section">
              <h3 className="filter-title">Price Range</h3>
              <div className="price-inputs-row">
                <div className="price-input-col">
                  <label htmlFor="min-price-input" className="small-label">Min (₹)</label>
                  <input
                    id="min-price-input"
                    type="number"
                    min="0"
                    value={localMin}
                    onChange={function (e) {
                      setLocalMin(e.target.value);
                    }}
                    placeholder="0"
                    className="sidebar-input price-num-input"
                  />
                </div>
                <div className="price-input-col">
                  <label htmlFor="max-price-input" className="small-label">Max (₹)</label>
                  <input
                    id="max-price-input"
                    type="number"
                    min="0"
                    value={localMax}
                    onChange={function (e) {
                      setLocalMax(e.target.value);
                    }}
                    placeholder="15000"
                    className="sidebar-input price-num-input"
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn-apply-filters"
                onClick={handleApplyFilters}
              >
                APPLY
              </button>
            </div>

            {/* Reset Filters Button */}
            <button
              type="button"
              className="btn-reset-filters"
              onClick={handleResetFilters}
            >
              Reset All Filters
            </button>
          </div>
        </aside>

        {/* Right Column: Hotel Listings & Pagination */}
        <section className="content-area" ref={resultsTopRef} aria-label="Hotel search results">
          {/* Results Topbar matching sample UI */}
          <div className="results-topbar">
            <div className="results-count">
              <strong>{total} items found</strong>
              {searchTitle ? <span className="active-filter-badge">Title: "{searchTitle}"</span> : null}
              {minPrice || maxPrice ? (
                <span className="active-filter-badge">
                  Price: ₹{minPrice || "0"} - ₹{maxPrice || "Any"}
                </span>
              ) : null}
            </div>

            <div className="results-controls">
              <label htmlFor="sort-select" className="sort-label">Sort by:</label>
              <select
                id="sort-select"
                className="sort-dropdown"
                value={sort}
                onChange={handleSortChange}
              >
                <option value="newest">Best match (Newest)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="oldest">Oldest listed</option>
              </select>
            </div>
          </div>

          {error ? <div className="alert-banner alert-error" role="alert">{error}</div> : null}

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading hotels...</p>
            </div>
          ) : null}

          {/* Cards List or Empty State */}
          {!loading && items.length === 0 ? (
            <div className="empty-state-box">
              <div className="empty-icon">🏨</div>
              <h2>No hotels found</h2>
              <p>We couldn't find any hotel matching your search filters.</p>
              <div className="empty-actions">
                <button type="button" className="btn btn-secondary" onClick={handleResetFilters}>
                  Clear Filters
                </button>
                <button type="button" className="btn btn-primary" onClick={function () { navigate("/hotels/new"); }}>
                  + Add New Hotel
                </button>
              </div>
            </div>
          ) : (
            <div className="hotel-items-list" aria-live="polite">
              {items.map(function (hotel) {
                return (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onEdit={function (id) {
                      navigate("/hotels/" + id + "/edit");
                    }}
                    onDelete={setHotelToDelete}
                  />
                );
              })}
            </div>
          )}

          {/* Pagination matching sample UI (< 1 2 3 >) */}
          <Pagination page={page} total={total} limit={limit} onPageChange={handlePageChange} />
        </section>
      </div>

      {/* Confirmation Dialog before deleting */}
      <ConfirmDialog
        open={Boolean(hotelToDelete)}
        title="Delete Hotel Listing?"
        message={
          hotelToDelete
            ? `Are you sure you want to delete "${hotelToDelete.title}"? This will permanently remove the record and its image.`
            : ""
        }
        onCancel={function () {
          setHotelToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      {/* Success Notification upon deletion, creation or update */}
      <SuccessPopup
        message={successMessage}
        onClose={function () {
          dispatch(clearSuccess());
        }}
      />
    </main>
  );
}

export default HotelListPage;
