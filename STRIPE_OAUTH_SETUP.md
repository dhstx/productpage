# Stripe & Google OAuth Setup Guide

This document explains how to configure Stripe payments and Google OAuth authentication for the DHStx platform.

## Stripe Integration

### Products & Prices Created

The following products and prices have been created in your Stripe account:

| Plan | Price | Stripe Product ID | Stripe Price ID |
|------|-------|-------------------|-----------------|
| Starter | $19/month | `prod_TC3yulWRLuO0u1` | `price_1SG8g5B0VqDMH2904j8shzKt` |
| Professional | $49/month | `prod_TC3yA6xfwiGEBJ` | `price_1SG8gDB0VqDMH290srWjcYkT` |
| Enterprise | $199/month | `prod_TC3z877j3sFwii` | `price_1SG8gKB0VqDMH290XeuHz84l` |

### Configuration

1. **Set Stripe Publishable Key**
   
   Add to `.env` file:
   ```bash
   VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51QJLQfB0VqDMH290oWRNQRRxRCEqhTgPxJRVMQXqjMBKI0UQqJCLEHSCMVGrjN2mLZBRGKFh0Zzq1rkSqnEYFfPb00Wy3xfvWc
   ```

2. **Backend API Required**

   To complete the Stripe integration, you need to create backend API endpoints:

  **POST `/api/stripe/create-checkout-session`**
  ```javascript
  // Example using Node.js + Express (ESM)
  import Stripe from 'stripe';
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  app.post('/api/stripe/create-checkout-session', async (req, res) => {
    const { priceId, successUrl, cancelUrl, customerEmail } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
         payment_method_types: ['card'],
         line_items: [{
           price: priceId,
           quantity: 1,
         }],
         success_url: successUrl,
         cancel_url: cancelUrl,
         customer_email: customerEmail,
         allow_promotion_codes: true,
       });
       
      res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  ```

  **GET `/api/stripe/invoices/:invoiceId/pdf`**
  ```javascript
  app.get('/api/stripe/invoices/:invoiceId/pdf', async (req, res) => {
    const { invoiceId } = req.params;

    try {
      const invoice = await stripe.invoices.retrieve(invoiceId);

       // Generate PDF from invoice data
       const pdf = await generateInvoicePDF(invoice);
       
       res.setHeader('Content-Type', 'application/pdf');
       res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoiceId}.pdf"`);
       res.send(pdf);
     } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  ```

  **GET `/api/stripe/customers/:customerId/invoices`**
  ```javascript
  app.get('/api/stripe/customers/:customerId/invoices', async (req, res) => {
    const { customerId } = req.params;
     
     try {
       const invoices = await stripe.invoices.list({
         customer: customerId,
         limit: 100,
       });
       
       res.json(invoices.data);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });
   ```

3. **Webhook Configuration**

   Set up webhooks in Stripe Dashboard to handle subscription events:
   
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`

   Webhook endpoint: `https://yourdomain.com/api/webhooks/stripe`

   ```javascript
   app.post('/api/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
     const sig = req.headers['stripe-signature'];
     const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
     
     try {
       const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
       
       switch (event.type) {
         case 'customer.subscription.created':
           // Handle new subscription
           break;
         case 'invoice.paid':
           // Handle successful payment
           break;
         // ... handle other events
       }
       
       res.json({received: true});
     } catch (err) {
       res.status(400).send(`Webhook Error: ${err.message}`);
     }
   });
   ```

## Google OAuth Integration

### Setup Steps

1. **Create OAuth 2.0 Credentials**

   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new project or select existing one
   - Enable Google+ API
   - Create OAuth 2.0 Client ID
   - Application type: Web application
   - Add authorized redirect URIs:
     - `https://dhstx.co/auth/google/callback`
     - `http://localhost:5173/auth/google/callback` (for development)

2. **Set Environment Variable**

   Add to `.env` file:
   ```bash
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
   ```

3. **Backend OAuth Callback Handler**

   Create endpoint to handle OAuth callback:

   **GET `/auth/google/callback`**
   ```javascript
   const { OAuth2Client } = require('google-auth-library');
   const client = new OAuth2Client(
     process.env.GOOGLE_CLIENT_ID,
     process.env.GOOGLE_CLIENT_SECRET,
     'https://yourdomain.com/auth/google/callback'
   );
   
   app.get('/auth/google/callback', async (req, res) => {
     const { code } = req.query;
     
     try {
       // Exchange authorization code for tokens
       const { tokens } = await client.getToken(code);
       client.setCredentials(tokens);
       
       // Get user info
       const ticket = await client.verifyIdToken({
         idToken: tokens.id_token,
         audience: process.env.GOOGLE_CLIENT_ID,
       });
       
       const payload = ticket.getPayload();
       const { sub: googleId, email, name, picture } = payload;
       
       // Create or update user in your database
       const user = await findOrCreateUser({
         googleId,
         email,
         name,
         picture,
       });
       
       // Create session
       const sessionToken = generateSessionToken(user);
       
       // Redirect to dashboard with token
       res.redirect(`/dashboard?token=${sessionToken}`);
     } catch (error) {
       res.redirect('/login?error=oauth_failed');
     }
   });
   ```

## Invoice PDF Generation

The platform includes invoice download functionality. To implement:

1. **Install PDF Generation Library**

   ```bash
   npm install pdfkit
   ```

2. **Create PDF Generator**

   ```javascript
   const PDFDocument = require('pdfkit');
   
   async function generateInvoicePDF(invoice) {
     return new Promise((resolve, reject) => {
       const doc = new PDFDocument();
       const chunks = [];
       
       doc.on('data', chunk => chunks.push(chunk));
       doc.on('end', () => resolve(Buffer.concat(chunks)));
       doc.on('error', reject);
       
       // Header
       doc.fontSize(20).text('INVOICE', { align: 'center' });
       doc.moveDown();
       
       // Invoice details
       doc.fontSize(12);
       doc.text(`Invoice Number: ${invoice.number}`);
       doc.text(`Date: ${new Date(invoice.created * 1000).toLocaleDateString()}`);
       doc.text(`Amount: $${(invoice.amount_due / 100).toFixed(2)}`);
       doc.text(`Status: ${invoice.status.toUpperCase()}`);
       doc.moveDown();
       
       // Line items
       doc.text('Items:', { underline: true });
       invoice.lines.data.forEach(line => {
         doc.text(`${line.description}: $${(line.amount / 100).toFixed(2)}`);
       });
       
       doc.end();
     });
   }
   ```

## Testing

### Test Stripe Checkout

1. Use test card numbers from [Stripe Testing](https://stripe.com/docs/testing):
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Requires authentication: `4000 0025 0000 3155`

2. Test the checkout flow:
   - Click "Get Started" on any pricing tier
   - Complete the Stripe Checkout form
   - Verify redirect to success page
   - Check subscription in Stripe Dashboard

### Test Google OAuth

1. Click "Sign in with Google" button
2. Select Google account
3. Grant permissions
4. Verify redirect to dashboard
5. Check user created in database

## Production Checklist

- [ ] Stripe publishable key configured
- [ ] Stripe secret key configured on backend
- [ ] Stripe webhook endpoint created
- [ ] Webhook secret configured
- [ ] All webhook events handled
- [ ] Google OAuth client ID configured
- [ ] Google OAuth client secret configured on backend
- [ ] Authorized redirect URIs added
- [ ] Backend API endpoints deployed
- [ ] SSL/HTTPS enabled
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Test transactions verified

## Support

For issues or questions:
- Stripe: https://support.stripe.com
- Google OAuth: https://support.google.com/cloud
- DHStx: contact@dhstx.co

