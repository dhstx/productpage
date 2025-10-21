# InboxPass - Email Compliance Kit

Production-ready webapp that scans domains for email deliverability compliance (SPF, DKIM, DMARC, BIMI), generates DNS records, accepts Stripe payments, and delivers PDF compliance reports.

## Features

- **Domain Scanning**: Real-time DNS checks for SPF, DKIM, DMARC, and BIMI records
- **Provider Detection**: Automatically identifies Google Workspace, M365, SendGrid, Mailgun, and other ESPs
- **AI-Powered Recommendations**: Generates safe-by-default DNS records using LLM agents
- **Stripe Integration**: One-time $29 payment for compliance kit
- **PDF Report Generation**: Comprehensive compliance reports with copy-paste DNS records
- **Webhook Handling**: Automatic report generation after successful payment

## Tech Stack

- **Frontend**: React 19 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Express + tRPC + Node.js
- **Database**: MySQL/TiDB via Drizzle ORM
- **Payment**: Stripe Checkout
- **PDF Generation**: WeasyPrint
- **AI**: Anthropic Claude API for record generation
- **Storage**: S3 for PDF reports

## Environment Variables

Required environment variables (already configured in production):

```bash
# Database
DATABASE_URL=mysql://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Authentication
JWT_SECRET=...
OAUTH_SERVER_URL=...
VITE_OAUTH_PORTAL_URL=...

# AI & Storage (auto-configured)
ANTHROPIC_API_KEY=...
BUILT_IN_FORGE_API_KEY=...
BUILT_IN_FORGE_API_URL=...
```

## Local Development

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Push database schema**:
   ```bash
   pnpm db:push
   ```

3. **Start development server**:
   ```bash
   pnpm dev
   ```

4. **Test Stripe webhooks locally** (optional):
   ```bash
   # Install Stripe CLI
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   
   # Trigger test webhook
   stripe trigger checkout.session.completed
   ```

## Project Structure

```
/home/ubuntu/inboxpass/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # UI components
│   │   │   ├── DomainScanner.tsx
│   │   │   └── FAQ.tsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.tsx
│   │   │   └── Success.tsx
│   │   └── lib/           # tRPC client
├── server/                # Backend Express + tRPC
│   ├── routers.ts         # tRPC procedures
│   ├── db.ts              # Database queries
│   ├── dnsScanner.ts      # DNS lookup logic
│   ├── agents.ts          # AI-powered record generation
│   ├── stripe.ts          # Stripe integration
│   ├── pdfGenerator.ts    # PDF creation
│   ├── webhookHandler.ts  # Stripe webhook processing
│   └── webhookRoute.ts    # Express webhook route
├── drizzle/               # Database schema
│   └── schema.ts
└── README.md
```

## API Endpoints

### tRPC Procedures

- `scan.scanDomain` - Scan a domain for compliance
- `scan.getDomain` - Get domain details
- `payment.createCheckout` - Create Stripe checkout session
- `payment.verifyPayment` - Verify payment completion
- `payment.generateReport` - Generate and download PDF report

### REST Endpoints

- `POST /api/stripe/webhook` - Stripe webhook handler (raw body)

## Database Schema

### `domains` table
- Stores domain scan results, provider detection, and payment status
- Fields: SPF, DKIM, DMARC, BIMI records, provider flags, Stripe session IDs

### `tests` table
- Optional: stores individual DNS/header test results

## Deployment

The application is deployed automatically via the Manus platform. To publish:

1. Save a checkpoint:
   ```bash
   # Via tooling: webdev_save_checkpoint
   ```

2. Click "Publish" in the UI to configure deployment settings

3. Webhook endpoint will be available at:
   ```
   https://your-domain.com/api/stripe/webhook
   ```

4. Configure Stripe webhook in dashboard:
   - URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`

## Testing

### Manual DNS Scan Test

1. Visit homepage
2. Enter a real domain (e.g., `google.com`)
3. Click "Scan Domain"
4. Verify results show SPF, DKIM, DMARC status

### Payment Flow Test

1. Complete a domain scan
2. Click "Get Your Compliance Kit — $29"
3. Use Stripe test card: `4242 4242 4242 4242`
4. Complete checkout
5. Verify redirect to `/success` page
6. Click "Download Compliance Kit"
7. Verify PDF generation

## Coupon Codes

- `LAUNCH10` - 10% off (configured in Stripe dashboard)
- Apply via URL: `/?code=LAUNCH10`

## Security

- Stripe webhook signatures verified
- Payment processing via Stripe Checkout (PCI compliant)
- PDF reports stored in S3 with secure URLs
- No sensitive data stored in database
- Read-only DNS lookups only

## License

Proprietary - All rights reserved

## Support

For issues or questions, contact: support@inboxpass.app

