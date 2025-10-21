// Test Supabase connection for AI Agent System
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.backend' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔌 Testing Supabase Connection\n');
console.log('='.repeat(60));

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found');
  process.exit(1);
}

console.log(`\n📊 Supabase URL: ${supabaseUrl}`);
console.log(`🔑 API Key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

// Test connection by checking if tables exist
console.log('\n🔍 Checking for agent system tables...\n');

const tablesToCheck = [
  'agent_executions',
  'conversation_sessions',
  'agent_metrics',
  'agent_feedback'
];

let existingTables = [];
let missingTables = [];

for (const table of tablesToCheck) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log(`❌ Table "${table}" does not exist`);
        missingTables.push(table);
      } else {
        console.log(`⚠️  Table "${table}" - Error: ${error.message}`);
        missingTables.push(table);
      }
    } else {
      console.log(`✅ Table "${table}" exists`);
      existingTables.push(table);
    }
  } catch (error) {
    console.log(`❌ Table "${table}" - Exception: ${error.message}`);
    missingTables.push(table);
  }
}

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Summary:`);
console.log(`   ✅ Existing tables: ${existingTables.length}/${tablesToCheck.length}`);
console.log(`   ❌ Missing tables: ${missingTables.length}/${tablesToCheck.length}`);

if (missingTables.length > 0) {
  console.log('\n⚠️  Database schema needs to be set up!');
  console.log('\n📝 Next Steps:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/_/sql');
  console.log('   2. Click "New Query"');
  console.log('   3. Copy and paste the contents of: supabase-agent-schema.sql');
  console.log('   4. Click "Run" to execute the migration');
  console.log('   5. Run this test again to verify');
} else {
  console.log('\n✅ All tables exist! Database is ready for the agent system.');
}

console.log('\n');

