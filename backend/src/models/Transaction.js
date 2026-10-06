const mongoose = require("mongoose");
const { TRANSACTION_STATUSES } = require("../config/constants");

const { Schema } = mongoose;

const transactionSchema = new Schema(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },

    crop: { type: String, required: true },
    quantityKg: { type: Number, required: true },
    pricePerKg: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    note: { type: String, trim: true, maxlength: 200 },
    status: { type: String, enum: TRANSACTION_STATUSES, default: "requested" },

    payment: {
      provider: String,
      reference: String,
      checkoutUrl: String,
      status: {
        type: String,
        enum: ["none", "pending", "success", "failed"],
        default: "none",
      },
      paidAt: Date,
      needsReview: { type: Boolean, default: false }, // e.g. late payment after cancellation
    },

    acceptedAt: Date,
    expiresAt: Date,
    rejectedAt: Date,
    paidAt: Date,
    completedAt: Date,
    cancelledAt: Date,
    cancelledBy: { type: Schema.Types.ObjectId, ref: "User" },
    cancelReason: { type: String, maxlength: 200 },
  },
  { timestamps: true },
);

transactionSchema.index({ buyer: 1, createdAt: -1 });
transactionSchema.index({ seller: 1, createdAt: -1 });
transactionSchema.index({ status: 1, expiresAt: 1 });
transactionSchema.index(
  { "payment.reference": 1 },
  { unique: true, sparse: true },
);

transactionSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    if (ret.payment) delete ret.payment.needsReview; // internal flag
    return ret;
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
