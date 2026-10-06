const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

const env = require("./config/env");
const connectDB = require("./config/db");
const AppError = require("./utils/AppError");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const expireStaleReservations = require("./utils/expireReservations");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1); // correct client IPs behind EthioDeploy's proxy (needed for rate limiting)

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      // no Origin header = server-to-server / curl / Postman
      if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
      cb(new AppError("Origin not allowed by CORS", 403));
    },
    credentials: true,
  }),
);
if (!env.isProd) app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please slow down.",
    },
  }),
);

app.use(
  express.json({
    limit: "10kb",
    verify: (req, _res, buf) => {
      req.rawBody = buf; // raw bytes, needed by Amir for webhook signature checks
    },
  }),
);
app.use(mongoSanitize()); // strips $ and . operators (NoSQL injection)
app.use(hpp()); // HTTP parameter pollution

// ---- Routes (ALWAYS after the security middleware above) ----
app.get("/api/health", (_req, res) =>
  res.json({ success: true, status: "ok" }),
);
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app; // exported for tests

if (require.main === module) {
  connectDB()
    .then(() => {
      const server = app.listen(env.PORT, () =>
        console.log(`🚀 Sene API running on port ${env.PORT}`),
      );

      server.on("error", (err) => {
        if (err.code === "EADDRINUSE") {
          console.error(
            `❌ Port ${env.PORT} is already in use. Change PORT in .env or stop the other process.`,
          );
        } else {
          console.error("❌ Server error:", err.message);
        }
        process.exit(1);
      });

      // Release listings whose accepted deals were never paid
      setInterval(
        () =>
          expireStaleReservations().catch((e) =>
            console.error("Expiry job failed:", e.message),
          ),
        10 * 60 * 1000,
      ).unref();
    })
    .catch((err) => {
      console.error("❌ Failed to start:", err.message);
      process.exit(1);
    });
}
