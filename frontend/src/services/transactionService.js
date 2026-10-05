// MOCK SERVICE. TEMPORARY. Fake data, no real API.
// Replace the body with a real call when Seid confirms the transaction endpoint.
// ASSUMPTION: field names and status values are guesses. Confirm with Seid.

const wait = (ms = 600) => new Promise((resolve) => setTimeout(resolve, ms));

const transactions = [
  {
    _id: "tx-1",
    listing: { _id: "mock-1", cropName: "Teff" },
    buyer: { _id: "user-2", name: "Kebede" },
    seller: { _id: "user-1", name: "Abebe" },
    quantity: 50,
    unit: "kg",
    pricePerUnit: 2200,
    totalAmount: 110000,
    status: "pending",
    paymentStatus: "pending",
    createdAt: "2026-10-03T09:30:00Z",
  },
  {
    _id: "tx-2",
    listing: { _id: "mock-2", cropName: "Onion" },
    buyer: { _id: "user-1", name: "Abebe" },
    seller: { _id: "user-3", name: "Chaltu" },
    quantity: 2,
    unit: "quintal",
    pricePerUnit: 4500,
    totalAmount: 9000,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2026-09-25T11:00:00Z",
  },
];

// Returns an array of the current user's transactions (as buyer or seller).
export async function getMyTransactions() {
  await wait();
  return transactions;
}
