const env = require("../config/env");

const notFound = (req, res) =>
  res
    .status(404)
    .json({
      success: false,
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    });

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message;
  let details = err.details;

  if (err.name === "ZodError") {
    status = 400;
    message = "Validation failed";
    details = err.issues.map((i) => ({
      field: i.path.join("."),
      message: i.message,
    }));
  } else if (err.name === "ValidationError") {
    status = 400;
    message = "Validation failed";
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === "CastError") {
    status = 400;
    message = `Invalid ${err.path}`;
  } else if (err.code === 11000) {
    status = 409;
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    message = `${field} is already registered`;
  } else if (
    err.name === "JsonWebTokenError" ||
    err.name === "TokenExpiredError"
  ) {
    status = 401;
    message = "Invalid or expired token";
  } else if (err.type === "entity.parse.failed") {
    status = 400;
    message = "Malformed JSON body";
  } else if (err.type === "entity.too.large") {
    status = 413;
    message = "Request body too large";
  }

  if (status >= 500) {
    console.error(err);
    if (env.isProd) message = "Internal server error"; // never leak internals
  }

  res.status(status).json({
    success: false,
    message,
    ...(details && { details }),
    ...(!env.isProd && status >= 500 && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
