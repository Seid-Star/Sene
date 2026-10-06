const { z } = require("zod");
const { TRANSACTION_STATUSES } = require("../config/constants");

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

const id = z.object({ id: objectId });
const create = z.object({
  listingId: objectId,
  note: z.string().trim().max(200).optional(),
});
const cancel = z.object({ reason: z.string().trim().max(200).optional() });
const list = z.object({
  role: z.enum(["buyer", "seller"]).optional(),
  status: z.enum(TRANSACTION_STATUSES).optional(),
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

module.exports = { id, create, cancel, list };
