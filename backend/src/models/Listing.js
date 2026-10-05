const mongoose = require("mongoose");
const {
  CROPS,
  REGIONS,
  QUALITIES,
  LISTING_STATUSES,
} = require("../config/constants");

const listingSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    crop: { type: String, enum: CROPS, required: true },
    variety: { type: String, trim: true, maxlength: 60 },
    quantityKg: { type: Number, required: true, min: 1, max: 1_000_000 },
    pricePerKg: { type: Number, required: true, min: 0.01, max: 100_000 }, // ETB
    quality: { type: String, enum: QUALITIES, default: "ungraded" },
    description: { type: String, trim: true, maxlength: 500 },
    region: { type: String, enum: REGIONS, required: true },
    town: { type: String, trim: true, maxlength: 60 },
    harvestDate: { type: Date },
    status: { type: String, enum: LISTING_STATUSES, default: "active" },
  },
  { timestamps: true },
);

// Indexes that match our queries
listingSchema.index({ status: 1, crop: 1, region: 1, pricePerKg: 1 });
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ seller: 1, createdAt: -1 });

listingSchema.virtual("totalPrice").get(function () {
  return Math.round(this.quantityKg * this.pricePerKg * 100) / 100;
});

listingSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Listing", listingSchema);
