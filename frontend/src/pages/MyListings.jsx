import { useCallback, useEffect, useState } from "react";
import ListingCard from "../components/listings/ListingCard";
import { getMyListings } from "../services/listingService";
import { DEFAULT_LANGUAGE, getPageLabels } from "./pageLabels";
import "./pages.css";

// ASSUMPTION: confirm these status values with Seid.
const AVAILABLE = ["active", "available"];
const SOLD = ["sold", "closed"];

const matchesFilter = (listing, filter) => {
  const status = String(listing.status ?? "").toLowerCase();
  if (filter === "available") return AVAILABLE.includes(status);
  if (filter === "sold") return SOLD.includes(status);
  return true;
};

// Props:
//   fetchListings   - async () => array. Defaults to the service.
//   onViewListing   - called with the listing when "View details" is tapped
//   onCreateNew     - optional, shows a "list new produce" button
//   lang            - 'am' | 'om' | 'en' (default 'am')
// Edit and status actions are left out until the backend supports them.
function MyListings({
  fetchListings = getMyListings,
  onViewListing,
  onCreateNew,
  lang = DEFAULT_LANGUAGE,
}) {
  const t = getPageLabels(lang).myListings;
  const [state, setState] = useState({
    status: "loading",
    items: [],
    error: "",
  });
  const [filter, setFilter] = useState("all");

  // Returns the new state instead of setting it, so the effect below
  // only updates state after the data arrives.
  const load = useCallback(async () => {
    try {
      const items = await fetchListings();
      return {
        status: "ready",
        items: Array.isArray(items) ? items : [],
        error: "",
      };
    } catch (error) {
      return { status: "error", items: [], error: error?.message || "" };
    }
  }, [fetchListings]);

  useEffect(() => {
    let cancelled = false;
    load().then((result) => {
      if (!cancelled) setState(result);
    });
    // Ignore a late answer if the page was closed meanwhile.
    return () => {
      cancelled = true;
    };
  }, [load]);

  const retry = () => {
    setState((previous) => ({ ...previous, status: "loading" }));
    load().then(setState);
  };

  const visible = state.items.filter((item) => matchesFilter(item, filter));

  let content;
  if (state.status === "loading") {
    content = (
      <p className="page__message" role="status">
        {t.loading}
      </p>
    );
  } else if (state.status === "error") {
    content = (
      <div className="page__message page__message--error" role="alert">
        <p>
          {t.errorText} {state.error}
        </p>
        <button type="button" className="page__button" onClick={retry}>
          {t.retry}
        </button>
      </div>
    );
  } else if (state.items.length === 0) {
    content = (
      <p className="page__message" role="status">
        {t.empty}
      </p>
    );
  } else if (visible.length === 0) {
    content = (
      <p className="page__message" role="status">
        {t.noneInFilter}
      </p>
    );
  } else {
    content = (
      <div className="page__grid">
        {visible.map((listing) => (
          <ListingCard
            key={listing._id}
            listing={listing}
            onViewDetails={onViewListing}
          />
        ))}
      </div>
    );
  }

  return (
    <main className="page" lang={lang}>
      <h1 className="page__title">{t.title}</h1>

      <div className="page__toolbar">
        <div className="page__tabs" role="group" aria-label={t.title}>
          {[
            ["all", t.tabAll],
            ["available", t.tabAvailable],
            ["sold", t.tabSold],
          ].map(([key, label]) => (
            <button
              key={key}
              type="button"
              className="page__tab"
              aria-pressed={filter === key}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
        {onCreateNew && (
          <button type="button" className="page__button" onClick={onCreateNew}>
            {t.addNew}
          </button>
        )}
      </div>

      {content}
    </main>
  );
}

export default MyListings;
