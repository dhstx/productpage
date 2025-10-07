# System Diagrams

## High-Level Architecture

```
                                    Internet
                                       │
                                       │
                    ┌──────────────────▼──────────────────┐
                    │         Route 53 / Cloud DNS        │
                    │        (DNS Load Balancing)         │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │        CloudFront / Cloud CDN        │
                    │    (Content Delivery Network)       │
                    └──────────────────┬──────────────────┘
                                       │
                    ┌──────────────────▼──────────────────┐
                    │      Application Load Balancer       │
                    │        (ALB / Cloud Load             │
                    │         Balancer)                    │
                    └────┬───────────────────────┬─────────┘
                         │                       │
          ┌──────────────▼──────────┐   ┌───────▼──────────────┐
          │    Frontend Cluster      │   │   Backend Cluster    │
          │      (Next.js)          │   │     (NestJS)         │
          │  ┌─────┐ ┌─────┐       │   │  ┌─────┐ ┌─────┐    │
          │  │ Pod │ │ Pod │ ...   │   │  │ Pod │ │ Pod │... │
          │  └─────┘ └─────┘       │   │  └─────┘ └─────┘    │
          │  Auto-scaling: 2-10    │   │  Auto-scaling: 3-15  │
          └─────────────────────────┘   └──────────┬───────────┘
                                                    │
                                    ┌───────────────┼───────────────┐
                                    │               │               │
                         ┌──────────▼──────┐ ┌─────▼──────┐ ┌──────▼──────┐
                         │   PostgreSQL     │ │   Redis    │ │  S3 Bucket  │
                         │  (Multi-AZ RDS)  │ │ (Cluster)  │ │  (Versioned)│
                         │  - Primary       │ │ - Master   │ │  - Static   │
                         │  - Read Replica  │ │ - Replica  │ │  - Assets   │
                         └──────────────────┘ └────────────┘ └─────────────┘
                                    │
                         ┌──────────▼──────────┐
                         │   Backup Storage    │
                         │  (S3 Glacier/       │
                         │   Cloud Storage)    │
                         └─────────────────────┘
```

## Data Flow Diagram

### User Authentication Flow

```
┌──────────┐
│  User    │
│  Browser │
└────┬─────┘
     │
     │ 1. GET /dashboard (No Auth)
     ▼
┌─────────────────┐
│  Next.js App    │
│  (Frontend)     │
└────┬────────────┘
     │
     │ 2. Redirect to /auth/login
     ▼
┌─────────────────┐
│  Login Page     │
└────┬────────────┘
     │
     │ 3. Click "Login with SSO"
     ▼
┌─────────────────┐
│  NestJS API     │
│  /auth/saml     │
└────┬────────────┘
     │
     │ 4. SAML AuthnRequest
     ▼
┌─────────────────┐
│  Identity       │
│  Provider       │
│  (Okta/Azure)   │
└────┬────────────┘
     │
     │ 5. User Authenticates + MFA
     │
     │ 6. SAML Assertion (signed)
     ▼
┌─────────────────┐
│  NestJS API     │
│  /auth/saml/    │
│  callback       │
└────┬────────────┘
     │
     │ 7. Validate SAML
     ▼
┌─────────────────┐      ┌─────────────────┐
│  PostgreSQL     │◄─────┤  8. Query User  │
│  users table    │      │  & Roles        │
└─────────────────┘      └─────────────────┘
     │
     │ 9. User + Roles
     ▼
┌─────────────────┐
│  Generate JWT   │
│  + Session      │
└────┬────────────┘
     │
     │ 10. Store Session
     ▼
┌─────────────────┐      ┌─────────────────┐
│  Redis          │      │  PostgreSQL     │
│  session:jti    │      │  sessions table │
└─────────────────┘      └─────────────────┘
     │
     │ 11. Log Authentication
     ▼
┌─────────────────┐
│  PostgreSQL     │
│  auth_audit_    │
│  logs           │
└─────────────────┘
     │
     │ 12. Set JWT Cookie (HttpOnly, Secure)
     ▼
┌─────────────────┐
│  User Browser   │
│  (Authenticated)│
└─────────────────┘
```

### API Request with RBAC Flow

