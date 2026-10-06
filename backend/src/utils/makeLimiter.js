const rateLimit = require("express-rate-limit");
const env = require("../config/env");

module.exports = (options) =>
  rateLimit({
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => env.NODE_ENV === "test",
    ...options,
  });
