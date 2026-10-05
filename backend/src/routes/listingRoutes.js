const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const c = require("../controllers/listingController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const v = require("../validators/listingValidators");

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many changes. Please slow down." },
});

// Public (static routes MUST come before "/:id")
router.get("/meta", c.getMeta);
router.get(
  "/price-summary",
  validate({ query: v.priceSummary }),
  c.getPriceSummary,
);
router.get("/", validate({ query: v.list }), c.getListings);

// Logged-in
router.get("/mine", protect, validate({ query: v.mine }), c.getMyListings);
router.post(
  "/",
  protect,
  writeLimiter,
  validate({ body: v.create }),
  c.createListing,
);

router.get("/:id", validate({ params: v.id }), c.getListing);
router.patch(
  "/:id",
  protect,
  writeLimiter,
  validate({ params: v.id, body: v.update }),
  c.updateListing,
);
router.delete(
  "/:id",
  protect,
  writeLimiter,
  validate({ params: v.id }),
  c.cancelListing,
);

module.exports = router;