```
┌──────────┐
│  User    │
│  Browser │
└────┬─────┘
     │
     │ 1. API Request + JWT Cookie
     ▼
┌─────────────────┐
│  API Gateway    │
│  (ALB)          │
└────┬────────────┘
     │
     │ 2. Route to Backend Pod
     ▼
┌─────────────────┐
│  Auth           │
│  Middleware     │
└────┬────────────┘
     │
     │ 3. Verify JWT Signature
     ▼
┌─────────────────┐
│  Check Redis    │
│  session:jti    │
└────┬────────────┘
     │
     ├─ Session Found ──┐
     │                  │
     └─ Not Found ─────►│ Reject (401)
                        │
                   ┌────▼────┐
                   │ Extract │
                   │ User +  │
                   │ Roles   │
                   └────┬────┘
                        │
                        │ 4. Attach to Request Context
                        ▼
                   ┌─────────────────┐
                   │  RBAC Guard     │
                   │  Check          │
                   │  Permissions    │
                   └────┬────────────┘
                        │
                        │ 5. Check Cache
                        ▼
                   ┌─────────────────┐
                   │  Redis          │
                   │  user:id:perms  │
                   └────┬────────────┘
                        │
     ┌──────────────────┼──────────────────┐
     │                  │                  │
Cache Hit            Cache Miss        
     │                  │                  
     │            ┌─────▼─────┐           
     │            │PostgreSQL │           
     │            │role_perms │           
     │            └─────┬─────┘           
     │                  │                  
     │                  │ Cache Result     
     │                  ▼                  
     │            ┌─────────────────┐     
     │            │  Redis          │     
     │            │  (5 min TTL)    │     
     │            └─────────────────┘     
     │                  │                  
     └──────────────────┴──────────────────┘
                        │
                        │ 6. Has Permission?
                        │
          ┌─────────────┴─────────────┐
          │                           │
      Yes │                       No  │
          │                           │
          ▼                           ▼
   ┌─────────────────┐      ┌─────────────────┐
   │  Controller     │      │  Reject (403)   │
   │  Execute Logic  │      │  Log Attempt    │
   └────┬────────────┘      └─────────────────┘
        │
        │ 7. Business Logic
        ▼
   ┌─────────────────┐
   │  Service Layer  │
   └────┬────────────┘
        │
        │ 8. Database Operations
        ▼
   ┌─────────────────┐
   │  PostgreSQL     │
   │  (Transaction)  │
   └────┬────────────┘
        │
        │ 9. Audit Log
        ▼
   ┌─────────────────┐
   │  Audit Service  │
   │  - Event Log    │
   │  - Data Change  │
   └────┬────────────┘
        │
        │ 10. Store Audit
        ▼
   ┌─────────────────┐
   │  PostgreSQL     │
   │  audit_logs     │
   └────┬────────────┘
        │
        │ 11. Response
        ▼
   ┌─────────────────┐
   │  User Browser   │
   │  (Success 200)  │
   └─────────────────┘
```

## Deployment Architecture

### Production Environment (AWS)

```
┌─────────────────────────────────────────────────────────────┐
│                       AWS Cloud                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   VPC (10.0.0.0/16)                   │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │          Public Subnets (DMZ)                    │ │  │
│  │  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │ │  │
│  │  │  │   NAT    │  │   NAT    │  │   ALB    │      │ │  │
│  │  │  │ Gateway  │  │ Gateway  │  │          │      │ │  │
│  │  │  │ (AZ-1)   │  │ (AZ-2)   │  │ (Multi-  │      │ │  │
│  │  │  │          │  │          │  │  AZ)     │      │ │  │
│  │  │  └────┬─────┘  └────┬─────┘  └────┬─────┘      │ │  │
│  │  └───────┼─────────────┼─────────────┼────────────┘ │  │
│  │          │             │             │               │  │
│  │  ┌───────▼─────────────▼─────────────▼────────────┐ │  │
│  │  │          Private Subnets (App Tier)            │ │  │
│  │  │  ┌────────────────────────────────────────┐    │ │  │
│  │  │  │         EKS Cluster                    │    │ │  │
│  │  │  │  ┌──────────────┐  ┌──────────────┐   │    │ │  │
│  │  │  │  │  Node Group  │  │  Node Group  │   │    │ │  │
│  │  │  │  │   (AZ-1)     │  │   (AZ-2)     │   │    │ │  │
│  │  │  │  │              │  │              │   │    │ │  │
│  │  │  │  │ ┌──────────┐ │  │ ┌──────────┐ │   │    │ │  │
│  │  │  │  │ │Frontend  │ │  │ │Frontend  │ │   │    │ │  │
│  │  │  │  │ │  Pods    │ │  │ │  Pods    │ │   │    │ │  │
│  │  │  │  │ └──────────┘ │  │ └──────────┘ │   │    │ │  │
│  │  │  │  │ ┌──────────┐ │  │ ┌──────────┐ │   │    │ │  │
│  │  │  │  │ │Backend   │ │  │ │Backend   │ │   │    │ │  │
│  │  │  │  │ │  Pods    │ │  │ │  Pods    │ │   │    │ │  │
│  │  │  │  │ └──────────┘ │  │ └──────────┘ │   │    │ │  │
│  │  │  │  └──────────────┘  └──────────────┘   │    │ │  │
│  │  │  └────────────────────────────────────────┘    │ │  │
│  │  │                                                 │ │  │
│  │  │  ┌─────────────────────────────────────────┐  │ │  │
│  │  │  │      ElastiCache Redis Cluster          │  │ │  │
│  │  │  │  ┌──────────┐      ┌──────────┐        │  │ │  │
│  │  │  │  │ Primary  │─────►│ Replica  │        │  │ │  │
│  │  │  │  │ (AZ-1)   │      │ (AZ-2)   │        │  │ │  │
│  │  │  │  └──────────┘      └──────────┘        │  │ │  │
│  │  │  └─────────────────────────────────────────┘  │ │  │
│  │  └──────────────────┬──────────────────────────┘ │  │
│  │                     │                             │  │
│  │  ┌──────────────────▼──────────────────────────┐ │  │
│  │  │      Private Subnets (Data Tier)           │ │  │
│  │  │  ┌─────────────────────────────────────┐   │ │  │
│  │  │  │      RDS PostgreSQL (Multi-AZ)      │   │ │  │
│  │  │  │  ┌──────────┐      ┌──────────┐    │   │ │  │
│  │  │  │  │ Primary  │─────►│ Standby  │    │   │ │  │
│  │  │  │  │ (AZ-1)   │      │ (AZ-2)   │    │   │ │  │
│  │  │  │  └──────────┘      └──────────┘    │   │ │  │
│  │  │  │        │                            │   │ │  │
│  │  │  │        │ Automated Backups          │   │ │  │
│  │  │  │        ▼                            │   │ │  │
│  │  │  │  ┌──────────┐                      │   │ │  │
│  │  │  │  │Read      │                      │   │ │  │
│  │  │  │  │Replica   │                      │   │ │  │
│  │  │  │  └──────────┘                      │   │ │  │
│  │  │  └─────────────────────────────────────┘   │ │  │
│  │  └──────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  ┌───────────────────────────────────────────────┐  │
│  │            Supporting Services                │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │    S3    │  │CloudWatch│  │ Secrets  │   │  │
│  │  │  Bucket  │  │   Logs   │  │ Manager  │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘   │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────┐
│                   Application Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │Frontend  │  │Backend   │  │Workers   │  │Database  │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
└───────┼─────────────┼─────────────┼─────────────┼───────────┘
        │             │             │             │
        │ Logs        │ Logs        │ Logs        │ Logs
        │ Metrics     │ Metrics     │ Metrics     │ Metrics
        │ Traces      │ Traces      │ Traces      │ Traces
        │             │             │             │
        └─────────────┴─────────────┴─────────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │                                     │
        ▼                                     ▼
┌──────────────────┐              ┌──────────────────┐
│   CloudWatch     │              │   LogRocket      │
│   - Logs         │              │   - Session      │
│   - Metrics      │              │     Recording    │
│   - Alarms       │              │   - Error        │
└────────┬─────────┘              │     Tracking     │
         │                        └──────────────────┘
         │
         ▼
┌──────────────────┐
│   CloudWatch     │
│   Dashboards     │
│   - System       │
│   - Application  │
│   - Business     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐              ┌──────────────────┐
│   Alerting       │─────────────►│   PagerDuty /    │
│   - SNS Topics   │              │   Slack /        │
│   - Lambda       │              │   Email          │
└──────────────────┘              └──────────────────┘
```

