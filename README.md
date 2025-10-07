# ProductPage

A modern product showcase and e-commerce platform built with React 18+, TypeScript, and a comprehensive set of modern web technologies.

## Features

- 🔐 **Authentication System** - Login and registration with persistent state
- 🛍️ **Product Catalog** - Browse and purchase multiple platform products
- 💳 **Stripe Integration** - Secure payment processing (Stripe Elements)
- 📊 **Admin Dashboard** - Analytics with Recharts for data visualization
- 🎨 **Modern UI** - Beautiful animations with Framer Motion
- 🎯 **State Management** - Zustand for efficient state handling
- 🔒 **Protected Routes** - Secure access to purchased platforms
- 📱 **Responsive Design** - Tailwind CSS for mobile-first styling

## Tech Stack

- **React 18+** with TypeScript
- **Vite** build tool with SWC for fast development
- **React Router DOM** for routing
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Radix UI** components for accessible UI primitives
- **Axios** for API calls
- **Recharts** for data visualization
- **date-fns** for date handling
- **Zustand** for state management
- **Stripe** for payment processing

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.tsx
│   ├── ProductCard.tsx
│   └── ProtectedRoute.tsx
├── pages/           # Page components
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── DashboardPage.tsx
├── store/           # Zustand state stores
│   ├── authStore.ts
│   └── purchaseStore.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── lib/             # Utility functions
│   └── utils.ts
├── utils/           # Mock data and helpers
│   └── mockData.ts
├── App.tsx          # Main app component
└── main.tsx         # Application entry point
```

## Available Routes

- `/` - Home page with feature showcase
- `/products` - Product catalog with purchase functionality
- `/login` - User authentication
- `/register` - New user registration
- `/dashboard` - Protected admin dashboard with analytics

## Features in Detail

### Authentication
- Persistent login state using Zustand with localStorage
- Protected routes for authenticated users
- Clean login/register UI with form validation

### Products
- 4 platform products (Analytics, E-Commerce, CRM, Marketing)
- Feature lists and pricing
- Stripe payment integration
- Add to purchases functionality

### Dashboard
- Overview of purchased products
- Analytics charts (weekly usage, platform distribution)
- Quick access links to purchased platforms
- User statistics

### Stripe Integration
- Secure payment processing with Stripe Elements
- Test mode ready (use test keys)
- Card element for payment details
- Purchase confirmation flow

## Development

The application uses mock data for demonstration purposes. In production:

1. Replace mock authentication with real backend API
2. Configure Stripe with your publishable key
3. Implement real payment processing
4. Connect to your product/user database
5. Add proper error handling and validation

## License

MIT License - see LICENSE file for details
