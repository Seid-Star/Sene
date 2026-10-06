const Transaction = require("../models/Transaction");
const Listing = require("../models/Listing");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const paymentService = require("../services/paymentService");
const { RESERVATION_HOURS } = require("../config/constants");

const PARTY = "fullName phone region town";
const PHONE_VISIBLE = ["accepted", "paid", "completed"];
const HOUR = 60 * 60 * 1000;

// Phones are hidden until the deal is accepted.
const present = (tx) => {
  const o = tx.toJSON();
  if (!PHONE_VISIBLE.includes(tx.status)) {
    for (const k of ["buyer", "seller"]) {
      if (o[k] && typeof o[k] === "object" && "phone" in o[k])
        delete o[k].phone;
    }
  }
  return o;
};

const sendTx = async (res, id, status = 200, extra = {}) => {
  const tx = await Transaction.findById(id)
    .populate("buyer", PARTY)
    .populate("seller", PARTY);
  res
    .status(status)
    .json({ success: true, ...extra, transaction: present(tx) });
};

const loadTx = async (req) => {
  const tx = await Transaction.findById(req.params.id);
  if (!tx) throw new AppError("Transaction not found", 404);
  return tx;
};

const isBuyer = (tx, user) => tx.buyer.equals(user._id);
const isSeller = (tx, user) => tx.seller.equals(user._id);

// Strangers get 404 (do not reveal that the transaction exists).
const requireRole = (tx, user, who) => {
  const ok = who === "buyer" ? isBuyer(tx, user) : isSeller(tx, user);
  if (!ok) throw new AppError("Transaction not found", 404);
};

// POST /api/transactions
exports.createTransaction = asyncHandler(async (req, res) => {
  const { listingId, note } = req.body;

  const listing = await Listing.findOne({ _id: listingId, status: "active" });
  if (!listing) throw new AppError("Listing is not available", 404);
  if (listing.seller.equals(req.user._id))
    throw new AppError("You cannot buy your own listing", 403);

  const duplicate = await Transaction.exists({
    listing: listing._id,
    buyer: req.user._id,
    status: { $in: ["requested", "accepted", "paid"] },
  });
  if (duplicate)
    throw new AppError(
      "You already have an open request for this listing",
      409,
    );

  const tx = await Transaction.create({
    listing: listing._id,
    buyer: req.user._id,
    seller: listing.seller,
    crop: listing.crop,
    quantityKg: listing.quantityKg,
    pricePerKg: listing.pricePerKg,
    totalPrice: listing.totalPrice,
    note,
  });

  await sendTx(res, tx._id, 201);
});

// GET /api/transactions
exports.getTransactions = asyncHandler(async (req, res) => {
  const { role, status, page, limit } = req.query;
  const me = req.user._id;

  const filter =
    role === "buyer"
      ? { buyer: me }
      : role === "seller"
        ? { seller: me }
        : { $or: [{ buyer: me }, { seller: me }] };
  if (status) filter.status = status;

  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("buyer", PARTY)
      .populate("seller", PARTY),
    Transaction.countDocuments(filter),
  ]);

  res.json({
    success: true,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
    transactions: items.map(present),
  });
});

// GET /api/transactions/:id
exports.getTransaction = asyncHandler(async (req, res) => {
  const tx = await loadTx(req);
  if (
    !isBuyer(tx, req.user) &&
    !isSeller(tx, req.user) &&
    req.user.role !== "admin"
  ) {
    throw new AppError("Transaction not found", 404);
  }
  await sendTx(res, tx._id);
});

// PATCH /api/transactions/:id/accept  (seller)
exports.acceptTransaction = asyncHandler(async (req, res) => {
  const tx = await loadTx(req);
  requireRole(tx, req.user, "seller");
  if (tx.status !== "requested")
    throw new AppError(`Cannot accept a ${tx.status} request`, 409);

  // 1) Atomically reserve the listing (only one accept can win)
  const reserved = await Listing.findOneAndUpdate(
    { _id: tx.listing, status: "active" },
    { status: "reserved" },
  );
  if (!reserved) throw new AppError("Listing is no longer available", 409);

  // 2) Atomically move the transaction forward
  const now = new Date();
  const accepted = await Transaction.findOneAndUpdate(
    { _id: tx._id, status: "requested" },
    {
      status: "accepted",
      acceptedAt: now,
      expiresAt: new Date(now.getTime() + RESERVATION_HOURS * HOUR),
    },
    { new: true },
  );
  if (!accepted) {
    await Listing.updateOne(
      { _id: tx.listing, status: "reserved" },
      { status: "active" },
    ); // roll back
    throw new AppError("Request is no longer pending", 409);
  }

  // 3) Other buyers' requests for this listing are declined
  await Transaction.updateMany(
    { listing: tx.listing, _id: { $ne: tx._id }, status: "requested" },
    { status: "rejected", rejectedAt: now },
  );

  await sendTx(res, tx._id);
});

