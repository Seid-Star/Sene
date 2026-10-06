const crypto = require("crypto");
const env = require("../config/env");
const AppError = require("../utils/AppError");

exports.initiatePayment = async ({ transactionId }) => {
  if (env.isProd) throw new AppError("Payment provider not configured", 501);
  return {
    provider: "mock",
    reference: `MOCK-${transactionId}-${Date.now()}`,
    checkoutUrl: null,
  };
};

exports.verifyWebhook = async (req) => {
  const secret = env.PAYMENT_WEBHOOK_SECRET;
  const given = req.get("x-webhook-secret") || "";
  const ok =
    secret &&
    given.length === secret.length &&
    crypto.timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) throw new AppError("Invalid webhook signature", 401);

  const { reference, status, amount } = req.body || {};
  if (
    typeof reference !== "string" ||
    !["success", "failed"].includes(status)
  ) {
    throw new AppError("Invalid webhook payload", 400);
  }
  return { reference, status, amount };
};
