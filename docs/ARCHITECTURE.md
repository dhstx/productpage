# Architecture Documentation

## System Overview

The DHStx Product Page Platform is a modern, full-stack web application built with React and integrated with Supabase and Stripe for backend services. This document provides a comprehensive overview of the system architecture, data flow, and key design decisions.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Client Layer (Browser)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐   │
│  │   Landing    │  │   Product    │  │   Admin Dashboard      │   │
│  │     Page     │  │    Pages     │  │     (Protected)        │   │
│  └──────────────┘  └──────────────┘  └────────────────────────┘   │
│         │                  │                      │                 │
│         └──────────────────┴──────────────────────┘                 │
│                            │                                        │
│                 React Router (Client-Side)                          │
└─────────────────────────────┼───────────────────────────────────────┘
                              │
                 ┌────────────┼────────────┐
                 │            │            │
                 ▼            ▼            ▼
          ┌──────────┐  ┌──────────┐  ┌──────────┐
          │Supabase  │  │  Stripe  │  │  Vercel  │
          │PostgreSQL│  │ Payments │  │   CDN    │
          └──────────┘  └──────────┘  └──────────┘
```

## Component Architecture

### Frontend Layer

#### 1. Page Components (`src/pages/`)

**Public Pages:**
- `Landing.jsx` - Main landing page with hero, features, AI agents, contact form
- `Product.jsx` - Product details and pricing tiers
- `Login.jsx` - Authentication page

**Protected Pages (Admin Portal):**
- `Dashboard.jsx` - Overview and analytics
- `Platforms.jsx` - Platform management
- `Billing.jsx` - Subscription and payment management
- `Settings.jsx` - User preferences and configuration

#### 2. Reusable Components (`src/components/`)

**Layout Components:**
- `AdminLayout.jsx` - Admin portal layout with sidebar navigation
- `ProtectedRoute.jsx` - Route guard for authenticated pages

**Feature Components:**
- `AIAgents.jsx` - AI agents showcase section
- `ContactForm.jsx` - Supabase-integrated contact form
- `AnimatedButton.jsx` - Button with hover animations
- `AnimatedCounter.jsx` - Number counter with animation
- `FadeInSection.jsx` - Scroll-triggered fade-in animation
- `PageTransition.jsx` - Page transition wrapper

**Graphics Components (`src/components/graphics/`):**
- `BackgroundGears.jsx` - 21 animated cogwheels system
- `Gear.jsx` - Individual parametric SVG gear
- `ScrollGearsAnime.jsx` - Scroll-responsive gear animation

**UI Components (`src/components/ui/`):**
- shadcn/ui components (buttons, cards, inputs, etc.)

#### 3. Utility Libraries (`src/lib/`)

- `auth.js` - Authentication utilities and mock auth
- `stripe.js` - Stripe client configuration and pricing
- `supabase.js` - Supabase client and database functions
- `utils.js` - General utility functions

### Backend Services

#### 1. Supabase (Database & Backend)

**Database Schema:**

```sql
-- Contact Form Submissions
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email Captures (Newsletter)
CREATE TABLE email_captures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  source TEXT DEFAULT 'landing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Row Level Security (RLS):**
- Public insert access for contact submissions
- Admin-only read access for data retrieval
- Prevents unauthorized data access

**Functions:**
- `submitContactForm(data)` - Insert contact form submission
- `captureEmail(email, source)` - Capture email for newsletter

#### 2. Stripe (Payment Processing)

**Products & Pricing:**

| Tier | Price | Features |
|------|-------|----------|
| Starter | $49/month | Basic features, 5 users |
| Professional | $149/month | Advanced features, 20 users |
| Enterprise | Custom | Unlimited, custom integration |

**Stripe Integration:**
- Checkout session creation
- Subscription management
- Payment method handling
- Invoice generation and history
- Webhook handlers (future)

#### 3. Vercel (Hosting & CDN)

**Deployment Pipeline:**
1. Push to GitHub `main` branch
2. Vercel detects changes
3. Automated build process
4. Deploy to production
5. CDN distribution globally

