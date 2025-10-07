# Quick Start Guide

This guide will help you get the University Web Application running locally in under 10 minutes.

## Prerequisites

Ensure you have the following installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Git](https://git-scm.com/downloads)

**OR**

- [Node.js 20+](https://nodejs.org/)
- [PostgreSQL 15+](https://www.postgresql.org/download/)
- [Redis 7+](https://redis.io/download/)

## Option 1: Using Docker (Recommended)

### Step 1: Clone the Repository

```bash
git clone https://github.com/dhstx/productpage.git
cd productpage
```

### Step 2: Start Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Redis cache on port 6379
- Backend API on port 3000
- Frontend app on port 3001

### Step 3: Wait for Services to Start

Check the status of services:

```bash
docker-compose ps
```

All services should show "Up" status. Wait ~30 seconds for the database to initialize.

### Step 4: Initialize Database

The database schema is automatically loaded on first start. To verify:

```bash
docker exec -it university-postgres psql -U postgres -d university_app -c "SELECT name FROM roles;"
```

You should see:
```
   name
---------
 BOARD
 STAFF
 ALUMNI
```

### Step 5: Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api/v1
- **API Documentation**: http://localhost:3000/api/docs

### Step 6: View Logs

To view logs from all services:

```bash
docker-compose logs -f
```

To view logs from a specific service:

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Step 7: Stop Services

```bash
docker-compose down
```

To stop and remove all data:

```bash
docker-compose down -v
```

## Option 2: Manual Setup (Without Docker)

### Step 1: Clone Repository

```bash
git clone https://github.com/dhstx/productpage.git
cd productpage
```

### Step 2: Setup PostgreSQL

Create database:

```bash
psql -U postgres
```

```sql
CREATE DATABASE university_app;
\q
```

Import schema:

```bash
psql -U postgres -d university_app -f infrastructure/database/schema.sql
```

### Step 3: Setup Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` file with your database credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=university_app
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-secret-key
```

Start backend:

```bash
npm run start:dev
```

Backend will be available at http://localhost:3000

### Step 4: Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

Start frontend:

```bash
npm run dev
```

Frontend will be available at http://localhost:3001

## Next Steps

### 1. Configure Authentication

To enable SSO/SAML authentication, update the backend `.env` file:

```env
# Okta Configuration
OKTA_DOMAIN=your-domain.okta.com
OKTA_CLIENT_ID=your_client_id
OKTA_CLIENT_SECRET=your_client_secret

# OR Azure AD Configuration
AZURE_AD_TENANT_ID=your_tenant_id
AZURE_AD_CLIENT_ID=your_client_id
AZURE_AD_CLIENT_SECRET=your_client_secret
```

### 2. Create Test Users

Connect to the database and create a test user:

```sql
-- Create a test user
INSERT INTO users (email, first_name, last_name, email_verified, status)
VALUES ('admin@university.edu', 'Admin', 'User', true, 'active')
RETURNING id;

-- Assign BOARD role (use the returned id from above)
INSERT INTO user_roles (user_id, role_id)
SELECT 'USER_ID_HERE', id FROM roles WHERE name = 'BOARD';
```

### 3. Generate JWT Keys (Production)

For production, generate RSA key pairs for JWT signing:

```bash
# Generate private key
openssl genrsa -out private.key 2048

# Generate public key
openssl rsa -in private.key -pubout -out public.key

# Convert to single line for .env
cat private.key | base64
cat public.key | base64
```

Add to `.env`:

```env
JWT_PRIVATE_KEY="base64_encoded_private_key"
JWT_PUBLIC_KEY="base64_encoded_public_key"
JWT_ALGORITHM=RS256
```

### 4. Explore the API

Visit the Swagger documentation:
http://localhost:3000/api/docs

Try the health check endpoint:

```bash
curl http://localhost:3000/api/v1/health
```

### 5. Run Tests

Backend tests:

```bash
cd backend
npm test
```

Frontend tests:

```bash
cd frontend
npm test
```

## Common Issues

### Issue: Docker containers won't start

**Solution**: Make sure ports 3000, 3001, 5432, and 6379 are not in use:

```bash
# Check if ports are in use
lsof -i :3000
lsof -i :3001
lsof -i :5432
lsof -i :6379
```

Kill any processes using these ports or change the port mappings in `docker-compose.yml`.

### Issue: Database connection failed

**Solution**: Ensure PostgreSQL is running and credentials in `.env` are correct:

```bash
# Test connection
psql -h localhost -U postgres -d university_app
```

### Issue: Frontend can't connect to backend

**Solution**: Check that CORS is configured correctly. The backend `.env` should have:

```env
CORS_ORIGIN=http://localhost:3001
```

And frontend `.env.local` should have:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Issue: Redis connection failed

**Solution**: Ensure Redis is running:

```bash
# Test Redis connection
redis-cli ping
# Should return: PONG
```

## Development Tips

### Hot Reload

Both backend and frontend support hot reload in development mode. Changes to code will automatically restart the service.

### Database Migrations

When you change the database schema:

```bash
cd backend
npm run migration:generate -- -n MigrationName
npm run migration:run
```

### Environment Variables

Never commit `.env` files. Always use `.env.example` as a template.

### Debugging

Backend debugging with VSCode:

1. Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "attach",
  "name": "Attach to Backend",
  "port": 9229,
  "restart": true,
  "skipFiles": ["<node_internals>/**"]
}
```

2. Start backend in debug mode:

```bash
npm run start:debug
```

3. Press F5 in VSCode to attach debugger

## Learn More

- [Architecture Documentation](docs/architecture/ARCHITECTURE.md)
- [Authentication Guide](docs/architecture/AUTHENTICATION.md)
- [Audit Logging](docs/architecture/AUDIT_LOGGING.md)
- [System Diagrams](docs/diagrams/SYSTEM_DIAGRAMS.md)

## Getting Help

If you encounter issues:

1. Check the [Common Issues](#common-issues) section above
2. Review the logs: `docker-compose logs`
3. Search existing [GitHub Issues](https://github.com/dhstx/productpage/issues)
4. Create a new issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Environment details (OS, Docker version, etc.)
