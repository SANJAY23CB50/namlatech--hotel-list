import { Link } from "react-router-dom";
import { formatPrice, snippet } from "../utils/validation";

function HotelCard({ hotel, onEdit, onDelete }) {
  return (
    <article className="hotel-card">
      <Link to={"/hotels/" + hotel.id} className="card-media">
        <img src={hotel.image_path} alt={hotel.title} />
        <span className="price-chip">{formatPrice(hotel.price)} / night</span>
      </Link>
      <div className="card-body">
        <h3>
          <Link to={"/hotels/" + hotel.id}>{hotel.title}</Link>
        </h3>
        <p>{snippet(hotel.description, 90)}</p>
        <div className="card-actions">
          <Link className="btn btn-ghost" to={"/hotels/" + hotel.id}>
            View
          </Link>
          <button type="button" className="btn btn-ghost" onClick={function () { onEdit(hotel.id); }}>
            Edit
          </button>
          <button type="button" className="btn btn-danger-outline" onClick={function () { onDelete(hotel); }}>
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default HotelCard;
