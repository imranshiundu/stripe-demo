# stripe-demo

A small Stripe Checkout demo for learning payment flows safely.

## What it demonstrates

- Creating a Checkout Session
- Redirecting users to Stripe-hosted checkout
- Using environment variables for secrets
- Separating frontend demo code from server payment logic
- Local development workflow

## Safety rules

Never commit real Stripe secret keys. Use test keys only while learning.

## Setup

```bash
npm install
cp .env.example .env
```

Add your Stripe test secret key to `.env`:

```env
STRIPE_SECRET_KEY=sk_test_your_key_here
PUBLIC_URL=http://localhost:4242
PORT=4242
```

## Run

```bash
npm start
```

Open:

```text
http://localhost:4242
```

## Recommended next upgrades

- Add webhook signature verification
- Store orders in a database
- Add product/price IDs instead of inline amounts
- Add automated tests for checkout session creation
- Deploy only after test-mode flow is confirmed
