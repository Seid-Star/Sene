const { z } = require("zod");
const { CROPS, REGIONS, QUALITIES } = require("../config/constants");

const id = z.object({ id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid id") });

const shape = {
  variety: z.string().trim().max(60).optional(),
  quantityKg: z.number().min(1).max(1_000_000),
  pricePerKg: z.number().min(0.01).max(100_000),
  quality: z.enum(QUALITIES),
  description: z.string().trim().max(500).optional(),
  region: z.enum(REGIONS),
  town: z.string().trim().max(60).optional(),
  harvestDate: z.coerce
    .date()
    .refine((d) => d <= new Date(), "Harvest date cannot be in the future"),
};

// Create: accepts pricePerKg OR totalPrice (voice-friendly), converts to pricePerKg.
const create = z
  .object({
    crop: z.enum(CROPS),
    variety: shape.variety,
    quantityKg: shape.quantityKg,
    pricePerKg: shape.pricePerKg.optional(),
    totalPrice: z.number().min(1).max(1_000_000_000).optional(),
    quality: shape.quality.optional(),
    description: shape.description,
    region: shape.region.optional(), // falls back to the seller's profile region
    town: shape.town,
    harvestDate: shape.harvestDate.optional(),
  })
  .superRefine((d, ctx) => {
    if ((d.pricePerKg === undefined) === (d.totalPrice === undefined)) {
      ctx.addIssue({
        code: "custom",
        path: ["pricePerKg"],
        message: "Provide either pricePerKg or totalPrice",
      });
    }
  })
  .transform(({ totalPrice, ...d }) => ({
    ...d,
    pricePerKg:
      d.pricePerKg ?? Math.round((totalPrice / d.quantityKg) * 100) / 100,
  }));

// Update: crop cannot be changed (create a new listing instead).
const update = z
  .object({
    variety: shape.variety,
    quantityKg: shape.quantityKg.optional(),
    pricePerKg: shape.pricePerKg.optional(),
    quality: shape.quality.optional(),
    description: shape.description,
    region: shape.region.optional(),
    town: shape.town,
    harvestDate: shape.harvestDate.optional(),
  })
  .refine(
    (o) => Object.keys(o).length > 0,
    "Provide at least one field to update",
  );

const SORTS = ["newest", "price_asc", "price_desc"];
const paging = {
  page: z.coerce.number().int().min(1).max(10000).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
};

const list = z.object({
  crop: z.enum(CROPS).optional(),
  region: z.enum(REGIONS).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minQty: z.coerce.number().min(0).optional(),
  sort: z.enum(SORTS).default("newest"),
  ...paging,
});

const mine = z.object({
  status: z.enum(["active", "reserved", "sold", "cancelled"]).optional(),
  ...paging,
});

const priceSummary = z.object({
  crop: z.enum(CROPS),
  region: z.enum(REGIONS).optional(),
});

module.exports = { id, create, update, list, mine, priceSummary };
