import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "../components/ConfirmDialog";
import SuccessPopup from "../components/SuccessPopup";
import { clearSuccess, loadHotel, removeHotel } from "../store/hotelsSlice";
import { distanceKm, formatPrice } from "../utils/validation";

function mapSrc(lat, lng) {
  const delta = 0.02;
  const left = Number(lng) - delta;
  const right = Number(lng) + delta;
  const top = Number(lat) + delta;
  const bottom = Number(lat) - delta;
  return (
    "https://www.openstreetmap.org/export/embed.html?bbox=" +
    left +
    "%2C" +
    bottom +
    "%2C" +
    right +
    "%2C" +
    top +
    "&layer=mapnik&marker=" +
    lat +
    "%2C" +
    lng
  );
}

function HotelDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current, loading, error, successMessage } = useSelector(function (state) {
    return state.hotels;
  });
  const [userLocation, setUserLocation] = useState(null);
  const [geoMessage, setGeoMessage] = useState("Requesting your device location to calculate distance...");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(
    function () {
      dispatch(loadHotel(id));
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [dispatch, id]
  );

  useEffect(
    function () {
      if (!navigator.geolocation) {
        setGeoMessage("HTML5 Geolocation is not supported by your browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setGeoMessage("Location acquired successfully.");
        },
        function () {
          setGeoMessage("Location permission was not granted. The map is still displaying the hotel coordinates.");
        }
      );
    },
    []
  );

  function handleDeleted() {
    dispatch(clearSuccess());
    navigate("/");
  }

  if (loading) {
    return (
      <main className="page detail-page">
        <div className="container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading hotel details...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!current) {
    return (
      <main className="page detail-page">
        <Helmet>
          <title>Hotel Not Found | StayFind</title>
        </Helmet>
        <div className="container">
          <div className="empty-state-box">
            <h2>Hotel Not Found</h2>
            <p>{error || "This hotel listing could not be found or has been removed."}</p>
            <Link className="btn btn-primary" to="/">
              Back to Hotel Listings
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const km =
    userLocation &&
    distanceKm(userLocation.latitude, userLocation.longitude, Number(current.latitude), Number(current.longitude));

  return (
    <main className="page detail-page">
      <Helmet>
        <title>{`${current.title} | StayFind Hotel Details`}</title>
        <meta name="description" content={current.description.slice(0, 160)} />
        <meta property="og:title" content={current.title} />
        <meta property="og:description" content={current.description.slice(0, 160)} />
        <meta property="og:image" content={current.image_path} />
      </Helmet>

      <div className="container">
        <div className="detail-nav-bar">
          <Link to="/" className="btn-back-link">
            ← Back to Hotel Listings
          </Link>
        </div>

        {/* Hotel Info Card */}
        <article className="detail-card">
          <div className="detail-media">
            <img
              src={current.image_path}
              alt={`Full photograph of ${current.title}`}
              className="detail-main-img"
              onError={function (e) {
                e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop&q=80";
              }}
            />
          </div>

          <div className="detail-info">
            <div className="detail-badge-row">
              <span className="badge-luxury">Verified Stay</span>
              <span className="badge-free-cancel">Free cancellation available</span>
            </div>

            <h1 className="detail-title">{current.title}</h1>

            <div className="detail-price-line">
              <span className="price-amount">{formatPrice(current.price)}</span>
              <span className="price-period">/ night (inclusive of taxes)</span>
            </div>

            <p className="detail-desc">{current.description}</p>

            <div className="coords-card">
              <h3 className="coords-card-title">Geographical Coordinates</h3>
              <div className="coords-grid">
                <div className="coord-item">
                  <span className="coord-label">Latitude</span>
                  <strong className="coord-value">{Number(current.latitude).toFixed(6)}°</strong>
                </div>
                <div className="coord-item">
                  <span className="coord-label">Longitude</span>
                  <strong className="coord-value">{Number(current.longitude).toFixed(6)}°</strong>
                </div>
              </div>
            </div>

            <div className="detail-actions">
              <Link className="btn btn-secondary" to={"/hotels/" + current.id + "/edit"}>
                ✏️ Edit Hotel Details
              </Link>
              <button
                type="button"
                className="btn btn-danger"
                onClick={function () {
                  setConfirmOpen(true);
                }}
              >
                🗑️ Delete Listing
              </button>
            </div>
          </div>
        </article>

        {/* Map & Geolocation Section */}
        <section className="map-section">
          <div className="map-section-header">
            <div>
              <h2 className="map-title">Interactive Map & Geolocation</h2>
              <p className="map-subtitle">
                Interactive OpenStreetMap marker centered on the hotel's coordinates, paired with HTML5 Geolocation API distance calculation.
              </p>
            </div>
          </div>

          {/* User Location / Geolocation Status Banner */}
          <div className="geo-status-box">
            <div className="geo-icon">📍</div>
            <div className="geo-content">
              {userLocation ? (
                <div>
                  <strong>Your Device Coordinates:</strong> {userLocation.latitude.toFixed(4)}°, {userLocation.longitude.toFixed(4)}°
                  <div className="distance-highlight">
                    📏 Straight-line distance to {current.title}: <strong>{km.toFixed(1)} km</strong> away.
                  </div>
                </div>
              ) : (
                <div>{geoMessage}</div>
              )}
            </div>
          </div>

          <div className="map-embed-wrapper">
            <iframe
              title={`OpenStreetMap location for ${current.title}`}
              src={mapSrc(current.latitude, current.longitude)}
              className="map-iframe"
              loading="lazy"
            />
          </div>
        </section>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete Hotel Listing?"
        message={`Are you sure you want to permanently delete "${current.title}"?`}
        onCancel={function () {
          setConfirmOpen(false);
        }}
        onConfirm={function () {
          setConfirmOpen(false);
          dispatch(removeHotel(current.id));
        }}
      />

      <SuccessPopup message={successMessage} onClose={handleDeleted} />
    </main>
  );
}

export default HotelDetailPage;
