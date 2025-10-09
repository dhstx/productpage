#!/bin/bash

# DHStx Database Setup Script
# This script helps you set up the Supabase database

echo "🚀 DHStx Database Setup"
echo "======================="
echo ""
echo "📋 Step-by-Step Instructions:"
echo ""
echo "1. Open Supabase SQL Editor:"
echo "   https://supabase.com/dashboard/project/zhxkbnmtwqipgavmjymi/sql/new"
echo ""
echo "2. Copy the SQL migration file:"
echo "   File: SUPABASE_MIGRATION.sql"
echo "   (or api/migrations/001_initial_schema.sql)"
echo ""
echo "3. Paste into SQL Editor and click 'Run'"
echo ""
echo "4. Verify the setup:"
echo "   node api/migrations/verify-schema.js"
echo ""
echo "📄 The migration will create 6 tables:"
echo "   ✓ users - User accounts"
echo "   ✓ subscriptions - Subscription plans"
echo "   ✓ agent_usage - Agent execution logs"
echo "   ✓ api_keys - API keys"
echo "   ✓ invoices - Invoice records"
echo "   ✓ usage_stats - Usage statistics"
echo ""
echo "💡 After running the migration, test with:"
echo "   node api/migrations/verify-schema.js"
echo ""
echo "Press Enter to open the SQL migration file..."
read

cat SUPABASE_MIGRATION.sql

echo ""
echo "======================="
echo "✅ Copy the SQL above and paste it into Supabase SQL Editor"
echo ""
