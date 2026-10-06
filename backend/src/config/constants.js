const CROPS = [
  "teff",
  "onion",
  "tomato",
  "potato",
  "wheat",
  "maize",
  "barley",
  "sorghum",
  "coffee",
  "other",
];

const REGIONS = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Central Ethiopia",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "South Ethiopia",
  "South West Ethiopia",
  "Tigray",
];

const QUALITIES = ["ungraded", "grade1", "grade2", "grade3"];
const LISTING_STATUSES = ["active", "reserved", "sold", "cancelled"];
const MAX_ACTIVE_LISTINGS_PER_USER = 50;

const TRANSACTION_STATUSES = [
  "requested",
  "accepted",
  "rejected",
  "cancelled",
  "paid",
  "completed",
];
const RESERVATION_HOURS = 24;

module.exports = {
  CROPS,
  REGIONS,
  QUALITIES,
  LISTING_STATUSES,
  MAX_ACTIVE_LISTINGS_PER_USER,
  TRANSACTION_STATUSES,
  RESERVATION_HOURS,
};
