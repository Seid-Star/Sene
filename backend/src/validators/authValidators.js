const { z } = require("zod");
const { normalizeEthiopianPhone } = require("../utils/phone");

const phone = z.string().transform((v, ctx) => {
  const n = normalizeEthiopianPhone(v);
  if (!n) {
    ctx.addIssue({
      code: "custom",
      message: "Enter a valid Ethiopian phone number",
    });
    return z.NEVER;
  }
  return n;
});

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be at most 72 characters") // bcrypt limit
  .regex(/[A-Za-z]/, "Password must contain a letter")
  .regex(/\d/, "Password must contain a number");

const register = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone,
  email: z.string().trim().email().toLowerCase().optional(),
  password,
  preferredLanguage: z.enum(["am", "om", "en"]).default("am"),
  region: z.string().trim().max(60).optional(),
  town: z.string().trim().max(60).optional(),
});

const login = z.object({ phone, password: z.string().min(1).max(72) });

const updateMe = z.object({
  fullName: z.string().trim().min(2).max(80).optional(),
  preferredLanguage: z.enum(["am", "om", "en"]).optional(),
  region: z.string().trim().max(60).optional(),
  town: z.string().trim().max(60).optional(),
});

const changePassword = z.object({
  currentPassword: z.string().min(1).max(72),
  newPassword: password,
});

module.exports = { register, login, updateMe, changePassword };
