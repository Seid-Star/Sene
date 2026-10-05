// MOCK SERVICE. TEMPORARY. Fake data, no real API.
// When Seid confirms the endpoints, replace the BODIES of these functions with
// real calls. Keep the function names and return shapes so the pages don't change.
// ASSUMPTION: the fields below are guesses. Confirm them with Seid.

const wait = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

// Fake logged-in user, used only by the mock.
export const MOCK_CURRENT_USER_ID = "user-1";

let listings = [
  {
    _id: "mock-1",
    cropName: "Teff",
    quantity: 50,
    unit: "kg",
    pricePerUnit: 2200,
    location: "Adama",
    description: "White teff, harvested this month.",
    status: "active",
    createdAt: "2026-10-01T08:00:00Z",
    seller: { _id: MOCK_CURRENT_USER_ID, name: "Abebe" },
  },
  {
    _id: "mock-2",
    cropName: "Onion",
    quantity: 3,
    unit: "quintal",
    pricePerUnit: 4500,
    location: "Bishoftu",
    description: "",
    status: "sold",
    createdAt: "2026-09-20T08:00:00Z",
    seller: { _id: MOCK_CURRENT_USER_ID, name: "Abebe" },
  },
];

// Returns an array of the current user's listings.
export async function getMyListings() {
  await wait();
  return listings.filter((item) => item.seller._id === MOCK_CURRENT_USER_ID);
}

// Receives the values from ListingForm. Returns the created listing.
// Throw an Error with a readable message if the backend rejects it.
export async function createListing(values) {
  await wait(1000);
  const created = {
    ...values,
    _id: `mock-${Date.now()}`,
    status: "active",
    createdAt: new Date().toISOString(),
    seller: { _id: MOCK_CURRENT_USER_ID, name: "Abebe" },
  };
  listings = [created, ...listings];
  return created;
}
