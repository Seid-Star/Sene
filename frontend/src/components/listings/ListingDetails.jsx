import { useRef, useState } from "react";
import {
  formatDate,
  formatPrice,
  formatQuantity,
  getListingStatusLabel,
} from "../../utils/formatters";
import {
  DEFAULT_LANGUAGE,
  getListingDetailsLabels,
} from "./listingDetailsLabels";
import "./ListingDetails.css";

// ASSUMPTION: these status values mean "can be bought". Confirm with Seid.
const AVAILABLE_STATUSES = ["active", "available"];

// Props:
//   listing               - listing object (assumed shape, confirm with Seid)
//   isLoading             - true while the parent is fetching
//   error                 - error message string from the parent, if any
//   currentUserId         - id of the logged-in user (to block buying own listing)
//   onRequestTransaction  - async (listing) => void, supplied by the page.
//                           This component never calls the API itself.
//   lang                  - 'am' | 'om' | 'en' (default 'am')
function ListingDetails({
  listing,
  isLoading = false,
  error = "",
  currentUserId,
  onRequestTransaction,
  lang = DEFAULT_LANGUAGE,
}) {
  const t = getListingDetailsLabels(lang);

  // Hooks must run before any early return, so they live at the top.
  const [imageFailed, setImageFailed] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const [requestError, setRequestError] = useState("");
  // A ref changes instantly, so it blocks a second tap before the button locks.
  const requestingRef = useRef(false);

  if (isLoading) {
    return (
      <p className="listing-details__message" role="status" lang={lang}>
        {t.loading}
      </p>
    );
  }

  if (error) {
    return (
      <p
        className="listing-details__message listing-details__message--error"
        role="alert"
        lang={lang}
      >
        {t.errorTitle} {error}
      </p>
    );
  }

  if (!listing) {
    return (
      <p className="listing-details__message" role="status" lang={lang}>
        {t.notFound}
      </p>
    );
  }

  const {
    cropName,
    quantity,
    unit,
    pricePerUnit,
    totalPrice,
    location,
    description,
    imageUrl,
    status,
    createdAt,
    seller,
  } = listing;

  const title = cropName || "—";
  const showImage = imageUrl && !imageFailed;
  const statusKey = String(status ?? "unknown").toLowerCase();
  const isAvailable = AVAILABLE_STATUSES.includes(statusKey);

  // ASSUMPTION: the seller id is seller._id or seller.id. Confirm with Seid.
  const sellerId = seller?._id ?? seller?.id;
  const isOwnListing =
    currentUserId != null &&
    sellerId != null &&
    String(currentUserId) === String(sellerId);

  const handleRequest = async () => {
    if (requestingRef.current) return;
    requestingRef.current = true;
    setRequesting(true);
    setRequestError("");

    try {
      await onRequestTransaction(listing);
      // This only means the request was SENT. The deal is not confirmed
      // until the backend says so.
      setRequestSent(true);
    } catch (err) {
      setRequestError(err?.message || t.requestFailed);
    } finally {
      requestingRef.current = false;
      setRequesting(false);
    }
  };

  // Decide what the buyer sees in the action area.
  let action;
  if (isOwnListing) {
    action = <p className="listing-details__note">{t.ownListing}</p>;
  } else if (!isAvailable) {
    action = <p className="listing-details__note">{t.notAvailable}</p>;
  } else if (requestSent) {
    action = (
      <p className="listing-details__success" role="status">
        {t.requestSent}
      </p>
    );
  } else if (onRequestTransaction) {
    action = (
      <>
        {requestError && (
          <p className="listing-details__alert" role="alert">
            {requestError}
          </p>
        )}
        <button
          type="button"
          className="listing-details__button"
          onClick={handleRequest}
          disabled={requesting}
          aria-busy={requesting}
        >
          {requesting ? t.sending : t.requestButton}
        </button>
      </>
    );
  }

  return (
    <article className="listing-details" lang={lang}>
      <div className="listing-details__media">
        {showImage ? (
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="listing-details__placeholder" aria-hidden="true">
            🌾
          </div>
        )}
      </div>

      <div className="listing-details__body">
        <div className="listing-details__header">
          <h2 className="listing-details__title">{title}</h2>
          <span className="listing-details__status">
            {getListingStatusLabel(status)}
          </span>
        </div>

        <p className="listing-details__price">
          {formatPrice(pricePerUnit)}
          {unit ? <span> / {unit}</span> : null}
        </p>

        <dl className="listing-details__facts">
          <div>
            <dt>{t.quantity}</dt>
            <dd>{formatQuantity(quantity, unit)}</dd>
          </div>
          {/* Only shown when the backend sends it. We never calculate totals. */}
          {totalPrice != null && (
            <div>
              <dt>{t.total}</dt>
              <dd>{formatPrice(totalPrice)}</dd>
            </div>
          )}
          <div>
            <dt>{t.location}</dt>
            <dd>{location || "—"}</dd>
          </div>
          {seller?.name && (
            <div>
              <dt>{t.seller}</dt>
              <dd>{seller.name}</dd>
            </div>
          )}
          <div>
            <dt>{t.listed}</dt>
            <dd>{formatDate(createdAt)}</dd>
          </div>
        </dl>

        <section className="listing-details__description">
          <h3>{t.description}</h3>
          <p>{description || t.noDescription}</p>
        </section>

        <div className="listing-details__action">{action}</div>
      </div>
    </article>
  );
}

export default ListingDetails;
