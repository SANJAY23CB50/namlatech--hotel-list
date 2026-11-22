import { Link } from "react-router-dom";
import { formatPrice, snippet } from "../utils/validation";

function HotelCard({ hotel, onEdit, onDelete }) {
  return (
    <article className="hotel-card horizontal-card" aria-label={hotel.title}>
      {/* Left: Thumbnail Image with Alt Tag */}
      <Link to={"/hotels/" + hotel.id} className="card-media-col" title={"View details for " + hotel.title}>
        <img
          src={hotel.image_path}
          alt={"Photograph of " + hotel.title}
          loading="lazy"
          className="hotel-thumb-img"
          onError={function (e) {
            e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80";
          }}
        />
      </Link>

      {/* Center: Title, Description Snippet & Coordinates */}
      <div className="card-info-col">
        <div className="card-header-line">
          <h2 className="hotel-title">
            <Link to={"/hotels/" + hotel.id}>{hotel.title}</Link>
          </h2>
        </div>

        <p className="hotel-snippet">{snippet(hotel.description, 160)}</p>

        <div className="features-row">
          <span className="feature-pill coords-pill">
            📍 Coordinates: {Number(hotel.latitude).toFixed(4)}, {Number(hotel.longitude).toFixed(4)}
          </span>
        </div>
      </div>

      {/* Right: Price & Action Buttons */}
      <div className="card-action-col">
        <div className="price-box">
          <div className="price-value">{formatPrice(hotel.price)}</div>
          <div className="price-term">per night</div>
        </div>

        <div className="card-buttons">
          <Link to={"/hotels/" + hotel.id} className="btn-buy-this" title="View full hotel details">
            VIEW DETAILS
          </Link>
          <div className="sub-actions">
            <button
              type="button"
              className="btn-card-edit"
              onClick={function () {
                onEdit(hotel.id);
              }}
              title="Edit hotel details"
            >
              Edit
            </button>
            <button
              type="button"
              className="btn-card-delete"
              onClick={function () {
                onDelete(hotel);
              }}
              title="Delete hotel listing"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default HotelCard;