**Environment Variables:**
- Managed in Vercel dashboard
- Injected at build time
- Secure and encrypted

## Data Flow

### Contact Form Submission Flow

```
┌──────────┐
│   User   │
│  Fills   │
│   Form   │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ Client-Side     │
│ Validation      │
│ (ContactForm)   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Supabase Client │
│ submitContact   │
│ Form()          │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Supabase API    │
│ (HTTPS)         │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Row Level       │
│ Security Check  │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ PostgreSQL      │
│ INSERT INTO     │
│ contact_        │
│ submissions     │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Success/Error   │
│ Response        │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ UI Feedback     │
│ (Toast/Alert)   │
└─────────────────┘
```

### Stripe Payment Flow

```
┌──────────┐
│   User   │
│ Selects  │
│  Plan    │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ Stripe Client   │
│ createCheckout  │
│ Session()       │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Stripe API      │
│ (HTTPS)         │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Stripe Checkout │
│ Page (Hosted)   │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Payment         │
│ Processing      │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Webhook Event   │
│ (Future)        │
└────┬────────────┘
     │
     ▼
┌─────────────────┐
│ Update User     │
│ Subscription    │
└─────────────────┘
```

## Animation System Architecture

### Background Gears System

**Components:**
- `BackgroundGears.jsx` - Main orchestrator
- `Gear.jsx` - Individual gear renderer

**Technical Implementation:**

```javascript
// Gear Configuration
const gears = [
  { 
    size: 120,           // Diameter in pixels
    x: 10,               // X position (%)
    y: 20,               // Y position (%)
    teeth: 21,           // Number of teeth
    rotation: 0,         // Initial rotation
    speed: 0.5,          // Rotation speed (deg/frame)
    depth: 1             // Z-index layer (1-3)
  },
  // ... 20 more gears
];

// Animation Loop
useEffect(() => {
  let animationFrameId;
  
  const animate = () => {
    // Update rotation for each gear
    gears.forEach(gear => {
      gear.rotation += gear.speed * scrollMultiplier;
    });
    
    // Request next frame
    animationFrameId = requestAnimationFrame(animate);
  };
  
  animate();
  
  return () => cancelAnimationFrame(animationFrameId);
}, []);
```

**Performance Optimizations:**
- RequestAnimationFrame for smooth 60fps
- CSS transforms for GPU acceleration
- Opacity layers to reduce visual complexity
- Scroll throttling to prevent jank

### Anime.js Integration

**Used for:**
- Button hover effects
- Counter animations
- Fade-in transitions
- Page transitions

**Example:**
```javascript
import { animate } from 'animejs';

animate({
  targets: '.counter',
  innerHTML: [0, 6705],
  duration: 2000,
  easing: 'easeOutExpo',
  round: 1
});
```

## Security Architecture

### Authentication

**Current Implementation:**
- Mock authentication for demo purposes
- Session storage for auth state
- Protected routes with `ProtectedRoute` component

**Future Implementation:**
- Supabase Auth integration
- OAuth providers (Google, GitHub)
- JWT token management
- Refresh token rotation

### Database Security

**Supabase Row Level Security (RLS):**

```sql
-- Contact submissions: Public insert, admin read
CREATE POLICY "Enable insert for all users" 
ON contact_submissions FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable read for admins only" 
ON contact_submissions FOR SELECT 
USING (auth.role() = 'admin');

-- Email captures: Public insert, admin read
CREATE POLICY "Enable insert for all users" 
ON email_captures FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Enable read for admins only" 
ON email_captures FOR SELECT 
USING (auth.role() = 'admin');
```

### API Security

**Environment Variables:**
- Never committed to version control
- Stored in Vercel environment variables
- Injected at build time via `import.meta.env`

**HTTPS:**
- All production traffic encrypted
- Enforced by Vercel
- Automatic SSL certificate management

**Input Validation:**
- Client-side validation for UX
- Server-side validation for security
- Sanitization of user inputs

## Performance Considerations

### Build Optimization

