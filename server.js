const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const fs = require('fs');
const app = express();

// Stripe requires raw body for webhook signature verification
app.use(bodyParser.raw({type: 'application/json'}));

// Serve static HTML demo
app.use(express.static('public'));

// Create a Checkout Session (called from client)
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{price: process.env.STRIPE_PRICE_ID, quantity: 1}],
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/success.html`,
      cancel_url: `${process.env.BASE_URL}/cancel.html`,
    });
    res.json({id: session.id});
  } catch (e) {
    console.error(e);
    res.status(500).send('Error creating session');
  }
});

// Webhook endpoint
app.post('/webhook', (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log('⚠️ Webhook signature verification failed.', err.message);
    return res.sendStatus(400);
  }
  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const logLine = `${new Date().toISOString()}, ${session.id}, ${session.amount_total / 100} ${session.currency}\n`;
    fs.appendFileSync('payments.log', logLine);
    console.log('✅ Payment logged:', logLine.trim());
  }
  res.json({received: true});
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
