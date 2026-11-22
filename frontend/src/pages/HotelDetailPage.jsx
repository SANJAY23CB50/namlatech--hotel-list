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
  const [geoMessage, setGeoMessage] = useState("Asking for your location...");
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(
    function () {
      dispatch(loadHotel(id));
    },
    [dispatch, id]
  );

  useEffect(
    function () {
      if (!navigator.geolocation) {
        setGeoMessage("Geolocation is not supported in this browser.");
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function (position) {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setGeoMessage("");
        },
        function () {
          setGeoMessage("Location permission was not granted. The map still shows the hotel coordinates.");
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
      <main className="page">
        <p className="muted">Loading hotel details...</p>
      </main>
    );
  }

  if (!current) {
    return (
      <main className="page">
        <Helmet>
          <title>Hotel not found | StayFind</title>
        </Helmet>
        <h1>Hotel not found</h1>
        <p>{error || "This listing is no longer available."}</p>
        <Link className="btn btn-primary" to="/">
          Back to hotels
        </Link>
      </main>
    );
  }

  const km =
    userLocation &&
    distanceKm(userLocation.latitude, userLocation.longitude, Number(current.latitude), Number(current.longitude));

  return (
    <main className="page">
      <Helmet>
        <title>{current.title} | StayFind</title>
        <meta name="description" content={current.description.slice(0, 150)} />
      </Helmet>

      <article className="detail">
        <img className="detail-image" src={current.image_path} alt={current.title} />
        <div className="detail-copy">
          <p className="eyebrow">Hotel details</p>
          <h1>{current.title}</h1>
          <p className="price-line">{formatPrice(current.price)} per night</p>
          <p>{current.description}</p>
          <dl className="coords">
            <div>
              <dt>Latitude</dt>
              <dd>{current.latitude}</dd>
            </div>
            <div>
              <dt>Longitude</dt>
              <dd>{current.longitude}</dd>
            </div>
          </dl>
          <div className="card-actions">
            <Link className="btn btn-ghost" to={"/hotels/" + current.id + "/edit"}>
              Edit
            </Link>
            <button type="button" className="btn btn-danger-outline" onClick={function () { setConfirmOpen(true); }}>
              Delete
            </button>
          </div>
        </div>
      </article>

      <section className="map-block">
        <h2>Location</h2>
        <p>
          Map marker uses the saved latitude and longitude. Your device location is read with the Geolocation API when
          permission is given.
        </p>
        {geoMessage ? <p className="muted">{geoMessage}</p> : null}
        {userLocation ? (
          <p>
            You are about {km.toFixed(1)} km away ({userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
            ).
          </p>
        ) : null}
        <iframe
          title={"Map showing " + current.title}
          src={mapSrc(current.latitude, current.longitude)}
          className="map-frame"
        />
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this hotel?"
        message={current.title + " will be removed."}
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
