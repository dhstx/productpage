# DHStx Company Platform - Deployment Guide

## Quick Deployment to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to project directory**
   ```bash
   cd productpage
   ```

3. **Login to Vercel**
   ```bash
   vercel login
   ```

4. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

5. **Follow the prompts:**
   - Set up and deploy: Yes
   - Which scope: Select your team (dhstx's projects)
   - Link to existing project: No
   - Project name: productpage (or your preferred name)
   - Directory: ./ (current directory)
   - Override settings: No

### Option 2: Deploy via GitHub Integration

1. **Push code to GitHub** (if not already done)
   ```bash
   git remote add origin https://github.com/dhstx/productpage.git
   git branch -M main
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository: `dhstx/productpage`
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `pnpm install && pnpm run build`
     - Output Directory: `dist`
   - Add Environment Variables (see below)
   - Click "Deploy"

### Option 3: Manual GitHub Push with Token

If you need to push to GitHub first, create a new Personal Access Token with proper permissions:

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with `repo` scope
3. Use the token to push:
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/dhstx/productpage.git
   git push -u origin main
   ```

## Environment Variables

After deployment, add these environment variables in Vercel Dashboard:

### Required for Stripe Integration
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key_here
VITE_API_URL=https://your-api-url.com
```

### Optional (for production)
```
VITE_APP_NAME=DHStx Platform
VITE_APP_URL=https://your-domain.com
```

## Post-Deployment Configuration

### 1. Set up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard → Developers → API keys
3. Add the publishable key to Vercel environment variables
4. Create products in Stripe matching the pricing tiers:
   - Starter: $999/month
   - Professional: $2,499/month
   - Enterprise: $5,999/month

### 2. Configure Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Navigate to Settings → Domains
3. Add your custom domain
4. Update DNS records as instructed

### 3. Set up Authentication Backend

The current implementation uses mock authentication. For production:

1. Set up a backend API (Node.js/Express, Flask, etc.)
2. Implement proper user authentication (JWT, OAuth, etc.)
3. Update `src/lib/auth.js` to use real API endpoints
4. Add the API URL to environment variables

### 4. Stripe Webhook Configuration

1. In Stripe Dashboard, go to Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

## Troubleshooting

### Build Fails on Vercel

If the build fails due to memory issues:
1. Go to Project Settings → General
2. Under "Build & Development Settings"
3. Add to Build Command: `NODE_OPTIONS="--max-old-space-size=4096" pnpm run build`

### Images Not Loading

Ensure all images are in the `public` folder or properly imported in components.

### Routes Not Working

The `vercel.json` file includes rewrites to handle client-side routing. Ensure it's committed to the repository.

### Environment Variables Not Working

1. Make sure all env vars start with `VITE_` prefix
2. Redeploy after adding new environment variables
3. Check that variables are set in the correct environment (Production/Preview)

## Monitoring and Maintenance

### Check Deployment Status
```bash
vercel ls
```

### View Deployment Logs
```bash
vercel logs [deployment-url]
```

### Rollback to Previous Deployment
1. Go to Vercel Dashboard → Deployments
2. Find the working deployment
3. Click "..." → "Promote to Production"

## Support

For issues or questions:
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Stripe Documentation: [stripe.com/docs](https://stripe.com/docs)
- GitHub Issues: Create an issue in the repository

---

**Note:** This is a frontend-only deployment. You'll need to set up a separate backend API for:
- User authentication and management
- Stripe payment processing
- Database operations
- Platform provisioning
