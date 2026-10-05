// All text for ListingDetails lives here.
// NOTE: Amharic (am) and Afaan Oromoo (om) texts must be reviewed by a native speaker.

export const DEFAULT_LANGUAGE = "am";

export const LISTING_DETAILS_LABELS = {
  am: {
    loading: "በመጫን ላይ…",
    notFound: "ይህ ምርት አልተገኘም።",
    errorTitle: "ምርቱን መጫን አልተቻለም።",
    pricePerUnit: "የአንድ መለኪያ ዋጋ",
    quantity: "ብዛት",
    total: "ጠቅላላ ዋጋ",
    location: "አካባቢ",
    seller: "ሻጭ",
    listed: "የተለጠፈበት ቀን",
    description: "መግለጫ",
    noDescription: "መግለጫ አልተሰጠም።",
    requestButton: "ለመግዛት ጥያቄ ላክ",
    sending: "በመላክ ላይ…",
    requestSent: "ጥያቄዎ ተልኳል። ሻጩ እስኪያረጋግጥ ይጠብቁ።",
    ownListing: "ይህ የእርስዎ ምርት ነው።",
    notAvailable: "ይህ ምርት አሁን አይገኝም።",
    requestFailed: "ጥያቄውን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።",
  },

  om: {
    loading: "Fe’aa jira…",
    notFound: "Oomishni kun hin argamne.",
    errorTitle: "Oomisha fe’uun hin danda’amne.",
    pricePerUnit: "Gatii safartuu tokkoo",
    quantity: "Hanga",
    total: "Gatii waliigalaa",
    location: "Bakka",
    seller: "Gurgurtaa",
    listed: "Guyyaa maxxanfame",
    description: "Ibsa",
    noDescription: "Ibsi hin kennamne.",
    requestButton: "Gaaffii bituu ergi",
    sending: "Ergaa jira…",
    requestSent:
      "Gaaffiin kee ergameera. Gurgurtaan hanga mirkaneessutti eegi.",
    ownListing: "Oomishni kun kan kee ti.",
    notAvailable: "Oomishni kun amma hin jiru.",
    requestFailed: "Gaaffii erguun hin danda’amne. Mee irra deebi’ii yaali.",
  },

  en: {
    loading: "Loading…",
    notFound: "This listing was not found.",
    errorTitle: "Could not load this listing.",
    pricePerUnit: "Price per unit",
    quantity: "Quantity",
    total: "Total price",
    location: "Location",
    seller: "Seller",
    listed: "Listed on",
    description: "Description",
    noDescription: "No description provided.",
    requestButton: "Request to buy",
    sending: "Sending…",
    requestSent: "Your request was sent. Wait for the seller to confirm.",
    ownListing: "This is your own listing.",
    notAvailable: "This listing is not available now.",
    requestFailed: "Could not send the request. Please try again.",
  },
};

// Unknown language codes fall back to English instead of crashing.
export const getListingDetailsLabels = (lang) =>
  LISTING_DETAILS_LABELS[lang] ?? LISTING_DETAILS_LABELS.en;
