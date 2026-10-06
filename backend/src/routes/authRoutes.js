const router = require("express").Router();
const makeLimiter = require('../utils/makeLimiter');
const c = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");
const v = require("../validators/authValidators");

// Strict limiter for credential endpoints (brute-force protection)
const authLimiter = makeLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later.",
  },
});

router.post(
  "/register",
  authLimiter,
  validate({ body: v.register }),
  c.register,
);
router.post("/login", authLimiter, validate({ body: v.login }), c.login);

router.use(protect);
router.get("/me", c.getMe);
router.patch("/me", validate({ body: v.updateMe }), c.updateMe);
router.patch(
  "/change-password",
  authLimiter,
  validate({ body: v.changePassword }),
  c.changePassword,
);
router.post("/logout-all", c.logoutAll);

module.exports = router;
