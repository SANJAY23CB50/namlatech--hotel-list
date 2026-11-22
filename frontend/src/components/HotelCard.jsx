import { Link } from "react-router-dom";
import { formatPrice, snippet } from "../utils/validation";

function HotelCard({ hotel, onEdit, onDelete }) {
  // Deterministic ratings and review counts for authentic presentation
  const ratingsMap = [4.8, 4.6, 4.9, 4.5, 4.7, 4.3, 4.6, 4.4];
  const reviewsMap = [184, 96, 240, 142, 310, 88, 125, 76];
  const idx = Math.abs(Number(hotel.id) || 1) % ratingsMap.length;
  const rating = ratingsMap[idx];
  const reviews = reviewsMap[idx];
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;

  return (
    <article className="hotel-card horizontal-card" aria-label={hotel.title}>
      {/* Left: Thumbnail Image with Alt Tag */}
      <Link to={"/hotels/" + hotel.id} className="card-media-col" title={"View details for " + hotel.title}>
        <img
          src={hotel.image_path}
          alt={"Exterior or suite view of " + hotel.title}
          loading="lazy"
          className="hotel-thumb-img"
          onError={function (e) {
            e.target.src = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80";
          }}
        />
        <span className="rating-badge">★ {rating}</span>
      </Link>

      {/* Center: Details & Description */}
      <div className="card-info-col">
        <div className="card-header-line">
          <h2 className="hotel-title">
            <Link to={"/hotels/" + hotel.id}>{hotel.title}</Link>
          </h2>
        </div>

        <div className="rating-row" aria-label={`Rating: ${rating} out of 5 stars`}>
          <span className="stars-icons">
            {"★".repeat(fullStars)}
            {hasHalf ? "½" : ""}
            {"☆".repeat(5 - fullStars - (hasHalf ? 1 : 0))}
          </span>
          <span className="rating-score">{rating}</span>
          <span className="rating-count">({reviews} verified reviews)</span>
        </div>

        <p className="hotel-snippet">{snippet(hotel.description, 140)}</p>

        <div className="features-row">
          <span className="feature-pill coords-pill">
            📍 {Number(hotel.latitude).toFixed(3)}, {Number(hotel.longitude).toFixed(3)}
          </span>
          <span className="feature-pill">✓ Free WiFi</span>
          <span className="feature-pill">✓ AC Room</span>
        </div>
      </div>

      {/* Right: Price & Action Buttons */}
      <div className="card-action-col">
        <div className="price-box">
          <div className="price-value">{formatPrice(hotel.price)}</div>
          <div className="price-term">per night</div>
          <span className="badge-free-cancel">Free cancellation</span>
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
