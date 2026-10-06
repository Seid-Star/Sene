const assert = require("node:assert/strict");

const base = (
  process.argv[2] ||
  process.env.API_URL ||
  "http://localhost:3001/api"
).replace(/\/$/, "");
let failed = 0;

async function call(method, path, { token, body } = {}) {
  const res = await fetch(base + path, {
    method,
    headers: {
      ...(body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: body && JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => ({})) };
}

async function check(name, fn) {
  try {
    await fn();
    console.log(`✔ ${name}`);
  } catch (e) {
    failed += 1;
    console.log(`✖ ${name}\n    ${e.message}`);
  }
}

(async () => {
  console.log(`Smoke test → ${base}\n`);
  let farmerToken;

  await check("health: API up and database connected", async () => {
    const r = await call("GET", "/health");
    assert.equal(r.status, 200);
    assert.equal(r.body.db, "connected");
  });

  await check("meta: crops and regions load", async () => {
    const r = await call("GET", "/listings/meta");
    assert.equal(r.status, 200);
    assert.ok(r.body.crops.includes("teff"));
  });

  await check(
    "listings: public browse works, no phone numbers exposed",
    async () => {
      const r = await call("GET", "/listings?crop=teff");
      assert.equal(r.status, 200);
      assert.ok(
        r.body.listings.length > 0,
        "no teff listings (run npm run seed?)",
      );
      assert.ok(
        !JSON.stringify(r.body).includes("+251"),
        "a phone number leaked",
      );
    },
  );

  await check("price-summary: teff has a price range", async () => {
    const r = await call("GET", "/listings/price-summary?crop=teff");
    assert.equal(r.status, 200);
    assert.ok(r.body.count > 0);
    assert.ok(r.body.minPricePerKg <= r.body.maxPricePerKg);
  });

  await check("auth: demo farmer can log in", async () => {
    const r = await call("POST", "/auth/login", {
      body: { phone: "+251911000001", password: "Demo2026pass" },
    });
    assert.equal(r.status, 200);
    assert.ok(r.body.token);
    farmerToken = r.body.token;
  });

  await check("auth: /me works with a token, 401 without", async () => {
    assert.equal(
      (await call("GET", "/auth/me", { token: farmerToken })).status,
      200,
    );
    assert.equal((await call("GET", "/auth/me")).status, 401);
  });

  await check("listings: farmer sees own listings", async () => {
    const r = await call("GET", "/listings/mine", { token: farmerToken });
    assert.equal(r.status, 200);
    assert.ok(r.body.total >= 1);
  });

  await check("security: webhook without a secret is rejected", async () => {
    const r = await call("POST", "/transactions/payment-webhook", {
      body: { reference: "x", status: "success" },
    });
    assert.equal(r.status, 401);
  });

  await check("security: unknown route returns a clean 404", async () => {
    const r = await call("GET", "/does-not-exist");
    assert.equal(r.status, 404);
    assert.equal(r.body.success, false);
  });

  console.log(
    failed ? `\n${failed} check(s) FAILED` : "\nAll checks passed ✅",
  );
  process.exit(failed ? 1 : 0);
})();
