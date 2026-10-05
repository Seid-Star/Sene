require("dotenv").config({ quiet: true });
const { z } = require("zod");
const schema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CLIENT_ORIGINS: z.string().default("http://localhost:5173"),
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

module.exports = env;
