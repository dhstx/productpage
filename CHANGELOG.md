# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Open source preparation with comprehensive governance files
- CI/CD workflows for automated testing and deployment
- CodeQL security scanning
- Dependabot configuration for automated dependency updates
- Issue templates (bug report, feature request, question)
- Pull request template with comprehensive checklist
- CODEOWNERS file for automatic review assignment
- Comprehensive architecture documentation
- SPDX license identifiers

### Changed
- Consolidated README.md with improved structure and badges
- Enhanced documentation organization

## [0.1.0] - 2025-10-08

### Added
- Initial release of DHStx Product Page Platform
- Landing page with hero section and core modules showcase
- AI-Powered Agents section showcasing three specialized agents:
  - Strategic Advisor for initiative prioritization
  - Engagement Analyst for participation tracking
  - Operations Assistant for task automation
- Background animation system with 21 interconnected cogwheels
- Anime.js v4 integration for sophisticated animations
- Supabase backend integration for contact forms and email captures
- Contact form with validation and error handling
- Stripe payment integration with three pricing tiers
- Product/Pricing page with detailed features
- Admin portal with protected routes:
  - Dashboard for platform overview
  - My Platforms for instance management
  - Billing for subscription management
  - Settings for user preferences
- Mock authentication system with demo credentials
- DHStx design system (Dark High-Contrast System)
- Responsive design with Tailwind CSS
- React Router for client-side navigation
- Vite build system for fast development
- Vitest testing framework with React Testing Library
- ESLint configuration with strict rules
- Vercel deployment configuration

### Technical
- React 19 with functional components and hooks
- Vite 6.x for build tooling
- Tailwind CSS 3.x for styling
- Supabase for backend database
- Stripe for payment processing
- Anime.js 4.x for animations
- Framer Motion for transitions
- Lucide React for icons
- pnpm for package management

### Performance
- Build time: ~3.87s
- Bundle size: ~602KB (gzipped)
- Animation performance: 60fps
- Lighthouse score: ≥90

### Security
- Row Level Security (RLS) policies in Supabase
- Environment variable validation
- Input sanitization and validation
- HTTPS enforcement in production
- Secure API key management

### Documentation
- Comprehensive README with quick start guide
- Supabase setup instructions
- Deployment guide
- Project structure documentation
- Contributing guidelines
- Code of Conduct (Contributor Covenant 2.1)
- Security policy with vulnerability disclosure process
- MIT License

## [0.0.1] - 2025-10-07

### Added
- Initial project setup
- Basic React application structure
- Vite configuration
- Tailwind CSS setup
- Basic routing with React Router
- Initial component structure

---

## Release Types

### Major (X.0.0)
- Breaking changes that require user action
- Major feature additions that change core functionality
- Significant architectural changes

### Minor (0.X.0)
- New features that are backward compatible
- Enhancements to existing features
- New integrations or services
- Performance improvements

### Patch (0.0.X)
- Bug fixes
- Documentation updates
- Security patches
- Dependency updates
- Minor UI/UX improvements

---

## Links

- [Unreleased Changes](https://github.com/dhstx/productpage/compare/v0.1.0...HEAD)
- [0.1.0 Release](https://github.com/dhstx/productpage/releases/tag/v0.1.0)

---

**Note:** This changelog is manually maintained. For a complete list of changes, see the [commit history](https://github.com/dhstx/productpage/commits/main).
