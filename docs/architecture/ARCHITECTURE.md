# University Web Application - System Architecture

## Overview
This document describes the modular, scalable architecture for a university web application serving Board, Staff, and Alumni users.

## Architecture Principles
- **12-Factor App Methodology**: Strict adherence to 12-factor principles
- **Microservices**: Loosely coupled, independently deployable services
- **Cloud-Native**: Designed for AWS/GCP deployment
- **Security-First**: SSO/SAML, RBAC, MFA, comprehensive audit logging
- **Scalability**: Horizontal scaling, caching, load balancing
- **Observability**: Centralized logging, monitoring, and tracing

## Technology Stack

### Backend
- **Runtime**: Node.js 20 LTS
- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL 15 (Primary)
- **Cache**: Redis 7
- **Message Queue**: Redis Bull Queue
- **Authentication**: Passport.js with SAML2, JWT
- **API**: RESTful + GraphQL (optional)

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Styling**: Tailwind CSS
- **State Management**: React Query + Zustand
- **UI Components**: Radix UI / shadcn/ui
- **Forms**: React Hook Form + Zod validation

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Orchestration**: Kubernetes (AWS EKS / GCP GKE)
- **CI/CD**: GitHub Actions
- **Cloud Provider**: AWS (primary) / GCP (alternative)
- **CDN**: CloudFront / Cloud CDN
- **Storage**: S3 / Cloud Storage
- **Monitoring**: AWS CloudWatch, CloudTrail
- **Logging**: LogRocket, ELK Stack
- **Secrets**: AWS Secrets Manager / GCP Secret Manager

## System Architecture

### High-Level Components

```
┌─────────────────────────────────────────────────────────────┐
│                        CDN / CloudFront                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Application Load Balancer                  │
└─────┬────────────────────────────────────────┬──────────────┘
      │                                        │
┌─────▼──────────────┐              ┌─────────▼──────────────┐
│  Frontend (Next.js) │              │   Backend (NestJS)     │
│  - SSR/ISR         │◄─────────────►│   - API Gateway        │
│  - Static Assets   │              │   - Auth Service       │
│  - UI Components   │              │   - User Service       │
└────────────────────┘              │   - Audit Service      │
                                    │   - Role Service       │
                                    └────────┬───────────────┘
                                             │
                      ┌──────────────────────┼──────────────────────┐
                      │                      │                      │
              ┌───────▼────────┐    ┌───────▼────────┐    ┌───────▼────────┐
              │   PostgreSQL    │    │     Redis      │    │   S3 Bucket    │
              │   - User Data   │    │   - Sessions   │    │  - Documents   │
              │   - Audit Logs  │    │   - Cache      │    │  - Assets      │
              │   - Roles/Perms │    │   - Queue      │    └────────────────┘
              └─────────────────┘    └────────────────┘
```

### Service Breakdown

#### 1. Frontend Service (Next.js)
- Server-Side Rendering (SSR) for initial page loads
- Static Site Generation (SSG) for public pages
- Client-side routing and state management
- Responsive UI with Tailwind CSS
- Optimized asset delivery via CDN

#### 2. API Gateway
- Single entry point for all backend services
- Request routing and load balancing
- Rate limiting and throttling
- API versioning
- Request/response transformation

#### 3. Authentication Service
- SSO/SAML integration (Okta, Azure AD)
- JWT token generation and validation
- MFA verification
- Session management
- Token refresh logic

#### 4. User Service
- User profile management
- Role assignment
- Permission verification
- User directory

#### 5. Audit Service
- Event logging (CRUD operations)
- Permission change tracking
- Login attempt logging
- Compliance reporting
- Change history queries

#### 6. Role Service
- RBAC implementation
- Role definition and management
- Permission management
- Access control evaluation

## Data Flow

### Authentication Flow

```
User Browser
    │
    │ 1. Access Protected Resource
    ▼
Next.js Frontend
    │
    │ 2. Redirect to SSO
    ▼
SAML IdP (Okta/Azure AD)
    │
    │ 3. User Authenticates
    │ 4. SAML Assertion
    ▼
NestJS Auth Service
    │
    │ 5. Validate SAML
    │ 6. Generate JWT + Session
    │ 7. Store in Redis
    ▼
PostgreSQL (Audit Log)
    │
    │ 8. Return JWT
    ▼
User Browser (JWT in HttpOnly Cookie)
```

