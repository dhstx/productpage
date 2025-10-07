# DHStx Digital Asset Platform

An enterprise-ready web application for managing purchased digital products, licenses, and subscriptions. The platform ships with Stripe billing, Supabase-ready authentication hooks, integration health monitoring, and a responsive admin workspace. Built with React, Tailwind CSS, and the DHStx design system.

## Features

### Public Pages
- **Landing Page**: Hero section with platform overview and core modules
- **Product/Pricing Page**: Detailed features, capabilities, and pricing tiers
- **Login Page**: Secure authentication with demo credentials

### Admin Portal (Protected)
- **Dashboard**: Portfolio analytics, integration health, and renewal visibility
- **My Platforms**: Access and manage every purchased asset environment
- **Billing**: Subscription management, payment methods, and invoice history
- **Settings**: Account preferences, security, and notifications

### Design System
- **DHStx (Dark High-Contrast System)**: Minimalistic OS-inspired design
- **Color Palette**: Deep black backgrounds with amber accents
- **Typography**: Inter, IBM Plex Sans, and JetBrains Mono fonts
- **Components**: System buttons, panels, and consistent UI patterns

## Tech Stack

- **React 19** with JSX
- **Vite** for fast development and building
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Stripe** for payment processing
- **Lucide React** for icons
- **Framer Motion** for animations

## Getting Started

### Prerequisites
- Node.js 18+ and pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/dhstx/productpage.git
cd productpage
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Set up environment variables:
\`\`\`bash
cp .env.example .env
\`\`\`

Edit `.env` and add your Stripe publishable key:
\`\`\`
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
\`\`\`

4. Start the development server:
\`\`\`bash
pnpm run dev
\`\`\`

5. Open your browser to `http://localhost:5173`

### Demo Credentials
- **Username**: admin
- **Password**: admin123

## Project Structure

\`\`\`
productpage/
├── src/
│   ├── assets/          # Static assets and images
│   ├── components/      # React components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── AdminLayout.jsx
│   │   └── ProtectedRoute.jsx
│   ├── lib/            # Utilities and helpers
│   │   ├── auth.js     # Authentication utilities
│   │   └── stripe.js   # Stripe configuration
│   ├── pages/          # Page components
│   │   ├── Landing.jsx
│   │   ├── Product.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Platforms.jsx
│   │   ├── Billing.jsx
│   │   └── Settings.jsx
│   ├── App.css         # Global styles and DHStx system
│   ├── App.jsx         # Main app with routing
│   └── main.jsx        # Entry point
├── public/             # Public assets
├── index.html          # HTML entry point
├── package.json        # Dependencies
└── vite.config.js      # Vite configuration
\`\`\`

## API & Integration Setup

### Environment Variables

Create an `.env` or `.env.local` file with the following keys:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_STRIPE_WEBHOOK_SECRET=whsec_your_secret
VITE_SENTRY_DSN=https://public@sentry.io/project
```

These variables power Supabase authentication, Stripe payments/webhooks, and Sentry error logging. The dashboard renders integration health cards based on their presence.

### Stripe Integration

### Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable key from the Stripe Dashboard
3. Add the key to your `.env` file
4. Configure products and prices in Stripe Dashboard
5. Update `src/lib/stripe.js` with your price IDs
6. Add your webhook signing secret to `VITE_STRIPE_WEBHOOK_SECRET`

### Features
- Product catalog with three tiers (Starter, Professional, Enterprise)
- Subscription management
- Payment method handling
- Invoice history and downloads
- Billing information management
- Mock webhook event logging helpers (extend within your serverless functions)

### Supabase Authentication

- Configure Supabase URL and anon key via environment variables
- Extend `src/lib/auth.js` with Supabase client logic for production authentication
- Use Supabase Functions for secure webhook relays if preferred

### Error Logging & Health Checks

- Provide a Sentry DSN to enable runtime error forwarding via `logIntegrationIssue`
- The dashboard's **Integration Health** section surfaces missing configuration at a glance

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Manual Build

\`\`\`bash
pnpm run build
\`\`\`

The build output will be in the `dist/` directory.

## Design System Guidelines

### Colors
- Primary Black: `#0C0C0C`
- Panel: `#1A1A1A`
- Border: `#202020`
- Text: `#F2F2F2`
- Muted: `#B3B3B3`
- Accent: `#FFC96C`

### Typography
- All headings: UPPERCASE with tight tracking
- Body: Inter font family
- Monospace: JetBrains Mono

### Components
- Use `.btn-system` for buttons
- Use `.panel-system` for containers
- Sharp corners: `rounded-[2px]` or `rounded-[4px]`
- Minimal borders with `border-[#202020]`

## Development

### Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

### Adding New Pages

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Use `ProtectedRoute` wrapper for authenticated pages
4. Follow DHStx design system guidelines

## License

Copyright © 2025 DHStx. All rights reserved.

## Support

For questions or issues, please contact the development team.