**Vite Configuration:**
```javascript
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'animations': ['animejs', 'framer-motion'],
          'ui': ['lucide-react', '@radix-ui/react-*']
        }
      }
    }
  }
};
```

**Code Splitting:**
- Route-based code splitting
- Lazy loading for admin pages
- Dynamic imports for heavy components

### Runtime Performance

**Metrics:**
- First Contentful Paint (FCP): <1.5s
- Largest Contentful Paint (LCP): <2.5s
- Time to Interactive (TTI): <3.5s
- Lighthouse Score: ≥90

**Optimizations:**
- Image lazy loading
- Font preloading
- CSS minification
- JavaScript tree shaking
- Gzip compression

## Deployment Architecture

### CI/CD Pipeline

```
┌─────────────┐
│  Developer  │
│   Commits   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   GitHub    │
│  Push main  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Vercel    │
│  Webhook    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Install   │
│ Dependencies│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Lint     │
│   (ESLint)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Test     │
│  (Vitest)   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Build    │
│   (Vite)    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Deploy    │
│   to CDN    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Production │
│    Live     │
└─────────────┘
```

### Environment Strategy

| Environment | Branch | URL | Purpose |
|-------------|--------|-----|---------|
| Development | `feature/*` | localhost:5173 | Local development |
| Preview | `feature/*` | `*.vercel.app` | PR previews |
| Production | `main` | productpage-snowy.vercel.app | Live site |

## Scalability Considerations

### Current Capacity

- **Concurrent Users**: 1,000+
- **Database**: Supabase free tier (500MB, 2GB transfer)
- **CDN**: Vercel global edge network
- **API Rate Limits**: Stripe (100 req/sec), Supabase (varies)

### Scaling Strategy

**Horizontal Scaling:**
- Vercel automatically scales based on traffic
- CDN caching reduces origin load
- Supabase connection pooling

**Vertical Scaling:**
- Upgrade Supabase plan for more capacity
- Optimize database queries and indexes
- Implement caching layers (Redis)

**Future Enhancements:**
- Implement CDN caching for API responses
- Add rate limiting to prevent abuse
- Implement database read replicas
- Use edge functions for geolocation-based routing

## Monitoring & Observability

### Metrics Tracked

**Performance:**
- Page load times
- API response times
- Animation frame rate
- Bundle size

**Business:**
- Contact form submissions
- Email captures
- Stripe checkout sessions
- User registrations

**Errors:**
- JavaScript errors (console)
- API errors (Supabase, Stripe)
- Build failures (Vercel)

### Tools (Future)

- **Sentry**: Error tracking and monitoring
- **Vercel Analytics**: Performance metrics
- **Supabase Dashboard**: Database metrics
- **Stripe Dashboard**: Payment metrics

## Future Architecture Enhancements

### Short-Term (0-3 months)

1. **Real Authentication**
   - Implement Supabase Auth
   - Add OAuth providers
   - Secure admin routes

2. **Webhook Handlers**
   - Stripe webhook endpoint
   - Automated subscription updates
   - Email notifications

3. **Enhanced Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring
   - User analytics

### Medium-Term (3-6 months)

1. **API Layer**
   - Serverless functions for business logic
   - API rate limiting
   - Request validation

2. **Advanced Features**
   - Real-time updates (Supabase Realtime)
   - File uploads (Supabase Storage)
   - Advanced search

3. **Testing**
   - E2E tests (Playwright)
   - Visual regression tests
   - Load testing

### Long-Term (6-12 months)

1. **Microservices**
   - Separate services for different domains
   - Event-driven architecture
   - Message queues

2. **Advanced Analytics**
   - Custom dashboards
   - Predictive analytics
   - A/B testing framework

3. **Global Expansion**
   - Multi-region deployment
   - Localization (i18n)
   - Compliance (GDPR, CCPA)

---

## References

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Anime.js Documentation](https://animejs.com/documentation/)

---

**Last Updated**: October 2025  
**Version**: 0.1.0  
**Maintainers**: DHStx Team
