import { useState } from "react";
import ListingForm from "../components/listings/ListingForm";
import { createListing } from "../services/listingService";
import { DEFAULT_LANGUAGE, getPageLabels } from "./pageLabels";
import "./pages.css";

// Props:
//   saveListing        - async (values) => listing. Defaults to the service.
//                        Replaceable so the page can be tested without the real API.
//   isAuthenticated    - false shows a "please log in" message (default true until
//                        Imran's AuthContext exists)
//   onCreated          - called with the created listing (Imran can navigate here)
//   onViewMyListings   - called when the user taps "view my listings"
//   lang               - 'am' | 'om' | 'en' (default 'am')
function CreateListing({
  saveListing = createListing,
  isAuthenticated = true,
  onCreated,
  onViewMyListings,
  lang = DEFAULT_LANGUAGE,
}) {
  const t = getPageLabels(lang).createListing;
  const [created, setCreated] = useState(null);
  // Changing the key gives the form a fresh, empty state.
  const [formKey, setFormKey] = useState(0);

  // ListingForm blocks double submits. If this throws, the form shows the message.
  const handleSubmit = async (values) => {
    const listing = await saveListing(values);
    // We only get here when the backend accepted the listing.
    setCreated(listing);
    if (onCreated) onCreated(listing);
  };

  const createAnother = () => {
    setCreated(null);
    setFormKey((key) => key + 1);
  };

  if (!isAuthenticated) {
    return (
      <main className="page" lang={lang}>
        <p className="page__message" role="alert">
          {t.loginRequired}
        </p>
      </main>
    );
  }

  return (
    <main className="page" lang={lang}>
      <h1 className="page__title">{t.title}</h1>

      {created ? (
        <section className="page__success" role="status">
          <h2>{t.successTitle}</h2>
          <p>{t.successText}</p>
          <div className="page__actions">
            <button
              type="button"
              className="page__button"
              onClick={createAnother}
            >
              {t.createAnother}
            </button>
            {onViewMyListings && (
              <button
                type="button"
                className="page__button page__button--secondary"
                onClick={onViewMyListings}
              >
                {t.viewMyListings}
              </button>
            )}
          </div>
        </section>
      ) : (
        <ListingForm key={formKey} lang={lang} onSubmit={handleSubmit} />
      )}
    </main>
  );
}

export default CreateListing;
