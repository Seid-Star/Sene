const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const c = require("../controllers/transactionController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const v = require("../validators/transactionValidators");

const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many actions. Please slow down." },
});

const webhookLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
router.post("/payment-webhook", webhookLimiter, c.paymentWebhook);

router.use(protect);

router.get("/", validate({ query: v.list }), c.getTransactions);
router.post(
  "/",
  writeLimiter,
  validate({ body: v.create }),
  c.createTransaction,
);
router.get("/:id", validate({ params: v.id }), c.getTransaction);

router.patch(
  "/:id/accept",
  writeLimiter,
  validate({ params: v.id }),
  c.acceptTransaction,
);
router.patch(
  "/:id/reject",
  writeLimiter,
  validate({ params: v.id }),
  c.rejectTransaction,
);
router.patch(
  "/:id/cancel",
  writeLimiter,
  validate({ params: v.id, body: v.cancel }),
  c.cancelTransaction,
);
router.post(
  "/:id/pay",
  writeLimiter,
  validate({ params: v.id }),
  c.payTransaction,
);
router.patch(
  "/:id/complete",
  writeLimiter,
  validate({ params: v.id }),
  c.completeTransaction,
);

module.exports = router;
