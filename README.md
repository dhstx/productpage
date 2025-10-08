# DHStx Product Page Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-8.0.0+-orange)](https://pnpm.io/)

> A complete enterprise product page platform with AI-powered agents, Supabase backend, Stripe payments, and intricate background animations. Built with React, Vite, and the DHStx design system.

**Live Demo:** [https://productpage-snowy.vercel.app](https://productpage-snowy.vercel.app)

---

## 📋 Table of Contents

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Public Pages
- **Landing Page**: Hero section with animated background cogwheels, core modules showcase, and AI agents
- **Product/Pricing**: Detailed features, capabilities, and three pricing tiers
- **Contact Form**: Supabase-powered contact form with validation
- **Login**: Secure authentication with demo credentials

### AI-Powered Agents
- **Strategic Advisor**: Initiative prioritization, risk assessment, resource allocation
- **Engagement Analyst**: Participation tracking, engagement predictions, retention insights
- **Operations Assistant**: Task automation, workflow optimization, document generation

### Admin Portal (Protected)
- **Dashboard**: Overview of purchased platforms and system status
- **My Platforms**: Access and manage platform instances
- **Billing**: Stripe-powered subscription management and invoice history
- **Settings**: Account preferences, security, and notifications

### Design System
- **DHStx (Dark High-Contrast System)**: Minimalistic OS-inspired design
- **Background Animations**: 21 interconnected cogwheels with scroll-based speed modulation
- **Color Palette**: Deep black backgrounds (#0C0C0C) with amber accents (#FFC96C)
- **Typography**: Inter, IBM Plex Sans, and JetBrains Mono fonts

### Integrations
- **Supabase**: Backend database for contact forms and email captures
- **Stripe**: Payment processing and subscription management
- **Anime.js v4**: Sophisticated animations and transitions
- **Vercel**: Automated CI/CD deployment

---

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher
- **Git**: Latest version
- **Supabase Account**: Optional for backend features (free tier available)
- **Stripe Account**: Optional for payment features (test mode available)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dhstx/productpage.git
   cd productpage
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   ```

4. **Start the development server**:
   ```bash
   pnpm run dev
   ```

5. **Open your browser** to `http://localhost:5173`

### Demo Credentials

- **Username**: `admin`
- **Password**: `admin123`

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────┐    │
│  │  Landing   │  │  Product   │  │  Admin Dashboard   │    │
│  │    Page    │  │   Pages    │  │   (Protected)      │    │
│  └────────────┘  └────────────┘  └────────────────────┘    │
│         │              │                    │                │
│         └──────────────┴────────────────────┘                │
│                        │                                     │
└────────────────────────┼─────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐    ┌──────────┐    ┌──────────┐
   │Supabase │    │  Stripe  │    │  Vercel  │
   │Database │    │ Payments │    │   CDN    │
   └─────────┘    └──────────┘    └──────────┘
```

### Key Components

1. **Frontend Layer**
   - React 19 with functional components and hooks
   - Vite for fast HMR and optimized builds
   - React Router for client-side routing
   - Tailwind CSS for styling

2. **Backend Services**
   - **Supabase**: PostgreSQL database with Row Level Security (RLS)
   - **Stripe**: Payment processing and subscription management
   - **Vercel**: Hosting, CDN, and automated deployments

3. **Animation System**
   - Anime.js v4 for sophisticated animations
   - 21 parametric SVG cogwheels
   - RequestAnimationFrame for 60fps performance
   - Scroll-based speed modulation

4. **Data Flow**
   ```
   User Input → Form Validation → Supabase Client → Database
                                                  ↓
   User ← Success/Error Message ← Response ← RLS Check
   ```

### Security Architecture

- **Authentication**: Mock auth (production-ready integration pending)
- **Database Security**: Supabase Row Level Security (RLS) policies
- **API Keys**: Environment variables, never committed
- **HTTPS**: Enforced in production via Vercel
- **Input Validation**: Client-side and server-side validation

For detailed architecture documentation, see [ARCHITECTURE.md](./docs/ARCHITECTURE.md).

---

## 🛠️ Tech Stack

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Framework** | React | 19.x | UI library |
| **Build Tool** | Vite | 6.x | Fast dev server & bundler |
| **Language** | JavaScript | ES2022+ | Primary language |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Routing** | React Router | 7.x | Client-side routing |
| **Animation** | Anime.js | 4.x | Sophisticated animations |
| **Backend** | Supabase | Latest | Database & auth |
| **Payments** | Stripe | Latest | Payment processing |
| **Deployment** | Vercel | Latest | Hosting & CI/CD |

### Development Tools

- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint with strict rules
- **Package Manager**: pnpm (fast, disk-efficient)
- **Version Control**: Git + GitHub

### UI Components

- **Icons**: Lucide React
- **Animations**: Framer Motion + Anime.js
- **Forms**: Custom components with validation

---

## 📁 Project Structure

```
productpage/
├── .github/                  # GitHub configuration
│   ├── workflows/           # CI/CD workflows
│   ├── ISSUE_TEMPLATE/      # Issue templates
│   └── PULL_REQUEST_TEMPLATE.md
├── src/
│   ├── assets/              # Static assets and images
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── graphics/       # Animation components
│   │   ├── AdminLayout.jsx
│   │   ├── AIAgents.jsx
│   │   ├── ContactForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── lib/                # Utilities and helpers
│   │   ├── auth.js        # Authentication utilities
│   │   ├── stripe.js      # Stripe configuration
│   │   └── supabase.js    # Supabase client
│   ├── pages/              # Page components
│   │   ├── Landing.jsx
│   │   ├── Product.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Platforms.jsx
│   │   ├── Billing.jsx
│   │   └── Settings.jsx
│   ├── test/               # Test files
│   ├── App.css            # Global styles and DHStx system
│   ├── App.jsx            # Main app with routing
│   └── main.jsx           # Entry point
├── public/                 # Public assets
├── api/                    # API routes (if applicable)
├── docs/                   # Documentation
├── .env.example           # Environment variables template
├── .gitignore
├── CHANGELOG.md           # Version history
├── CODE_OF_CONDUCT.md     # Community guidelines
├── CONTRIBUTING.md        # Contribution guide
├── DEPLOYMENT.md          # Deployment instructions
├── LICENSE                # MIT License
├── package.json           # Dependencies
├── README.md              # This file
├── SECURITY.md            # Security policy
├── supabase-schema.sql    # Database schema
├── vite.config.js         # Vite configuration
└── vitest.config.js       # Test configuration
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Optional: API Configuration
VITE_API_URL=https://your-api-url.com
```

### Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `supabase-schema.sql` in the SQL Editor
3. Copy your project URL and anon key to `.env`
4. Configure Row Level Security (RLS) policies as needed

See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable key from the Dashboard (use test key for development)
3. Configure products and prices in Stripe Dashboard
4. Update `src/lib/stripe.js` with your price IDs

---

## 💻 Development

### Available Scripts

```bash
# Development
pnpm run dev          # Start development server (http://localhost:5173)
pnpm run build        # Build for production
pnpm run preview      # Preview production build locally

# Code Quality
pnpm run lint         # Run ESLint
pnpm run lint:fix     # Fix ESLint issues automatically

# Testing
pnpm run test         # Run tests
pnpm run test:watch   # Run tests in watch mode
pnpm run test:ui      # Run tests with UI
pnpm run test:coverage # Generate coverage report
```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our [coding standards](./CONTRIBUTING.md#coding-standards)

3. **Test your changes**:
   ```bash
   pnpm run lint
   pnpm run test
   pnpm run build
   ```

4. **Commit with conventional commits**:
   ```bash
   git commit -m "feat(component): add new feature"
   ```

5. **Push and create a pull request**

### Adding New Features

#### New Page
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Use `ProtectedRoute` for authenticated pages
4. Follow DHStx design system

#### New Component
1. Create component in `src/components/`
2. Add PropTypes for type checking
3. Write tests in `src/test/`
4. Document props and usage

---

## 🧪 Testing

### Test Structure

```javascript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm run test

# Run tests in watch mode (recommended during development)
pnpm run test:watch

# Run tests with UI
pnpm run test:ui

# Generate coverage report
pnpm run test:coverage
```

### Coverage Requirements

- **Minimum coverage**: 80%
- **Critical paths**: 100% coverage required
- **New features**: Must include tests

---

## 🚢 Deployment

### Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Import in Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Environment Variables in Vercel**:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Redeploy

### Manual Build

```bash
# Build for production
pnpm run build

# Output will be in dist/ directory
# Serve with any static hosting service
```

### CI/CD

Automated deployment is configured via GitHub Actions:
- **Trigger**: Push to `main` branch
- **Steps**: Install → Lint → Test → Build → Deploy
- **Vercel**: Automatic deployment on successful build

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Quick Contribution Steps

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

### Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

### Security

Found a security vulnerability? Please see our [Security Policy](./SECURITY.md) for responsible disclosure.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

```
Copyright (c) 2025 DHStx (Daley House Stacks)
```

---

## 📞 Support & Contact

- **Documentation**: Check our [docs](./docs/) directory
- **Issues**: [GitHub Issues](https://github.com/dhstx/productpage/issues)
- **Email**: contact@daleyhousestacks.com
- **Security**: security@daleyhousestacks.com

---

## 🙏 Acknowledgments

- **Design System**: Inspired by OS-level interfaces
- **Animation**: Powered by Anime.js
- **Backend**: Supabase for database and auth
- **Payments**: Stripe for subscription management
- **Hosting**: Vercel for deployment and CDN

---

## 📊 Project Status

- **Version**: 0.1.0
- **Status**: Active Development
- **Last Updated**: October 2025
- **Maintainers**: DHStx Team

---

**Built with ❤️ by DHStx (Daley House Stacks)**
