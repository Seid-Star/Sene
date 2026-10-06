const { describe, it, before, after } = require("node:test");
const assert = require("node:assert/strict");
const h = require("./helpers");

const { api, auth } = h;

before(async () => {
  await h.connectAndReset();
});
after(async () => {
  await h.mongoose.disconnect();
});

describe("auth", () => {
  it("registers, normalizes the phone, hides secrets, ignores role", async () => {
    const res = await api()
      .post("/api/auth/register")
      .send({
        fullName: "Abebe K",
        phone: "0911000100",
        password: "Passw0rd123",
        role: "admin",
      });
    assert.equal(res.status, 201);
    assert.equal(res.body.user.phone, "+251911000100");
    assert.equal(res.body.user.role, "user");
    assert.equal(res.body.user.password, undefined);
    assert.equal(res.body.user.tokenVersion, undefined);
  });

  it("rejects a duplicate phone (409) and a weak password (400)", async () => {
    const u = await h.signup();
    const dup = await api()
      .post("/api/auth/register")
      .send({ fullName: "Dup User", phone: u.phone, password: "Passw0rd123" });
    assert.equal(dup.status, 409);
    const weak = await api()
      .post("/api/auth/register")
      .send({ fullName: "Weak User", phone: "0911000101", password: "short" });
    assert.equal(weak.status, 400);
  });

  it("gives the same 401 for a wrong password and an unknown phone", async () => {
    const u = await h.signup();
    const a = await api()
      .post("/api/auth/login")
      .send({ phone: u.phone, password: "WrongPass1" });
    const b = await api()
      .post("/api/auth/login")
      .send({ phone: "0911999999", password: "WrongPass1" });
    assert.equal(a.status, 401);
    assert.equal(b.status, 401);
    assert.equal(a.body.message, b.body.message);
  });

  it("blocks NoSQL injection in login (400)", async () => {
    const res = await api()
      .post("/api/auth/login")
      .send({ phone: { $gt: "" }, password: "x" });
    assert.equal(res.status, 400);
  });

  it("requires a valid token for /me", async () => {
    const u = await h.signup();
    assert.equal((await api().get("/api/auth/me")).status, 401);
    assert.equal(
      (await api().get("/api/auth/me").set(auth("garbage"))).status,
      401,
    );
    assert.equal(
      (await api().get("/api/auth/me").set(auth(u.token))).status,
      200,
    );
  });

  it("locks the account after 5 failed logins (423)", async () => {
    const u = await h.signup();
    for (let i = 0; i < 5; i += 1) {
      await api()
        .post("/api/auth/login")
        .send({ phone: u.phone, password: "WrongPass1" });
    }
    const res = await api()
      .post("/api/auth/login")
      .send({ phone: u.phone, password: u.password });
    assert.equal(res.status, 423);
  });

  it("invalidates old tokens after a password change", async () => {
    const u = await h.signup();
    const res = await api()
      .patch("/api/auth/change-password")
      .set(auth(u.token))
      .send({ currentPassword: u.password, newPassword: "NewPassw0rd9" });
    assert.equal(res.status, 200);
    assert.equal(
      (await api().get("/api/auth/me").set(auth(res.body.token))).status,
      200,
    );
    assert.equal(
      (await api().get("/api/auth/me").set(auth(u.token))).status,
      401,
    );
  });
});

