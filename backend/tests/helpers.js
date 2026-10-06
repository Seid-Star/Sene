process.env.NODE_ENV = "test";
require("dotenv").config({ quiet: true });

const uri = process.env.MONGO_URI_TEST;
if (!uri)
  throw new Error(
    "Set MONGO_URI_TEST in .env (a database whose name ends with _test)",
  );
process.env.MONGO_URI = uri;
process.env.PAYMENT_WEBHOOK_SECRET = "test-webhook-secret-123456";

const mongoose = require("mongoose");
const supertest = require("supertest");
const assert = require("node:assert/strict");
const app = require("../src/app");

const api = () => supertest(app);
const auth = (token) => ({ Authorization: `Bearer ${token}` });
const WEBHOOK = { "x-webhook-secret": process.env.PAYMENT_WEBHOOK_SECRET };

async function connectAndReset() {
  await mongoose.connect(uri);
  const name = mongoose.connection.name;
  if (!name.endsWith("_test")) {
    await mongoose.disconnect();
    throw new Error(
      `Refusing to run: database "${name}" does not end with _test`,
    );
  }
  await mongoose.connection.dropDatabase();
  await Promise.all(Object.values(mongoose.models).map((m) => m.syncIndexes()));
}

let counter = 0;
const nextPhone = () => `09${String(10000000 + ++counter)}`;

async function signup(overrides = {}) {
  const body = {
    fullName: "Test User",
    phone: nextPhone(),
    password: "Passw0rd123",
    region: "Oromia",
    town: "Nazret",
    ...overrides,
  };
  const res = await api().post("/api/auth/register").send(body);
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return {
    token: res.body.token,
    user: res.body.user,
    phone: res.body.user.phone,
    password: body.password,
  };
}

async function createListing(token, body) {
  const res = await api().post("/api/listings").set(auth(token)).send(body);
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return res.body.listing;
}

async function setup() {
  const seller = await signup({ fullName: "Seller" });
  const buyer = await signup({ fullName: "Buyer" });
  const listing = await createListing(seller.token, {
    crop: "onion",
    quantityKg: 100,
    pricePerKg: 50,
    region: "Oromia",
  });
  return { seller, buyer, listing };
}

async function requestTx(buyer, listing) {
  const res = await api()
    .post("/api/transactions")
    .set(auth(buyer.token))
    .send({ listingId: listing.id });
  assert.equal(res.status, 201, JSON.stringify(res.body));
  return res.body.transaction;
}

async function acceptTx(seller, txId) {
  return api()
    .patch(`/api/transactions/${txId}/accept`)
    .set(auth(seller.token));
}

async function payTx(buyer, txId) {
  const res = await api()
    .post(`/api/transactions/${txId}/pay`)
    .set(auth(buyer.token));
  assert.equal(res.status, 200, JSON.stringify(res.body));
  return res.body.transaction.payment.reference;
}

const webhook = (body, headers = WEBHOOK) =>
  api().post("/api/transactions/payment-webhook").set(headers).send(body);

module.exports = {
  api,
  auth,
  WEBHOOK,
  mongoose,
  connectAndReset,
  signup,
  createListing,
  setup,
  requestTx,
  acceptTx,
  payTx,
  webhook,
};
