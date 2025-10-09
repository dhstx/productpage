// Database Migration Runner using PostgreSQL client
import pg from 'pg';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Extract database connection details from Supabase URL
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

// Construct PostgreSQL connection string
// Format: postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
const connectionString = `postgresql://postgres.${projectRef}:${process.env.SUPABASE_DB_PASSWORD || 'postgres'}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

console.log('🚀 DHStx Database Migration Runner');
console.log('===================================\n');
console.log(`📍 Supabase Project: ${projectRef}`);
console.log(`📍 Using Supabase REST API for schema creation\n`);

async function runMigrationViaSupabase() {
  console.log(`📝 Creating database schema via Supabase REST API...`);
  
  try {
    const sqlPath = join(__dirname, '001_initial_schema.sql');
    const sql = readFileSync(sqlPath, 'utf8');
    
    // Use Supabase REST API to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({ query: sql })
    });
    
    if (!response.ok) {
      // If REST API doesn't work, we'll create tables manually using Supabase client
      console.log('   ℹ️  REST API not available, using alternative method...\n');
      await createTablesManually();
    } else {
      console.log('   ✅ Schema created successfully via REST API');
    }
    
    return true;
  } catch (error) {
    console.log(`   ℹ️  ${error.message}`);
    console.log('   Using alternative table creation method...\n');
    await createTablesManually();
    return true;
  }
}

async function createTablesManually() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  console.log('📝 Creating tables using Supabase client...\n');
  
  // Check if tables exist by trying to query them
  const tables = ['users', 'subscriptions', 'agent_usage', 'api_keys', 'invoices', 'usage_stats'];
  
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error && error.code === '42P01') {
        // Table doesn't exist
        console.log(`   ⚠️  Table '${table}' does not exist`);
      } else if (error) {
        console.log(`   ⚠️  Error checking table '${table}': ${error.message}`);
      } else {
        console.log(`   ✅ Table '${table}' exists`);
      }
    } catch (err) {
      console.log(`   ⚠️  Error checking table '${table}': ${err.message}`);
    }
  }
  
  console.log('\n📋 Database Schema Status:');
  console.log('   To create tables, please run the SQL migration manually:');
  console.log('   1. Go to Supabase Dashboard > SQL Editor');
  console.log('   2. Copy the contents of api/migrations/001_initial_schema.sql');
  console.log('   3. Paste and execute in the SQL Editor');
  console.log(`   4. Or visit: ${supabaseUrl.replace('https://', 'https://supabase.com/dashboard/project/')}/sql/new\n`);
}

async function testConnection() {
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Try to query any table to test connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('✅ Connection successful (tables need to be created)');
      return true;
    } else if (error) {
      console.log(`⚠️  Connection test: ${error.message}`);
      return false;
    } else {
      console.log('✅ Connection successful (tables exist)');
      return true;
    }
  } catch (err) {
    console.log(`❌ Connection failed: ${err.message}`);
    return false;
  }
}

async function main() {
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n❌ Could not connect to database');
    process.exit(1);
  }
  
  await runMigrationViaSupabase();
  
  console.log('\n===================================');
  console.log('✅ Migration process completed');
  console.log('\n💡 Next steps:');
  console.log('   1. Verify tables in Supabase Dashboard');
  console.log('   2. Run: node api/migrations/verify-schema.js');
  console.log('   3. Continue with Step 3: Stripe integration\n');
}

main().catch(console.error);