describe("listings", () => {
  it("converts totalPrice to pricePerKg (voice style)", async () => {
    const u = await h.signup();
    const l = await h.createListing(u.token, {
      crop: "teff",
      quantityKg: 50,
      totalPrice: 2200,
      region: "Oromia",
    });
    assert.equal(l.pricePerKg, 44);
    assert.equal(l.totalPrice, 2200);
  });

  it("validates input and requires login", async () => {
    const u = await h.signup();
    const base = { crop: "teff", quantityKg: 5, region: "Oromia" };
    assert.equal(
      (
        await api()
          .post("/api/listings")
          .send({ ...base, pricePerKg: 10 })
      ).status,
      401,
    );
    assert.equal(
      (
        await api()
          .post("/api/listings")
          .set(auth(u.token))
          .send({ ...base, crop: "gold", pricePerKg: 10 })
      ).status,
      400,
    );
    assert.equal(
      (
        await api()
          .post("/api/listings")
          .set(auth(u.token))
          .send({ ...base, pricePerKg: 10, totalPrice: 50 })
      ).status,
      400,
    );
    assert.equal(
      (await api().post("/api/listings").set(auth(u.token)).send(base)).status,
      400,
    );
  });

  it("never exposes the seller phone publicly", async () => {
    const u = await h.signup();
    await h.createListing(u.token, {
      crop: "maize",
      quantityKg: 10,
      pricePerKg: 20,
      region: "Oromia",
    });
    const res = await api().get("/api/listings?crop=maize");
    assert.equal(res.status, 200);
    assert.ok(res.body.listings.length >= 1);
    assert.ok(!JSON.stringify(res.body).includes(u.phone));
  });

  it("caps page size at 50", async () => {
    assert.equal((await api().get("/api/listings?limit=500")).status, 400);
  });

  it("lets only the owner edit and cancel", async () => {
    const owner = await h.signup();
    const other = await h.signup();
    const l = await h.createListing(owner.token, {
      crop: "potato",
      quantityKg: 10,
      pricePerKg: 20,
      region: "Oromia",
    });

    assert.equal(
      (
        await api()
          .patch(`/api/listings/${l.id}`)
          .set(auth(other.token))
          .send({ pricePerKg: 1 })
      ).status,
      403,
    );
    assert.equal(
      (await api().delete(`/api/listings/${l.id}`).set(auth(other.token)))
        .status,
      403,
    );

    const edit = await api()
      .patch(`/api/listings/${l.id}`)
      .set(auth(owner.token))
      .send({ pricePerKg: 25 });
    assert.equal(edit.status, 200);
    assert.equal(edit.body.listing.pricePerKg, 25);

    const del = await api()
      .delete(`/api/listings/${l.id}`)
      .set(auth(owner.token));
    assert.equal(del.body.listing.status, "cancelled");
    assert.equal((await api().get(`/api/listings/${l.id}`)).status, 404);
  });

  it("computes the price summary", async () => {
    const u = await h.signup();
    await h.createListing(u.token, {
      crop: "barley",
      quantityKg: 100,
      pricePerKg: 40,
      region: "Tigray",
    });
    await h.createListing(u.token, {
      crop: "barley",
      quantityKg: 100,
      pricePerKg: 60,
      region: "Tigray",
    });
    const res = await api().get(
      "/api/listings/price-summary?crop=barley&region=Tigray",
    );
    assert.equal(res.status, 200);
    assert.equal(res.body.count, 2);
    assert.equal(res.body.minPricePerKg, 40);
    assert.equal(res.body.maxPricePerKg, 60);
    assert.equal(res.body.avgPricePerKg, 50);
    assert.equal(res.body.scope, "region");
  });

  it("falls back to national when the region has no listings", async () => {
    const res = await api().get(
      "/api/listings/price-summary?crop=barley&region=Afar",
    );
    assert.equal(res.body.scope, "national");
    assert.ok(res.body.count >= 2);
  });
});

