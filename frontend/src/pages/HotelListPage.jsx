import { useEffect, useState } from "react";
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
  setMaxPrice,
  setMinPrice,
  setPage,
  setSearchTitle
} from "../store/hotelsSlice";

function HotelListPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total, page, limit, searchTitle, minPrice, maxPrice, loading, error, successMessage } = useSelector(
    function (state) {
      return state.hotels;
    }
  );
  const [hotelToDelete, setHotelToDelete] = useState(null);

  useEffect(
    function () {
      dispatch(loadHotels());
    },
    [dispatch, page]
  );

  function handleSearch(event) {
    event.preventDefault();
    dispatch(setPage(1));
    dispatch(loadHotels());
  }

  function handlePageChange(nextPage) {
    dispatch(setPage(nextPage));
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
    <main className="page">
      <Helmet>
        <title>Hotels | StayFind</title>
        <meta name="description" content="Browse, search and manage hotel listings by title and price." />
      </Helmet>

      <section className="hero">
        <div>
          <p className="eyebrow">Hotel list</p>
          <h1>Find and manage stays</h1>
          <p className="lede">Search by name, filter by price, then open a hotel for full details and map location.</p>
        </div>
      </section>

      <form className="filters" onSubmit={handleSearch}>
        <label>
          <span>Search by title</span>
          <input
            value={searchTitle}
            onChange={function (event) {
              dispatch(setSearchTitle(event.target.value));
            }}
            placeholder="Search hotels"
          />
        </label>
        <label>
          <span>Min price</span>
          <input
            type="number"
            min="0"
            value={minPrice}
            onChange={function (event) {
              dispatch(setMinPrice(event.target.value));
            }}
            placeholder="0"
          />
        </label>
        <label>
          <span>Max price</span>
          <input
            type="number"
            min="0"
            value={maxPrice}
            onChange={function (event) {
              dispatch(setMaxPrice(event.target.value));
            }}
            placeholder="10000"
          />
        </label>
        <button type="submit" className="btn btn-primary">
          Apply
        </button>
      </form>

      {error ? <p className="banner error">{error}</p> : null}

      {loading ? <p className="muted">Loading hotels...</p> : null}

      {!loading && items.length === 0 ? (
        <div className="empty-state">
          <h2>No hotels to show</h2>
          <p>Add a hotel or widen the search and price range.</p>
          <button type="button" className="btn btn-primary" onClick={function () { navigate("/hotels/new"); }}>
            Add hotel
          </button>
        </div>
      ) : (
        <section className="card-grid" aria-live="polite">
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
        </section>
      )}

      <Pagination page={page} total={total} limit={limit} onPageChange={handlePageChange} />

      <ConfirmDialog
        open={Boolean(hotelToDelete)}
        title="Delete this hotel?"
        message={hotelToDelete ? hotelToDelete.title + " will be removed from the list." : ""}
        onCancel={function () {
          setHotelToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      <SuccessPopup message={successMessage} onClose={function () { dispatch(clearSuccess()); }} />
    </main>
  );
}

export default HotelListPage;
