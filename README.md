# stripe-demo

Minimal, honest demo of Stripe Checkout with server-side webhook confirmation —
Express, one page, one success flow, one webhook handler.

## What runs

| File | Role |
|---|---|
| `server.js` | Express app: serves `public/`, creates Checkout Sessions, verifies webhook signatures |
| `public/` | payment page UI |
| `.env.example` | env shape (never commit the real one) |

## Setup

```bash
npm install
cp .env.example .env        # add STRIPE_SECRET_KEY
node server.js
```

## Endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/` | demo checkout page |
| POST | `/create-checkout-session` | creates a Stripe Checkout Session and returns its URL |
| POST | `/webhook` | receives Stripe events using the **raw request body** so signature-check passes |

## Webhook correctness (the part demos usually get wrong)

- Body parsing is intentionally **raw** for `/webhook`:
  ```js
  app.use(bodyParser.raw({ type: 'application/json' }));
  app.use(express.static('public'));
  ```
  Stripe requires an unmodified body to verify the webhook signature — this demo keeps
  Stripe-constructed events trustworthy rather than blindly trusting POSTs.

## Scope

Single-customer demo scaffolding — extendable to subscriptions/SNS flows but that is
out of scope until needed.