describe("transactions", () => {
  it("runs the full flow: request → accept → pay → webhook → complete", async () => {
    const { seller, buyer, listing } = await h.setup();

    const tx = await h.requestTx(buyer, listing);
    assert.equal(tx.status, "requested");
    assert.equal(tx.totalPrice, 5000);

    const early = await api()
      .get(`/api/transactions/${tx.id}`)
      .set(auth(buyer.token));
    assert.ok(
      !JSON.stringify(early.body).includes(seller.phone),
      "phone must be hidden before accept",
    );

    const acc = await h.acceptTx(seller, tx.id);
    assert.equal(acc.status, 200);
    assert.equal(acc.body.transaction.status, "accepted");
    assert.ok(
      JSON.stringify(acc.body).includes(seller.phone),
      "phone visible after accept",
    );
    assert.equal(
      (await api().get(`/api/listings/${listing.id}`)).body.listing.status,
      "reserved",
    );

    const ref = await h.payTx(buyer, tx.id);
    const wh = await h.webhook({
      reference: ref,
      status: "success",
      amount: 5000,
    });
    assert.equal(wh.status, 200);

    const paid = await api()
      .get(`/api/transactions/${tx.id}`)
      .set(auth(buyer.token));
    assert.equal(paid.body.transaction.status, "paid");
    assert.equal(
      (await api().get(`/api/listings/${listing.id}`)).body.listing.status,
      "sold",
    );

    const done = await api()
      .patch(`/api/transactions/${tx.id}/complete`)
      .set(auth(buyer.token));
    assert.equal(done.body.transaction.status, "completed");
  });

  it("rejects own-listing purchases and duplicate open requests", async () => {
    const { seller, buyer, listing } = await h.setup();
    const own = await api()
      .post("/api/transactions")
      .set(auth(seller.token))
      .send({ listingId: listing.id });
    assert.equal(own.status, 403);

    await h.requestTx(buyer, listing);
    const dup = await api()
      .post("/api/transactions")
      .set(auth(buyer.token))
      .send({ listingId: listing.id });
    assert.equal(dup.status, 409);
  });

  it("lets only one buyer win a listing (accept race)", async () => {
    const { seller, buyer, listing } = await h.setup();
    const buyer2 = await h.signup();
    const t1 = await h.requestTx(buyer, listing);
    const t2 = await h.requestTx(buyer2, listing);

    assert.equal((await h.acceptTx(seller, t1.id)).status, 200);
    assert.equal((await h.acceptTx(seller, t2.id)).status, 409);

    const second = await api()
      .get(`/api/transactions/${t2.id}`)
      .set(auth(buyer2.token));
    assert.equal(second.body.transaction.status, "rejected");
  });

  it("hides transactions from strangers (404) and blocks wrong-role actions", async () => {
    const { seller, buyer, listing } = await h.setup();
    const stranger = await h.signup();
    const tx = await h.requestTx(buyer, listing);

    assert.equal(
      (await api().get(`/api/transactions/${tx.id}`).set(auth(stranger.token)))
        .status,
      404,
    );
    assert.equal((await h.acceptTx(stranger, tx.id)).status, 404);
    assert.equal((await h.acceptTx(buyer, tx.id)).status, 404); // buyer cannot accept
    assert.equal(
      (
        await api()
          .post(`/api/transactions/${tx.id}/pay`)
          .set(auth(seller.token))
      ).status,
      404,
    );
  });

  it("only allows paying accepted deals and completing paid deals", async () => {
    const { seller, buyer, listing } = await h.setup();
    const tx = await h.requestTx(buyer, listing);
    assert.equal(
      (
        await api()
          .post(`/api/transactions/${tx.id}/pay`)
          .set(auth(buyer.token))
      ).status,
      409,
    );
    await h.acceptTx(seller, tx.id);
    assert.equal(
      (
        await api()
          .patch(`/api/transactions/${tx.id}/complete`)
          .set(auth(buyer.token))
      ).status,
      409,
    );
  });

  it("returns the same payment when pay is called twice", async () => {
    const { seller, buyer, listing } = await h.setup();
    const tx = await h.requestTx(buyer, listing);
    await h.acceptTx(seller, tx.id);
    const ref1 = await h.payTx(buyer, tx.id);
    const ref2 = await h.payTx(buyer, tx.id);
    assert.equal(ref1, ref2);
  });

  it("rejects webhooks without a valid secret (401)", async () => {
    assert.equal(
      (await h.webhook({ reference: "x", status: "success" }, {})).status,
      401,
    );
    assert.equal(
      (
        await h.webhook(
          { reference: "x", status: "success" },
          { "x-webhook-secret": "wrong" },
        )
      ).status,
      401,
    );
  });

  it("ignores a webhook with the wrong amount, then accepts the right one", async () => {
    const { seller, buyer, listing } = await h.setup();
    const tx = await h.requestTx(buyer, listing);
    await h.acceptTx(seller, tx.id);
    const ref = await h.payTx(buyer, tx.id);

    await h.webhook({ reference: ref, status: "success", amount: 1 });
    const still = await api()
      .get(`/api/transactions/${tx.id}`)
      .set(auth(buyer.token));
    assert.equal(still.body.transaction.status, "accepted");

    await h.webhook({ reference: ref, status: "success", amount: 5000 });
    const paid = await api()
      .get(`/api/transactions/${tx.id}`)
      .set(auth(buyer.token));
    assert.equal(paid.body.transaction.status, "paid");
  });

  it("is idempotent: a replayed webhook changes nothing", async () => {
    const { seller, buyer, listing } = await h.setup();
    const tx = await h.requestTx(buyer, listing);
    await h.acceptTx(seller, tx.id);
    const ref = await h.payTx(buyer, tx.id);
    await h.webhook({ reference: ref, status: "success", amount: 5000 });
    await api()
      .patch(`/api/transactions/${tx.id}/complete`)
      .set(auth(buyer.token));

    const replay = await h.webhook({
      reference: ref,
      status: "success",
      amount: 5000,
    });
    assert.equal(replay.status, 200);
    const after = await api()
      .get(`/api/transactions/${tx.id}`)
      .set(auth(buyer.token));
    assert.equal(after.body.transaction.status, "completed");
  });

  it("releases the listing when an accepted deal is cancelled", async () => {
    const { seller, buyer, listing } = await h.setup();
    const tx = await h.requestTx(buyer, listing);
    await h.acceptTx(seller, tx.id);

    const res = await api()
      .patch(`/api/transactions/${tx.id}/cancel`)
      .set(auth(buyer.token))
      .send({ reason: "changed my mind" });
    assert.equal(res.body.transaction.status, "cancelled");
    assert.equal(
      (await api().get(`/api/listings/${listing.id}`)).body.listing.status,
      "active",
    );
  });
});
