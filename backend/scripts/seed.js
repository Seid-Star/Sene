const mongoose = require("mongoose");
const env = require("../src/config/env");
const User = require("../src/models/User");
const Listing = require("../src/models/Listing");
const Transaction = require("../src/models/Transaction");

if (env.isProd && !process.argv.includes("--force")) {
  console.error("Refusing to seed in production without --force");
  process.exit(1);
}

const DEMO_PASSWORD = "Demo2026pass";

const people = [
  {
    fullName: "Abebe Kebede",
    phone: "+251911000001",
    region: "Oromia",
    town: "Adama",
    preferredLanguage: "om",
  },
  {
    fullName: "Tigist Alemu",
    phone: "+251911000002",
    region: "Amhara",
    town: "Debre Markos",
    preferredLanguage: "am",
  },
  {
    fullName: "Chala Bekele",
    phone: "+251911000003",
    region: "Oromia",
    town: "Bishoftu",
    preferredLanguage: "om",
  },
  {
    fullName: "Hanna Tesfaye",
    phone: "+251911000004",
    region: "Sidama",
    town: "Hawassa",
    preferredLanguage: "am",
  },
  {
    fullName: "Dawit Mengistu",
    phone: "+251911000005",
    region: "Amhara",
    town: "Bahir Dar",
    preferredLanguage: "am",
  },
  {
    fullName: "Selam Trading (Buyer)",
    phone: "+251922000001",
    region: "Addis Ababa",
    town: "Addis Ababa",
    preferredLanguage: "en",
  },
  {
    fullName: "Biruk Exporters (Buyer)",
    phone: "+251922000002",
    region: "Addis Ababa",
    town: "Addis Ababa",
    preferredLanguage: "en",
  },
];

// [person index, crop, variety, kg, price/kg ETB, quality, days since harvest]
const rows = [
  [0, "teff", "Magna (white)", 200, 46, "grade1", 5],
  [0, "teff", "Magna (white)", 80, 44, "grade2", 9],
  [1, "teff", "Nech (white)", 150, 52, "grade1", 4],
  [2, "teff", "Sergegna (mixed)", 300, 48, "grade2", 7],
  [3, "teff", "Magna (white)", 120, 55, "grade1", 3],
  [4, "teff", "Nech (white)", 60, 47, "grade3", 12],
  [0, "onion", "Red", 500, 30, "grade1", 2],
  [2, "onion", "Red", 800, 28, "grade2", 3],
  [3, "onion", "Red", 250, 35, "grade1", 1],
  [4, "onion", "White", 400, 32, "grade2", 4],
  [1, "tomato", "Roma", 150, 22, "grade1", 1],
  [3, "tomato", "Roma", 200, 25, "grade2", 2],
  [1, "potato", "Gudene", 600, 18, "grade1", 6],
  [4, "potato", "Gudene", 350, 20, "grade2", 5],
  [2, "maize", "Hybrid yellow", 1000, 15, "ungraded", 10],
  [0, "wheat", "Kakaba", 700, 24, "grade1", 14],
];

(async () => {
  await mongoose.connect(env.MONGO_URI);
  console.log(`Seeding database: ${mongoose.connection.name}`);

  // Remove ONLY previous demo data (matched by the demo phone numbers)
  const old = await User.find({
    phone: { $in: people.map((p) => p.phone) },
  }).select("_id");
  const ids = old.map((u) => u._id);
  await Transaction.deleteMany({
    $or: [{ buyer: { $in: ids } }, { seller: { $in: ids } }],
  });
  await Listing.deleteMany({ seller: { $in: ids } });
  await User.deleteMany({ _id: { $in: ids } });

  const users = [];
  for (const p of people)
    users.push(await User.create({ ...p, password: DEMO_PASSWORD }));

  const day = 24 * 60 * 60 * 1000;
  await Listing.insertMany(
    rows.map(([i, crop, variety, quantityKg, pricePerKg, quality, ago]) => ({
      seller: users[i]._id,
      crop,
      variety,
      quantityKg,
      pricePerKg,
      quality,
      region: users[i].region,
      town: users[i].town,
      harvestDate: new Date(Date.now() - ago * day),
    })),
  );

  console.log(`✅ ${users.length} users, ${rows.length} listings created.`);
  console.log(`Demo login (all accounts): password "${DEMO_PASSWORD}"`);
  console.log("  Farmer: +251911000001 (Abebe Kebede, teff + onion + wheat)");
  console.log("  Buyer : +251922000001 (Selam Trading)");
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
