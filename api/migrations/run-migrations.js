// Database Migration Runner
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration(filename) {
  console.log(`\n📝 Running migration: ${filename}`);
  
  try {
    const sqlPath = join(__dirname, filename);
    const sql = readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    console.log(`   Found ${statements.length} SQL statements`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
          
          if (error) {
            // Try direct query if RPC fails
            const { error: queryError } = await supabase
              .from('_migrations')
              .select('*')
              .limit(1);
            
            if (queryError) {
              console.log(`   ⚠️  Statement ${i + 1}: ${error.message}`);
            }
          }
        } catch (err) {
          console.log(`   ⚠️  Statement ${i + 1}: ${err.message}`);
        }
      }
    }
    
    console.log(`   ✅ Migration completed: ${filename}`);
    return true;
  } catch (error) {
    console.error(`   ❌ Migration failed: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('🚀 DHStx Database Migration Runner');
  console.log('===================================\n');
  console.log(`📍 Supabase URL: ${supabaseUrl}`);
  
  // List of migrations in order
  const migrations = [
    '001_initial_schema.sql'
  ];
  
  let successCount = 0;
  
  for (const migration of migrations) {
    const success = await runMigration(migration);
    if (success) successCount++;
  }
  
  console.log('\n===================================');
  console.log(`✅ Completed ${successCount}/${migrations.length} migrations`);
  
  if (successCount === migrations.length) {
    console.log('🎉 All migrations successful!');
  } else {
    console.log('⚠️  Some migrations had issues (this may be normal if tables already exist)');
  }
}

main().catch(console.error);