## Security Layers

```
┌─────────────────────────────────────────────────────────────┐
│                        Layer 7: User                         │
│                     - SSO/SAML Authentication                │
│                     - MFA Enforcement                        │
│                     - Session Management                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Layer 6: Application                      │
│                     - JWT Validation                         │
│                     - RBAC Authorization                     │
│                     - Input Validation                       │
│                     - XSS/CSRF Protection                    │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Layer 5: API Gateway                      │
│                     - Rate Limiting                          │
│                     - WAF Rules                              │
│                     - DDoS Protection                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Layer 4: Network                          │
│                     - VPC Isolation                          │
│                     - Security Groups                        │
│                     - Network ACLs                           │
│                     - TLS 1.3 Encryption                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Layer 3: Infrastructure                   │
│                     - IAM Roles & Policies                   │
│                     - Secrets Manager                        │
│                     - KMS Encryption                         │
│                     - CloudTrail Logging                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Layer 2: Data                             │
│                     - Encryption at Rest (AES-256)           │
│                     - Encrypted Backups                      │
│                     - Data Masking in Logs                   │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Layer 1: Audit & Compliance               │
│                     - Comprehensive Audit Logs               │
│                     - 7-Year Retention                       │
│                     - Compliance Reports                     │
└─────────────────────────────────────────────────────────────┘
```

## CI/CD Pipeline Flow

```
Developer
    │
    │ git push
    ▼
┌─────────────────┐
│  GitHub         │
│  Repository     │
└────┬────────────┘
     │
     │ Webhook
     ▼
┌─────────────────┐
│  GitHub Actions │
│  CI/CD Pipeline │
└────┬────────────┘
     │
     ├─► Unit Tests
     ├─► Integration Tests
     ├─► Linting
     ├─► Type Checking
     ├─► Security Scan (Trivy)
     │
     │ All Checks Pass
     ▼
┌─────────────────┐
│  Build Docker   │
│  Images         │
└────┬────────────┘
     │
     ├─► Backend Image
     ├─► Frontend Image
     │
     │ Push to Registry
     ▼
┌─────────────────┐
│  Container      │
│  Registry (ECR) │
└────┬────────────┘
     │
     ├─────── develop branch ─────► Staging Environment
     │                               - Automated Deploy
     │                               - Smoke Tests
     │
     └─────── main branch ──────────► Production Environment
                                      - Manual Approval
                                      - Blue/Green Deploy
                                      - Health Checks
                                      - Rollback Capability
```
