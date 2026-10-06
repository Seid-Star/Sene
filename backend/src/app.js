const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");
const mongoose = require("mongoose");
const makeLimiter = require("./utils/makeLimiter");
const env = require("./config/env");
const connectDB = require("./config/db");
const AppError = require("./utils/AppError");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const expireStaleReservations = require("./utils/expireReservations");

const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
      cb(new AppError("Origin not allowed by CORS", 403));
    },
    credentials: true,
  }),
);
if (env.NODE_ENV === "development") app.use(morgan("dev"));

app.use(
  makeLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 300,
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
      req.rawBody = buf;
    },
  }),
);
app.use(mongoSanitize());
app.use(hpp());

app.use("/api", (_req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.get("/api/health", (_req, res) => {
  const dbUp = mongoose.connection.readyState === 1;
  res.status(dbUp ? 200 : 503).json({
    success: dbUp,
    status: dbUp ? "ok" : "degraded",
    db: dbUp ? "connected" : "disconnected",
    uptime: Math.round(process.uptime()),
  });
});
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/listings", require("./routes/listingRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;

if (require.main === module) {
  process.on("unhandledRejection", (reason) =>
    console.error("Unhandled rejection:", reason),
  );

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

      setInterval(
        () =>
          expireStaleReservations().catch((e) =>
            console.error("Expiry job failed:", e.message),
          ),
        10 * 60 * 1000,
      ).unref();

      const shutdown = (signal) => {
        console.log(`${signal} received, shutting down...`);
        server.close(async () => {
          await mongoose.connection.close();
          process.exit(0);
        });
        setTimeout(() => process.exit(1), 10000).unref();
      };
      process.on("SIGTERM", () => shutdown("SIGTERM"));
      process.on("SIGINT", () => shutdown("SIGINT"));
    })
    .catch((err) => {
      console.error("❌ Failed to start:", err.message);
      process.exit(1);
    });
}
