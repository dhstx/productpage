# DHStx Digital Asset Platform

Production-grade digital asset management workspace with Stripe billing, Supabase-ready authentication, analytics, and health monitoring.

## ✅ Recent Improvements

### Code Quality
- ✅ Stricter ESLint rules enforced
- ✅ Logout UI with loading/disabled states
- ✅ Test suite with Vitest setup
- ✅ Legacy files cleaned up
- ✅ pnpm-lock.yaml committed

### Testing
```bash
# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests with coverage
pnpm test:coverage
```

### Authentication
- Mock authentication with improved logout UX
- Loading states during logout
- Disabled button to prevent double-clicks
- Error handling

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

## 📦 Deployment

### Deploy to Vercel
```bash
vercel --prod
```

### Environment Variables
```
VITE_SUPABASE_URL=https://your-supabase-instance.supabase.co
VITE_SUPABASE_ANON_KEY=public-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_WEBHOOK_SECRET=whsec_...
VITE_SENTRY_DSN=https://public@sentry.io/project
```

## 🧪 Testing

Test suite includes:
- Authentication tests
- Component tests (ready to add)
- Integration tests (ready to add)

Add more tests in `src/test/` directory.

## 📋 Project Structure

```
productpage/
├── src/
│   ├── pages/          # Page components
│   ├── components/     # Reusable components
│   ├── lib/           # Utilities
│   └── test/          # Test files
├── public/            # Static assets
├── vitest.config.js   # Test configuration
└── package.json       # Dependencies
```

## 🔐 Demo Credentials

- Username: `admin`
- Password: `admin123`

## 📚 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [Quick Start](./QUICKSTART.md)
- [Project Summary](./PROJECT_SUMMARY.md)

## 🛠️ Tech Stack

- **Framework:** React + Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Routing:** React Router
- **Testing:** Vitest + Testing Library
- **Payments:** Stripe
- **Deployment:** Vercel

## 📝 License

Proprietary - DHStx