### API Request Flow with RBAC

```
User Browser (with JWT)
    │
    │ 1. API Request + JWT
    ▼
API Gateway
    │
    │ 2. Validate JWT
    ▼
Auth Middleware
    │
    │ 3. Extract User + Roles
    ▼
RBAC Middleware
    │
    │ 4. Check Permissions
    ▼
Redis Cache (Permissions)
    │
    │ 5. Cache Hit/Miss
    ▼
PostgreSQL (if cache miss)
    │
    │ 6. Execute Business Logic
    ▼
Service Layer
    │
    │ 7. Audit Log
    ▼
Audit Service → PostgreSQL
    │
    │ 8. Response
    ▼
User Browser
```

## 12-Factor App Compliance

1. **Codebase**: Single repository with environment-specific configurations
2. **Dependencies**: Explicitly declared in package.json, managed by npm/pnpm
3. **Config**: Environment variables via .env files (never committed)
4. **Backing Services**: Database, cache, external services as attached resources
5. **Build, Release, Run**: Separate stages in CI/CD pipeline
6. **Processes**: Stateless services, session data in Redis
7. **Port Binding**: Self-contained services exposing ports
8. **Concurrency**: Horizontal scaling via container orchestration
9. **Disposability**: Fast startup, graceful shutdown
10. **Dev/Prod Parity**: Docker ensures consistency across environments
11. **Logs**: Stdout/stderr streams, aggregated by logging service
12. **Admin Processes**: Separate scripts for migrations, maintenance

## Scalability Strategy

### Horizontal Scaling
- Containerized services in Kubernetes
- Auto-scaling based on CPU/Memory metrics
- Load balancing across multiple instances

### Caching Strategy
- Redis for session storage (5-minute TTL)
- Query result caching (1-minute TTL for user data)
- CDN for static assets (1-year TTL)
- Invalidation on data updates

### Database Optimization
- Read replicas for reporting queries
- Connection pooling (min: 10, max: 50)
- Indexed columns for frequent queries
- Partitioning for audit tables (by date)

## Security Measures

### Authentication
- SAML 2.0 for SSO
- JWT with RS256 signature
- MFA enforcement for sensitive operations
- Session timeout: 30 minutes inactivity

### Authorization
- Role-Based Access Control (RBAC)
- Principle of least privilege
- Permission caching with invalidation

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- PII data masking in logs
- Secure secrets management

### Network Security
- VPC with private subnets
- Security groups and NACLs
- WAF for DDoS protection
- API rate limiting

## Monitoring and Observability

### Metrics
- Application metrics (Prometheus)
- Infrastructure metrics (CloudWatch)
- Business metrics (custom dashboards)

### Logging
- Structured JSON logging
- Centralized log aggregation (ELK/CloudWatch)
- Log retention: 90 days (standard), 7 years (audit)
- Real-time alerting on errors

### Tracing
- Distributed tracing (OpenTelemetry)
- Request correlation IDs
- Performance bottleneck identification

## Disaster Recovery

### Backup Strategy
- Database: Automated daily backups, 30-day retention
- Redis: RDB snapshots every 5 minutes
- S3: Versioning enabled, cross-region replication

### Recovery Objectives
- RTO (Recovery Time Objective): 4 hours
- RPO (Recovery Point Objective): 5 minutes

## Deployment Strategy

### Environments
- Development: Local Docker Compose
- Staging: AWS/GCP with reduced resources
- Production: Full AWS/GCP deployment

### CI/CD Pipeline
1. Code push to GitHub
2. Automated tests (unit, integration, e2e)
3. Security scanning (Snyk, SonarQube)
4. Build Docker images
5. Push to container registry
6. Deploy to staging (automatic)
7. Run smoke tests
8. Deploy to production (manual approval)
9. Health checks and rollback capability

## Cost Optimization

- Right-sizing instances based on metrics
- Reserved instances for baseline load
- Spot instances for batch jobs
- Auto-scaling to match demand
- S3 lifecycle policies for archive
- CloudFront caching to reduce origin load
