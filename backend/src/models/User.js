const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    phone: { type: String, required: true, unique: true, index: true }, // +251XXXXXXXXX
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    preferredLanguage: {
      type: String,
      enum: ["am", "om", "en"],
      default: "am",
    },
    region: { type: String, trim: true, maxlength: 60 },
    town: { type: String, trim: true, maxlength: 60 },
    isActive: { type: Boolean, default: true },

    // Security fields
    tokenVersion: { type: Number, default: 0 },
    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Atomic update: safe even under many parallel login attempts.
userSchema.methods.registerFailedLogin = function () {
  if (this.lockUntil && this.lockUntil <= Date.now()) {
    return this.updateOne({
      $set: { failedLoginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }
  const update = { $inc: { failedLoginAttempts: 1 } };
  if (this.failedLoginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
    update.$set = { lockUntil: new Date(Date.now() + LOCK_TIME_MS) };
  }
  return this.updateOne(update);
};

userSchema.methods.registerSuccessfulLogin = function () {
  return this.updateOne({
    $set: { failedLoginAttempts: 0, lastLoginAt: new Date() },
    $unset: { lockUntil: 1 },
  });
};

// Never leak sensitive fields in JSON responses.
userSchema.set("toJSON", {
  virtuals: false,
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password;
    delete ret.tokenVersion;
    delete ret.failedLoginAttempts;
    delete ret.lockUntil;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
