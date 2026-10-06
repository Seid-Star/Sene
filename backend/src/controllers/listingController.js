const Listing = require("../models/Listing");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const {
  CROPS,
  REGIONS,
  QUALITIES,
  MAX_ACTIVE_LISTINGS_PER_USER,
} = require("../config/constants");

// Never expose phone/email publicly.
const PUBLIC_SELLER = "fullName region town";

const round2 = (n) => (n == null ? null : Math.round(n * 100) / 100);

const paginate = (page, limit, total) => ({
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
});

// Load a listing and make sure the caller owns it (or is admin).
const getOwnedListing = async (req) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) throw new AppError("Listing not found", 404);
  const isOwner = listing.seller.equals(req.user._id);
  if (!isOwner && req.user.role !== "admin")
    throw new AppError("You do not own this listing", 403);
  return listing;
};

// GET /api/listings/meta
exports.getMeta = (_req, res) => {
  res.json({
    success: true,
    crops: CROPS,
    regions: REGIONS,
    qualities: QUALITIES,
  });
};

// GET /api/listings
exports.getListings = asyncHandler(async (req, res) => {
  const { crop, region, minPrice, maxPrice, minQty, sort, page, limit } =
    req.query;

  const filter = { status: "active" }; // the public only ever sees active listings
  if (crop) filter.crop = crop;
  if (region) filter.region = region;
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.pricePerKg = {};
    if (minPrice !== undefined) filter.pricePerKg.$gte = minPrice;
    if (maxPrice !== undefined) filter.pricePerKg.$lte = maxPrice;
  }
  if (minQty !== undefined) filter.quantityKg = { $gte: minQty };

  const sortMap = {
    newest: { createdAt: -1, _id: -1 },
    price_asc: { pricePerKg: 1, _id: 1 },
    price_desc: { pricePerKg: -1, _id: 1 },
  };

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .sort(sortMap[sort])
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("seller", PUBLIC_SELLER),
    Listing.countDocuments(filter),
  ]);

  res.json({ success: true, ...paginate(page, limit, total), listings });
});

// GET /api/listings/price-summary?crop=teff&region=Oromia
exports.getPriceSummary = asyncHandler(async (req, res) => {
  const { crop, region } = req.query;

  const summarize = async (match) => {
    const [s] = await Listing.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          minPricePerKg: { $min: "$pricePerKg" },
          maxPricePerKg: { $max: "$pricePerKg" },
          avgPricePerKg: { $avg: "$pricePerKg" },
          totalQuantityKg: { $sum: "$quantityKg" },
          totalValue: { $sum: { $multiply: ["$pricePerKg", "$quantityKg"] } },
        },
      },
    ]);
    if (!s)
      return {
        count: 0,
        minPricePerKg: null,
        maxPricePerKg: null,
        avgPricePerKg: null,
        weightedAvgPricePerKg: null,
        totalQuantityKg: 0,
      };
    return {
      count: s.count,
      minPricePerKg: round2(s.minPricePerKg),
      maxPricePerKg: round2(s.maxPricePerKg),
      avgPricePerKg: round2(s.avgPricePerKg),
      weightedAvgPricePerKg: round2(s.totalValue / s.totalQuantityKg),
      totalQuantityKg: s.totalQuantityKg,
    };
  };

  let scope = region ? "region" : "national";
  let summary = await summarize({
    status: "active",
    crop,
    ...(region && { region }),
  });

  // No listings in that region? Fall back to national so the voice assistant still has an answer.
  if (region && summary.count === 0) {
    summary = await summarize({ status: "active", crop });
    scope = "national";
  }

  res.json({
    success: true,
    crop,
    region: region || null,
    scope,
    currency: "ETB",
    unit: "kg",
    ...summary,
  });
});

// GET /api/listings/mine
exports.getMyListings = asyncHandler(async (req, res) => {
  const { status, page, limit } = req.query;
  const filter = { seller: req.user._id, ...(status && { status }) };

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Listing.countDocuments(filter),
  ]);

  res.json({ success: true, ...paginate(page, limit, total), listings });
});

// GET /api/listings/:id
exports.getListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findOne({
    _id: req.params.id,
    status: { $ne: "cancelled" },
  }).populate("seller", PUBLIC_SELLER);
  if (!listing) throw new AppError("Listing not found", 404);
  res.json({ success: true, listing });
});

// POST /api/listings
exports.createListing = asyncHandler(async (req, res) => {
  const activeCount = await Listing.countDocuments({
    seller: req.user._id,
    status: "active",
  });
  if (activeCount >= MAX_ACTIVE_LISTINGS_PER_USER) {
    throw new AppError(
      `You can have at most ${MAX_ACTIVE_LISTINGS_PER_USER} active listings`,
      403,
    );
  }

  const listing = await Listing.create({
    ...req.body,
    region: req.body.region || req.user.region, // validated by the model's enum
    town: req.body.town || req.user.town,
    seller: req.user._id, // always from the token, never from the body
  });

  res.status(201).json({ success: true, listing });
});

// PATCH /api/listings/:id
exports.updateListing = asyncHandler(async (req, res) => {
  const listing = await getOwnedListing(req);
  if (listing.status !== "active")
    throw new AppError("Only active listings can be edited", 409);

  Object.assign(listing, req.body);
  await listing.save();
  res.json({ success: true, listing });
});

// DELETE /api/listings/:id  (soft delete → status "cancelled")
exports.cancelListing = asyncHandler(async (req, res) => {
  const listing = await getOwnedListing(req);

  if (listing.status === "reserved" || listing.status === "sold") {
    throw new AppError(`A ${listing.status} listing cannot be cancelled`, 409);
  }
  if (listing.status !== "cancelled") {
    listing.status = "cancelled";
    await listing.save();
  }
  res.json({ success: true, message: "Listing cancelled", listing });
});
