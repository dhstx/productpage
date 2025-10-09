# Step 2: Supabase Database Setup

## ✅ What Was Created

### 1. Database Schema (`api/migrations/001_initial_schema.sql`)

Complete PostgreSQL schema with 6 tables:

| Table | Description | Key Features |
|-------|-------------|--------------|
| **users** | User accounts | Email/password + Google OAuth support |
| **subscriptions** | Subscription plans | Stripe integration, plan tracking |
| **agent_usage** | Agent execution logs | Detailed usage tracking, performance metrics |
| **api_keys** | API keys | Programmatic access, revocation support |
| **invoices** | Invoice cache | Stripe invoice data, PDF URLs |
| **usage_stats** | Monthly aggregates | API calls, tokens, agent usage by month |

### 2. Database Utilities (`api/utils/database.js`)

Helper functions for all database operations:
- User CRUD operations
- Subscription management
- Agent usage tracking
- API key management
- Invoice queries

### 3. Migration Scripts

- `run-migrations-pg.js` - Automated migration runner
- `verify-schema.js` - Schema verification tool

## 🚀 How to Set Up the Database

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase SQL Editor:**
   ```
   https://supabase.com/dashboard/project/zhxkbnmtwqipgavmjymi/sql/new
   ```

2. **Copy the SQL migration:**
   - Open: `api/migrations/001_initial_schema.sql`
   - Copy all contents

3. **Execute in SQL Editor:**
   - Paste the SQL
   - Click "Run" or press Cmd/Ctrl + Enter

4. **Verify tables created:**
   ```
   cd /home/ubuntu/productpage
   node api/migrations/verify-schema.js
   ```

### Option 2: Command Line (If you have direct database access)

```bash
# Set database password
export SUPABASE_DB_PASSWORD="your-database-password"

# Run migrations
node api/migrations/run-migrations-pg.js

# Verify
node api/migrations/verify-schema.js
```

## 📋 Database Schema Details

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    google_id VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);
```

**Indexes:**
- `idx_users_email` - Fast email lookups
- `idx_users_google_id` - Google OAuth lookups

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) UNIQUE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan_id VARCHAR(50) NOT NULL, -- 'free', 'starter', 'professional', 'enterprise'
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Features:**
- Automatic free tier creation for new users (trigger)
- Stripe customer and subscription ID tracking
- Subscription status management
- Period tracking for billing

### Agent Usage Table
```sql
CREATE TABLE agent_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    agent_id VARCHAR(100) NOT NULL,
    task_type VARCHAR(100),
    tokens_used INTEGER DEFAULT 0,
    execution_time_ms INTEGER,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    request_data JSONB,
    response_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_agent_usage_user_id` - User lookups
- `idx_agent_usage_agent_id` - Agent-specific queries
- `idx_agent_usage_created_at` - Time-based queries
- `idx_agent_usage_status` - Status filtering

### API Keys Table
```sql
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    last_used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);
```

### Invoices Table
```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stripe_invoice_id VARCHAR(255) UNIQUE NOT NULL,
    amount INTEGER NOT NULL,
    currency VARCHAR(10) DEFAULT 'usd',
    status VARCHAR(50) NOT NULL,
    invoice_pdf_url TEXT,
    invoice_number VARCHAR(100),
    period_start TIMESTAMP WITH TIME ZONE,
    period_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Usage Stats Table
```sql
CREATE TABLE usage_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    api_calls INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    agents_used JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, month)
);
```

## 🔧 Database Helper Functions

### Using the Database Client

```javascript
import db from './api/utils/database.js';

// Create a user
const user = await db.users.create({
  email: 'user@example.com',
  name: 'John Doe',
  password_hash: hashedPassword
});

// Find user by email
const user = await db.users.findByEmail('user@example.com');

// Get user's subscription
const subscription = await db.subscriptions.findByUserId(userId);

// Log agent usage
await db.agent_usage.create({
  user_id: userId,
  agent_id: 'master_coordinator',
  task_type: 'content_generation',
  tokens_used: 1500,
  execution_time_ms: 2340,
  status: 'success',
  request_data: { prompt: '...' },
  response_data: { result: '...' }
});

// Get monthly usage
const usage = await db.agent_usage.getMonthlyUsage(userId);
// Returns: { api_calls, tokens_used, successful, failed }
```

## 🧪 Testing the Database

### 1. Verify Schema
```bash
node api/migrations/verify-schema.js
```

Expected output:
```
✅ users                 - User accounts (0 records)
✅ subscriptions         - Subscription plans (0 records)
✅ agent_usage           - Agent execution logs (0 records)
✅ api_keys              - API keys (0 records)
✅ invoices              - Invoice records (0 records)
✅ usage_stats           - Usage statistics (0 records)
```

### 2. Test Database Connection
```javascript
import { supabase } from './api/utils/database.js';

// Test query
const { data, error } = await supabase
  .from('users')
  .select('count');

console.log('Connection:', error ? 'Failed' : 'Success');
```

## 🔐 Row Level Security (RLS)

For production, you should enable RLS policies:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_stats ENABLE ROW LEVEL SECURITY;

-- Example policy: Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
```

## 📊 Database Monitoring

### Check Table Sizes
```sql
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Row Counts
```sql
SELECT 
  'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'agent_usage', COUNT(*) FROM agent_usage
UNION ALL
SELECT 'api_keys', COUNT(*) FROM api_keys
UNION ALL
SELECT 'invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'usage_stats', COUNT(*) FROM usage_stats;
```

## ✅ Verification Checklist

- [ ] SQL migration executed in Supabase Dashboard
- [ ] All 6 tables created successfully
- [ ] Indexes created
- [ ] Triggers created (updated_at, default subscription)
- [ ] `verify-schema.js` shows all tables exist
- [ ] Database client (`api/utils/database.js`) can connect
- [ ] Test user creation works
- [ ] Default subscription created for new users

## 🚀 Next Steps

Once database is set up:
1. ✅ **Step 2 Complete** - Database schema ready
2. 🔄 **Step 3** - Test Stripe checkout integration
3. 🔄 **Step 4** - Connect Jarvis API
4. 🔄 **Step 5** - Implement authentication

## 📝 Notes

- The database uses UUID for all primary keys
- Timestamps are in UTC with timezone support
- JSONB fields for flexible data storage (request/response data, agent usage)
- Automatic `updated_at` triggers on relevant tables
- Cascade deletes to maintain referential integrity
- Indexes optimized for common query patterns

## 🆘 Troubleshooting

### "Table does not exist" error
- Run the SQL migration in Supabase Dashboard
- Check that you're using the correct project

### "Permission denied" error
- Ensure you're using the correct Supabase key
- Check RLS policies if enabled

### Connection timeout
- Verify SUPABASE_URL and SUPABASE_KEY in .env
- Check Supabase project status in dashboard

## 📚 Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/zhxkbnmtwqipgavmjymi)
- [Supabase SQL Editor](https://supabase.com/dashboard/project/zhxkbnmtwqipgavmjymi/sql/new)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
