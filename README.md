# University Web Application

A modular, scalable web application designed for university clients with Board, Staff, and Alumni roles. Built with modern technology stack and following 12-factor app principles.

## 🏗️ Architecture

This application follows a microservices architecture with the following components:

- **Frontend**: Next.js 14 with React 18, Tailwind CSS
- **Backend**: NestJS (Node.js) with TypeScript
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Infrastructure**: Docker, Kubernetes, AWS/GCP
- **CI/CD**: GitHub Actions

### System Architecture Diagram

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

## 🔐 Authentication & Authorization

### SSO/SAML Integration
- Supports Okta, Azure AD, Google Workspace
- JWT fallback for API access
- Multi-Factor Authentication (MFA)
- Session management with Redis

### Role-Based Access Control (RBAC)
Three role hierarchy:
1. **BOARD**: Full system access, all permissions
2. **STAFF**: Administrative access, content and event management
3. **ALUMNI**: Basic member access, view and register for events

See [docs/architecture/AUTHENTICATION.md](docs/architecture/AUTHENTICATION.md) for detailed information.

## 📊 Audit & Logging

Comprehensive logging framework with:
- LogRocket for frontend user experience tracking
- AWS CloudTrail for infrastructure events
- PostgreSQL audit tables for compliance
- Winston logger for application logs

Tracks:
- All CRUD operations
- Permission changes
- Login attempts
- Security events

See [docs/architecture/AUDIT_LOGGING.md](docs/architecture/AUDIT_LOGGING.md) for detailed information.

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhstx/productpage.git
   cd productpage
   ```

2. **Setup environment variables**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your configuration
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Initialize database**
   ```bash
   docker exec -it university-postgres psql -U postgres -d university_app -f /docker-entrypoint-initdb.d/01-schema.sql
   ```

5. **Access the application**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000/api/v1
   - API Documentation: http://localhost:3000/api/docs

### Manual Setup (without Docker)

#### Backend

```bash
cd backend
npm install
cp .env.example .env
# Configure .env file
npm run start:dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
productpage/
├── backend/                 # NestJS backend application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── roles/          # RBAC implementation
│   │   ├── audit/          # Audit logging
│   │   ├── common/         # Shared utilities
│   │   └── main.ts         # Application entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/               # Next.js frontend application
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   └── lib/           # Utilities and helpers
│   ├── Dockerfile
│   └── package.json
├── infrastructure/         # Infrastructure as Code
│   ├── database/          # Database schemas
│   ├── docker/            # Docker configurations
│   ├── kubernetes/        # K8s manifests
│   └── terraform/         # Terraform configs
├── docs/                  # Documentation
│   ├── architecture/      # Architecture docs
│   └── diagrams/          # System diagrams
├── .github/
│   └── workflows/         # CI/CD pipelines
├── docker-compose.yml     # Local development setup
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test              # Unit tests
npm run test:e2e         # End-to-end tests
npm run test:cov         # Coverage report
```

### Frontend Tests
```bash
cd frontend
npm run test
npm run type-check
```

## 🚢 Deployment

### Docker Build

```bash
# Build backend
docker build -t university-app-backend ./backend

# Build frontend
docker build -t university-app-frontend ./frontend
```

### CI/CD Pipeline

The project uses GitHub Actions for automated CI/CD:

1. **On Pull Request**: Runs tests and security scans
2. **On Push to `develop`**: Deploys to staging environment
3. **On Push to `main`**: Deploys to production (requires manual approval)

See [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml) for details.

### Production Deployment

Production deployment uses:
- **AWS ECS/EKS** or **GCP GKE** for container orchestration
- **AWS RDS** or **Cloud SQL** for managed PostgreSQL
- **AWS ElastiCache** or **Memorystore** for managed Redis
- **CloudFront** or **Cloud CDN** for content delivery
- **S3** or **Cloud Storage** for file storage

## 📖 Documentation

Detailed documentation is available in the `docs/` directory:

- [System Architecture](docs/architecture/ARCHITECTURE.md)
- [Authentication & Authorization](docs/architecture/AUTHENTICATION.md)
- [Audit & Logging](docs/architecture/AUDIT_LOGGING.md)

## 🔧 Configuration

### Environment Variables

#### Backend
See [backend/.env.example](backend/.env.example) for all available configuration options.

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `JWT_SECRET`: Secret for JWT signing
- `SAML_ENTRY_POINT`: SAML IdP endpoint
- `AWS_REGION`: AWS region for cloud services

#### Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL

## 🔒 Security

- All passwords are hashed with bcrypt (cost factor: 12)
- JWT tokens use RS256 algorithm
- HTTPS/TLS 1.3 for all communications
- Rate limiting on authentication endpoints
- CORS configured for allowed origins
- Security headers with Helmet.js
- Regular dependency updates with Dependabot
- Automated security scanning with Trivy

## 🏛️ 12-Factor App Compliance

1. ✅ **Codebase**: Single repository with multiple deployables
2. ✅ **Dependencies**: Explicitly declared in package.json
3. ✅ **Config**: Environment variables for all config
4. ✅ **Backing Services**: Database, cache as attached resources
5. ✅ **Build, Release, Run**: Separate stages in CI/CD
6. ✅ **Processes**: Stateless application processes
7. ✅ **Port Binding**: Self-contained services with port binding
8. ✅ **Concurrency**: Horizontal scaling via containers
9. ✅ **Disposability**: Fast startup and graceful shutdown
10. ✅ **Dev/Prod Parity**: Docker ensures environment consistency
11. ✅ **Logs**: Stdout/stderr streams to log aggregation
12. ✅ **Admin Processes**: Separate migration and maintenance scripts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Support

For issues and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🙏 Acknowledgments

- Built with [NestJS](https://nestjs.com/)
- Frontend with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