// PATCH /api/transactions/:id/reject  (seller)
exports.rejectTransaction = asyncHandler(async (req, res) => {
  const tx = await loadTx(req);
  requireRole(tx, req.user, "seller");

  const updated = await Transaction.findOneAndUpdate(
    { _id: tx._id, status: "requested" },
    { status: "rejected", rejectedAt: new Date() },
  );
  if (!updated) throw new AppError(`Cannot reject a ${tx.status} request`, 409);
  await sendTx(res, tx._id);
});

// PATCH /api/transactions/:id/cancel  (buyer or seller, before payment)
exports.cancelTransaction = asyncHandler(async (req, res) => {
  const tx = await loadTx(req);
  if (!isBuyer(tx, req.user) && !isSeller(tx, req.user))
    throw new AppError("Transaction not found", 404);

  const wasAccepted = tx.status === "accepted";
  const updated = await Transaction.findOneAndUpdate(
    { _id: tx._id, status: { $in: ["requested", "accepted"] } },
    {
      status: "cancelled",
      cancelledAt: new Date(),
      cancelledBy: req.user._id,
      cancelReason: req.body.reason,
    },
  );
  if (!updated)
    throw new AppError(`Cannot cancel a ${tx.status} transaction`, 409);

  if (wasAccepted) {
    await Listing.updateOne(
      { _id: tx.listing, status: "reserved" },
      { status: "active" },
    );
  }
  await sendTx(res, tx._id);
});

// POST /api/transactions/:id/pay  (buyer)
exports.payTransaction = asyncHandler(async (req, res) => {
  const tx = await loadTx(req);
  requireRole(tx, req.user, "buyer");
  if (tx.status !== "accepted")
    throw new AppError("Only accepted deals can be paid", 409);
  if (tx.expiresAt && tx.expiresAt < new Date())
    throw new AppError("The payment window has expired", 409);

  const seller = await User.findById(tx.seller);
  const result = await paymentService.initiatePayment({
    transactionId: tx.id,
    amount: tx.totalPrice,
    currency: "ETB",
    buyer: req.user,
    seller,
  });

  // Give the buyer at least 30 more minutes to finish paying
  const minExpiry = new Date(Date.now() + 30 * 60 * 1000);
  await Transaction.updateOne(
    { _id: tx._id, status: "accepted" },
    {
      $set: {
        "payment.provider": result.provider || "links.et",
        "payment.reference": result.reference,
        "payment.checkoutUrl": result.checkoutUrl || null,
        "payment.status": "pending",
        expiresAt: tx.expiresAt > minExpiry ? tx.expiresAt : minExpiry,
      },
    },
  );

  await sendTx(res, tx._id, 200, { checkoutUrl: result.checkoutUrl || null });
});

// POST /api/transactions/payment-webhook  (called by Links.et, NOT by users)
exports.paymentWebhook = asyncHandler(async (req, res) => {
  const event = await paymentService.verifyWebhook(req); // throws 401 if the signature is bad

  const tx = await Transaction.findOne({
    "payment.reference": event.reference,
  });
  if (!tx) return res.json({ received: true }); // acknowledge without leaking anything

  if (event.status === "failed") {
    await Transaction.updateOne(
      { _id: tx._id, status: "accepted" },
      { "payment.status": "failed" },
    );
    return res.json({ received: true });
  }

  // Amount mismatch → do not mark as paid; flag for manual review
  if (
    event.amount != null &&
    Math.abs(Number(event.amount) - tx.totalPrice) > 0.01
  ) {
    await Transaction.updateOne(
      { _id: tx._id },
      { "payment.needsReview": true },
    );
    console.warn(`⚠️ Webhook amount mismatch for transaction ${tx.id}`);
    return res.json({ received: true });
  }

  const now = new Date();
  const paid = await Transaction.findOneAndUpdate(
    { _id: tx._id, status: "accepted" },
    {
      status: "paid",
      paidAt: now,
      "payment.status": "success",
      "payment.paidAt": now,
    },
    { new: true },
  );

  if (paid) {
    await Listing.updateOne({ _id: tx.listing }, { status: "sold" });
  } else if (!["paid", "completed"].includes(tx.status)) {
    // Money arrived for a cancelled/expired deal → needs manual refund/review
    await Transaction.updateOne(
      { _id: tx._id },
      { "payment.status": "success", "payment.needsReview": true },
    );
    console.warn(`⚠️ Late payment for ${tx.status} transaction ${tx.id}`);
  }
  // already paid/completed = duplicate webhook → idempotent no-op

  res.json({ received: true });
});

// PATCH /api/transactions/:id/complete  (buyer confirms delivery)
exports.completeTransaction = asyncHandler(async (req, res) => {
  const tx = await loadTx(req);
  requireRole(tx, req.user, "buyer");

  const updated = await Transaction.findOneAndUpdate(
    { _id: tx._id, status: "paid" },
    { status: "completed", completedAt: new Date() },
  );
  if (!updated) throw new AppError("Only paid deals can be completed", 409);
  await sendTx(res, tx._id);
});
