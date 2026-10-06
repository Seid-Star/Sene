require("dotenv").config({ quiet: true });
const { z } = require("zod");

const schema = z
  .object({
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().default(5000),
    MONGO_URI: z.string().min(1, "MONGO_URI is required"),
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_IN: z.string().default("7d"),
    CLIENT_ORIGINS: z.string().default("http://localhost:5173"),
    PAYMENT_WEBHOOK_SECRET: z.string().min(16).optional(),
  })
  .superRefine((e, ctx) => {
    if (e.NODE_ENV !== "production") return;
    if (!e.PAYMENT_WEBHOOK_SECRET) {
      ctx.addIssue({
        code: "custom",
        path: ["PAYMENT_WEBHOOK_SECRET"],
        message: "required in production",
      });
    }
    if (e.JWT_SECRET.length < 48) {
      ctx.addIssue({
        code: "custom",
        path: ["JWT_SECRET"],
        message: "must be at least 48 characters in production",
      });
    }
  });

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment configuration:");
  parsed.error.issues.forEach((i) =>
    console.error(`  - ${i.path.join(".")}: ${i.message}`),
  );
  process.exit(1);
}

const env = parsed.data;
env.isProd = env.NODE_ENV === "production";
env.clientOrigins = env.CLIENT_ORIGINS.split(",").map((s) => s.trim());

if (
  env.isProd &&
  env.clientOrigins.some((o) => /localhost|127\.0\.0\.1/.test(o))
) {
  console.warn("⚠️  CLIENT_ORIGINS still contains localhost in production.");
}

module.exports = env;
