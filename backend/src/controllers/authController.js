const bcrypt = require("bcryptjs");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { generateToken } = require("../utils/generateToken");

// Used so a "user not found" login takes as long as a wrong password (anti-timing attack).
const DUMMY_HASH = bcrypt.hashSync("sene-timing-guard", 12);

const authResponse = (res, status, user) =>
  res.status(status).json({ success: true, token: generateToken(user), user });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { phone, email } = req.body;

  const existing = await User.findOne({
    $or: [{ phone }, ...(email ? [{ email }] : [])],
  });
  if (existing) throw new AppError("Phone or email is already registered", 409);

  const user = await User.create(req.body); // body is already validated + stripped
  authResponse(res, 201, user);
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  const invalid = new AppError("Invalid phone or password", 401);

  const user = await User.findOne({ phone }).select("+password");
  if (!user) {
    await bcrypt.compare(password, DUMMY_HASH);
    throw invalid;
  }
  if (!user.isActive) throw new AppError("Account is disabled", 403);
  if (user.isLocked)
    throw new AppError(
      "Too many failed attempts. Try again in 15 minutes.",
      423,
    );

  if (!(await user.comparePassword(password))) {
    await user.registerFailedLogin();
    throw invalid;
  }

  await user.registerSuccessfulLogin();
  authResponse(res, 200, user);
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

// PATCH /api/auth/me
exports.updateMe = asyncHandler(async (req, res) => {
  Object.assign(req.user, req.body);
  await req.user.save();
  res.json({ success: true, user: req.user });
});

// PATCH /api/auth/change-password  (logs out all other devices)
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    throw new AppError("Current password is incorrect", 401);
  }
  user.password = newPassword;
  user.tokenVersion += 1;
  await user.save();
  authResponse(res, 200, user);
});

// POST /api/auth/logout-all  (invalidates every token for this user)
exports.logoutAll = asyncHandler(async (req, res) => {
  req.user.tokenVersion += 1;
  await req.user.save();
  res.json({ success: true, message: "Logged out from all devices" });
});
