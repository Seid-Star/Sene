# Sene API Reference

Base URL (local): `http://localhost:3001/api`
All bodies are JSON. Auth header for protected routes: `Authorization: Bearer <token>`

## Response format

- Success: `{ "success": true, ... }`
- Error: `{ "success": false, "message": "...", "details": [{ "field": "...", "message": "..." }] }`
- Common codes: 400 validation, 401 not logged in, 403 not allowed, 404 not found (also used to hide others' data), 409 conflict/wrong state, 423 account locked, 429 rate limited.

## Phone numbers

Send `0911223344`, `+251911223344` or `251911223344`. Stored and returned as `+251911223344`.

## Auth

| Method | Route                 | Body                                                                                                       | Notes                                                    |
| ------ | --------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| POST   | /auth/register        | fullName, phone, password (8+ chars, letter+number), email?, preferredLanguage? (am/om/en), region?, town? | returns `{ token, user }`                                |
| POST   | /auth/login           | phone, password                                                                                            | returns `{ token, user }`; locks 15 min after 5 failures |
| GET    | /auth/me              |                                                                                                            | current user                                             |
| PATCH  | /auth/me              | fullName?, preferredLanguage?, region?, town?                                                              |                                                          |
| PATCH  | /auth/change-password | currentPassword, newPassword                                                                               | returns a new token; old tokens stop working             |
| POST   | /auth/logout-all      |                                                                                                            | invalidates every token                                  |

## Listings

| Method | Route                                                                                              | Access      | Notes                                                                                                                                                                                    |
| ------ | -------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET    | /listings/meta                                                                                     | public      | crops, regions, qualities                                                                                                                                                                |
| GET    | /listings/price-summary?crop=teff&region=Oromia                                                    | public      | **Voice: check price.** Returns count, minPricePerKg, avgPricePerKg, maxPricePerKg, weightedAvgPricePerKg, totalQuantityKg, `scope` ("region" or "national" fallback)                    |
| GET    | /listings?crop&region&minPrice&maxPrice&minQty&sort=newest/price_asc/price_desc&page&limit(max 50) | public      | active listings; seller shows name/region/town only                                                                                                                                      |
| GET    | /listings/mine?status&page&limit                                                                   | login       |                                                                                                                                                                                          |
| GET    | /listings/:id                                                                                      | public      |                                                                                                                                                                                          |
| POST   | /listings                                                                                          | login       | **Voice: create listing.** crop, quantityKg, and EITHER pricePerKg OR totalPrice (server converts), region? (defaults to profile), town?, quality?, variety?, description?, harvestDate? |
| PATCH  | /listings/:id                                                                                      | owner       | active listings only; crop cannot change                                                                                                                                                 |
| DELETE | /listings/:id                                                                                      | owner/admin | soft delete → status "cancelled"                                                                                                                                                         |

Listing statuses: `active → reserved → sold`, or `cancelled`.

## Transactions (buyer buys a whole listing)

| Method | Route                                              | Who          | Notes                                                                                                 |
| ------ | -------------------------------------------------- | ------------ | ----------------------------------------------------------------------------------------------------- |
| POST   | /transactions                                      | buyer        | **Voice: request buyer connection.** Body: listingId, note?                                           |
| GET    | /transactions?role=buyer\|seller&status&page&limit | login        |                                                                                                       |
| GET    | /transactions/:id                                  | buyer/seller |                                                                                                       |
| PATCH  | /transactions/:id/accept                           | seller       | reserves the listing; other pending requests auto-rejected; 24 h to pay                               |
| PATCH  | /transactions/:id/reject                           | seller       |                                                                                                       |
| PATCH  | /transactions/:id/cancel                           | buyer/seller | before payment; body: reason?                                                                         |
| POST   | /transactions/:id/pay                              | buyer        | calls `paymentService.initiatePayment`; returns `checkoutUrl`. Calling twice returns the same payment |
| POST   | /transactions/payment-webhook                      | Links.et     | header `x-webhook-secret`; body `{ reference, status: "success"\|"failed", amount }`                  |
| PATCH  | /transactions/:id/complete                         | buyer        | confirms delivery                                                                                     |

Status flow: `requested → accepted → paid → completed`; side exits: `rejected`, `cancelled`.
Phone numbers of buyer and seller appear only from `accepted` onward.
Unpaid accepted deals expire after 24 h and the listing is released automatically.

## paymentService contract (backend/src/services/paymentService.js, owned by Amir)

- `initiatePayment({ transactionId, amount, currency, buyer, seller })` → `{ provider, reference, checkoutUrl }`
- `verifyWebhook(req)` → `{ reference, status, amount }`; must verify the signature (raw bytes are in `req.rawBody`) and throw `AppError(..., 401)` if invalid.
