// Verify Database Schema
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyTable(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        return { exists: false, error: 'Table does not exist' };
      }
      return { exists: false, error: error.message };
    }
    
    return { exists: true, count: count || 0 };
  } catch (err) {
    return { exists: false, error: err.message };
  }
}

async function main() {
  console.log('🔍 DHStx Database Schema Verification');
  console.log('=====================================\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`);
  
  const tables = [
    { name: 'users', description: 'User accounts' },
    { name: 'subscriptions', description: 'Subscription plans' },
    { name: 'agent_usage', description: 'Agent execution logs' },
    { name: 'api_keys', description: 'API keys' },
    { name: 'invoices', description: 'Invoice records' },
    { name: 'usage_stats', description: 'Usage statistics' }
  ];
  
  let allExist = true;
  
  for (const table of tables) {
    const result = await verifyTable(table.name);
    
    if (result.exists) {
      console.log(`✅ ${table.name.padEnd(20)} - ${table.description} (${result.count} records)`);
    } else {
      console.log(`❌ ${table.name.padEnd(20)} - ${result.error}`);
      allExist = false;
    }
  }
  
  console.log('\n=====================================');
  
  if (allExist) {
    console.log('✅ All tables exist and are accessible!');
    console.log('\n🎉 Database schema is ready!');
    console.log('\n📝 Next steps:');
    console.log('   - Step 3: Test Stripe checkout');
    console.log('   - Step 4: Connect Jarvis API');
    console.log('   - Step 5: Implement authentication\n');
  } else {
    console.log('⚠️  Some tables are missing');
    console.log('\n📋 To create missing tables:');
    console.log('   1. Go to Supabase Dashboard > SQL Editor');
    console.log('   2. Open: api/migrations/001_initial_schema.sql');
    console.log('   3. Copy and execute the SQL\n');
  }
}

main().catch(console.error);

