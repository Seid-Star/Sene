const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/generateToken");

const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const decoded = verifyToken(header.split(" ")[1]); // JWT errors handled centrally → 401
  const user = await User.findById(decoded.sub);

  if (!user || !user.isActive)
    throw new AppError("Account not found or disabled", 401);
  if (user.tokenVersion !== decoded.tv)
    throw new AppError("Session expired, please log in again", 401);

  req.user = user;
  next();
});

const restrictTo =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role))
      throw new AppError("You do not have permission", 403);
    next();
  };

module.exports = { protect, restrictTo };
