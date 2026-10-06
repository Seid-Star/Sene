import { useState } from "react";
import {
  formatPrice,
  formatQuantity,
  formatDate,
  getListingStatusLabel,
} from "../../utils/formatters";
import "./ListingCard.css";

// Props:
//   listing        - listing object (assumed shape, to be confirmed with Seid)
//   onViewDetails  - optional callback, receives the listing
//   children       - optional extra actions (e.g. Edit button on My Listings)
function ListingCard({ listing, onViewDetails, children }) {
  // Remember if the image failed to load, so we can show a placeholder.
  const [imageFailed, setImageFailed] = useState(false);

  if (!listing) return null;

  const {
    cropName,
    quantity,
    unit,
    pricePerUnit,
    totalPrice,
    location,
    imageUrl,
    status,
    createdAt,
    seller,
  } = listing;

  const title = cropName || "Unnamed crop";
  const showImage = imageUrl && !imageFailed;
  const statusKey = String(status ?? "unknown").toLowerCase();

  return (
    <article className="listing-card">
      <div className="listing-card__media">
        {showImage ? (
          <img
            src={imageUrl}
            alt={title}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="listing-card__placeholder" aria-hidden="true">
            🌾
          </div>
        )}
      </div>

      <div className="listing-card__body">
        <div className="listing-card__header">
          <h3 className="listing-card__title">{title}</h3>
          <span
            className={`listing-card__status listing-card__status--${statusKey}`}
          >
            {getListingStatusLabel(status)}
          </span>
        </div>

        <p className="listing-card__price">
          {formatPrice(pricePerUnit)}
          <span className="listing-card__per-unit">
            {unit ? ` / ${unit}` : ""}
          </span>
        </p>

        <dl className="listing-card__facts">
          <div>
            <dt>Quantity</dt>
            <dd>{formatQuantity(quantity, unit)}</dd>
          </div>
          {totalPrice != null && (
            <div>
              <dt>Total</dt>
              <dd>{formatPrice(totalPrice)}</dd>
            </div>
          )}
          <div>
            <dt>Location</dt>
            <dd>{location || "—"}</dd>
          </div>
          {seller?.name && (
            <div>
              <dt>Seller</dt>
              <dd>{seller.name}</dd>
            </div>
          )}
          <div>
            <dt>Listed</dt>
            <dd>{formatDate(createdAt)}</dd>
          </div>
        </dl>

        <div className="listing-card__actions">
          {onViewDetails && (
            <button
              type="button"
              className="listing-card__button"
              onClick={() => onViewDetails(listing)}
              aria-label={`View details for ${title}`}
            >
              View details
            </button>
          )}
          {children}
        </div>
      </div>
    </article>
  );
}

export default ListingCard;
