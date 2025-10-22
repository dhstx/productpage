// Run Supabase migration for AI Agent System
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.backend' });

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

console.log('🚀 DHStx AI Agent System - Database Migration\n');
console.log('='.repeat(60));

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in environment');
  console.error('   Please check .env.backend file');
  process.exit(1);
}

console.log(`\n📊 Supabase URL: ${supabaseUrl}`);
console.log(`🔑 API Key: ${supabaseKey.substring(0, 20)}...`);

const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL file
const sql = readFileSync('./supabase-agent-schema.sql', 'utf-8');

// Split into individual statements
const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`\n📝 Found ${statements.length} SQL statements to execute\n`);

let successCount = 0;
let errorCount = 0;

// Execute each statement
for (let i = 0; i < statements.length; i++) {
  const statement = statements[i] + ';';
  
  // Skip comments and DO blocks (not supported in REST API)
  if (statement.includes('DO $$') || statement.trim().startsWith('--')) {
    console.log(`⏭️  Skipping statement ${i + 1}: ${statement.substring(0, 50)}...`);
    continue;
  }
  
  try {
    console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
    
    const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
    
    if (error) {
      // Try alternative method using from().select() for CREATE TABLE
      if (statement.includes('CREATE TABLE')) {
        console.log(`   ℹ️  CREATE TABLE statements must be run in Supabase SQL Editor`);
        console.log(`   Statement: ${statement.substring(0, 100)}...`);
        errorCount++;
      } else {
        console.error(`   ❌ Error: ${error.message}`);
        errorCount++;
      }
    } else {
      console.log(`   ✅ Success`);
      successCount++;
    }
  } catch (error) {
    console.error(`   ❌ Exception: ${error.message}`);
    errorCount++;
  }
}

console.log('\n' + '='.repeat(60));
console.log(`\n📊 Migration Summary:`);
console.log(`   ✅ Successful: ${successCount}`);
console.log(`   ❌ Failed: ${errorCount}`);
console.log(`   📝 Total: ${statements.length}`);

if (errorCount > 0) {
  console.log('\n⚠️  Some statements failed. This is expected for DDL operations.');
  console.log('   Please run the following in Supabase SQL Editor:');
  console.log('   https://supabase.com/dashboard/project/_/sql');
  console.log('\n   Copy and paste the contents of supabase-agent-schema.sql');
}

console.log('\n✅ Migration script completed!\n');

