# DHStx Digital Asset Platform - Quick Start

## 🚀 Fastest Way to Deploy

### Step 1: Extract the Archive
```bash
tar -xzf productpage-complete.tar.gz
cd productpage
```

### Step 2: Install Dependencies
```bash
npm install -g pnpm
pnpm install
```

### Step 3: Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel --prod
```

That's it! Your digital asset control plane will be live in minutes.

## 📋 What's Included

✅ **Complete React Application**
- Landing page with asset-focused messaging
- Product/pricing page (3 tiers: $999, $2,499, $5,999)
- User authentication system
- Admin dashboard with integration health and analytics
- Billing management with Stripe
- Platform access management
- Settings page

✅ **DHStx Design System**
- Dark theme (#0C0C0C background)
- Accent yellow (#FFC96C) for interactions
- IBM Plex Sans typography
- System-like, exclusive OS feel
- Fully responsive

✅ **Stripe Integration**
- Payment processing ready
- Subscription management
- Invoice history
- Billing portal

✅ **Authentication**
- Protected routes
- Admin portal access
- User session management

## 🔧 Configuration

### Add Environment Variables in Vercel

After deployment, go to your Vercel project settings and add:

```
VITE_SUPABASE_URL=https://your-supabase-instance.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_secret
VITE_SENTRY_DSN=https://public@sentry.io/project
```

### Set up Stripe Products

Create three products in your Stripe Dashboard:

1. **Starter** - $999/month
   - Up to 25 users
   - 5,000 records
   - Core platform access
   - Basic analytics
   - Email support

2. **Professional** - $2,499/month (Most Popular)
   - Up to 50 users
   - 15,000 records
   - Custom branding
   - Advanced analytics
   - Priority support

3. **Enterprise** - $5,999/month
   - Unlimited users
   - Unlimited records
   - White-label solution
   - Custom integrations
   - 24/7 support

## 📁 Project Structure

```
productpage/
├── src/
│   ├── pages/          # All page components
│   │   ├── Landing.jsx
│   │   ├── Product.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Platforms.jsx
│   │   ├── Billing.jsx
│   │   └── Settings.jsx
│   ├── components/     # Reusable components
│   │   ├── AdminLayout.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── ui/        # shadcn/ui components
│   ├── lib/           # Utilities
│   │   ├── auth.js    # Authentication logic
│   │   ├── stripe.js  # Stripe integration
│   │   └── utils.js   # Helper functions
│   └── assets/        # Images and static files
├── public/            # Public assets
├── vercel.json        # Vercel configuration
├── README.md          # Full documentation
├── DEPLOYMENT.md      # Detailed deployment guide
└── package.json       # Dependencies

```

## 🔐 Demo Credentials

For testing the admin portal:
- Username: `admin`
- Password: `admin123`

**⚠️ Important:** Replace with real authentication before production!

## 🌐 GitHub Repository

The code is ready to push to: `https://github.com/dhstx/productpage.git`

To push manually:
```bash
cd productpage
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/dhstx/productpage.git
git branch -M main
git push -u origin main
```

Then connect the repo to Vercel for automatic deployments.

## 📚 Next Steps

1. **Deploy** - Get it live on Vercel
2. **Configure Stripe** - Add your API keys
3. **Set up Backend** - Build API for real authentication
4. **Custom Domain** - Add your domain in Vercel
5. **Test** - Try the full purchase flow
6. **Launch** - Share with your customers!

## 🆘 Need Help?

- Full deployment guide: See `DEPLOYMENT.md`
- Detailed README: See `README.md`
- Vercel docs: https://vercel.com/docs
- Stripe docs: https://stripe.com/docs

---

**Built with:** React, Vite, Tailwind CSS, shadcn/ui, Stripe, React Router
**Design:** DHStx exclusive OS-style system
**Ready for:** Production deployment
