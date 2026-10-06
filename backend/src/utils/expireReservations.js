const Transaction = require("../models/Transaction");
const Listing = require("../models/Listing");
const expireStaleReservations = async () => {
  const now = new Date();
  const stale = await Transaction.find({
    status: "accepted",
    expiresAt: { $lt: now },
  })
    .select("_id listing")
    .limit(200);

  for (const t of stale) {
    const r = await Transaction.updateOne(
      { _id: t._id, status: "accepted" },
      {
        status: "cancelled",
        cancelledAt: now,
        cancelReason: "Payment window expired",
      },
    );
    if (r.modifiedCount) {
      await Listing.updateOne(
        { _id: t.listing, status: "reserved" },
        { status: "active" },
      );
    }
  }
};

module.exports = expireStaleReservations;
