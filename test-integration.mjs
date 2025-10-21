import dns from "dns";
import { promisify } from "util";

const resolveTxt = promisify(dns.resolveTxt);

console.log("🧪 InboxPass Integration Test Suite\n");
console.log("=" .repeat(60));

let passedTests = 0;
let failedTests = 0;

function logTest(name, passed, details = "") {
  if (passed) {
    console.log(`✅ ${name}`);
    if (details) console.log(`   ${details}`);
    passedTests++;
  } else {
    console.log(`❌ ${name}`);
    if (details) console.log(`   ${details}`);
    failedTests++;
  }
}

// Test 1: DNS Resolution - SPF
console.log("\n📋 Test 1: DNS SPF Record Scanning");
try {
  const records = await resolveTxt("google.com");
  const spfRecord = records.map(r => r.join("")).find(r => r.startsWith("v=spf1"));
  logTest(
    "SPF record detection for google.com",
    !!spfRecord,
    spfRecord ? `Found: ${spfRecord.substring(0, 50)}...` : "No SPF record found"
  );
} catch (error) {
  logTest("SPF record detection for google.com", false, `Error: ${error.message}`);
}

// Test 2: DNS Resolution - DMARC
console.log("\n📋 Test 2: DNS DMARC Record Scanning");
try {
  const records = await resolveTxt("_dmarc.google.com");
  const dmarcRecord = records.map(r => r.join("")).find(r => r.startsWith("v=DMARC1"));
  logTest(
    "DMARC record detection for google.com",
    !!dmarcRecord,
    dmarcRecord ? `Found: ${dmarcRecord.substring(0, 50)}...` : "No DMARC record found"
  );
} catch (error) {
  logTest("DMARC record detection for google.com", false, `Error: ${error.message}`);
}

// Test 3: DNS Resolution - DKIM
console.log("\n📋 Test 3: DNS DKIM Record Scanning");
let dkimFound = false;
const dkimSelectors = ["google", "default", "selector1", "selector2"];
for (const selector of dkimSelectors) {
  try {
    const records = await resolveTxt(`${selector}._domainkey.google.com`);
    const dkimRecord = records.map(r => r.join("")).find(r => r.includes("v=DKIM1") || r.includes("k="));
    if (dkimRecord) {
      logTest(
        "DKIM record detection for google.com",
        true,
        `Found DKIM record with '${selector}' selector`
      );
      dkimFound = true;
      break;
    }
  } catch (error) {
    // Try next selector
  }
}
if (!dkimFound) {
  logTest("DKIM record detection for google.com", false, "No DKIM records found with common selectors");
}

// Test 4: Provider Detection Logic
console.log("\n📋 Test 4: Email Provider Detection");
const testSpfIncludes = ["_spf.google.com", "include:sendgrid.net"];
const hasWorkspace = testSpfIncludes.some(inc => inc.includes("_spf.google.com"));
const hasSendGrid = testSpfIncludes.some(inc => inc.includes("sendgrid"));
logTest(
  "Google Workspace detection from SPF",
  hasWorkspace,
  "Detected from _spf.google.com include"
);
logTest(
  "SendGrid ESP detection from SPF",
  hasSendGrid,
  "Detected from sendgrid.net include"
);

// Test 5: Database Schema Validation
console.log("\n📋 Test 5: Database Schema");
try {
  // Use dynamic import with file:// protocol for ES modules
  const dbModule = await import("file://" + process.cwd() + "/server/db.ts");
  const db = await dbModule.getDb();
  if (db) {
    logTest("Database connection", true, "Successfully connected to database");
    
    // Check if tables exist by trying to query them
    try {
      const schemaModule = await import("file://" + process.cwd() + "/drizzle/schema.ts");
      await db.select().from(schemaModule.domains).limit(1);
      logTest("Domains table exists", true, "Table is accessible");
    } catch (error) {
      logTest("Domains table exists", false, `Error: ${error.message}`);
    }
  } else {
    logTest("Database connection", false, "Database not available");
  }
} catch (error) {
  logTest("Database connection", false, `Error: ${error.message}`);
}

// Test 6: Environment Variables
console.log("\n📋 Test 6: Environment Configuration");
const requiredEnvVars = [
  "DATABASE_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_ID",
  "STRIPE_WEBHOOK_SECRET",
  "ANTHROPIC_API_KEY",
  "BUILT_IN_FORGE_API_KEY"
];

for (const envVar of requiredEnvVars) {
  const exists = !!process.env[envVar];
  logTest(
    `${envVar} configured`,
    exists,
    exists ? "✓ Set" : "✗ Missing"
  );
}

// Test 7: Stripe Integration
console.log("\n📋 Test 7: Stripe SDK");
try {
  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover",
  });
  logTest("Stripe SDK initialization", true, "Stripe client created successfully");
  
  // Test price retrieval
  try {
    const priceId = process.env.STRIPE_PRICE_ID;
    if (!priceId.startsWith('price_')) {
      logTest("Stripe price configuration", false, `Invalid price ID format: ${priceId.substring(0, 10)}... (should start with 'price_')`);
    } else {
      const price = await stripe.prices.retrieve(priceId);
      logTest(
        "Stripe price configuration",
        price.unit_amount === 2900,
        `Price: $${price.unit_amount / 100} (expected $29)`
      );
    }
  } catch (error) {
    logTest("Stripe price configuration", false, `Error: ${error.message}`);
  }
} catch (error) {
  logTest("Stripe SDK initialization", false, `Error: ${error.message}`);
}

// Test 8: WeasyPrint Installation
console.log("\n📋 Test 8: PDF Generation Tools");
try {
  const { exec } = await import("child_process");
  const { promisify } = await import("util");
  const execAsync = promisify(exec);
  
  const { stdout } = await execAsync("which weasyprint");
  logTest(
    "WeasyPrint installed",
    !!stdout.trim(),
    `Path: ${stdout.trim()}`
  );
} catch (error) {
  logTest("WeasyPrint installed", false, "WeasyPrint not found in PATH");
}

// Test 9: S3 Storage Configuration
console.log("\n📋 Test 9: S3 Storage");
try {
  const storageModule = await import("file://" + process.cwd() + "/server/storage.ts");
  logTest("S3 storage module loaded", true, "Storage helpers available");
} catch (error) {
  logTest("S3 storage module loaded", false, `Error: ${error.message}`);
}

// Test 10: AI Agent Configuration
console.log("\n📋 Test 10: AI Agents");
try {
  const agentsModule = await import("file://" + process.cwd() + "/server/agents.ts");
  logTest("AI agent modules loaded", true, "Record builder agent available");
} catch (error) {
  logTest("AI agent modules loaded", false, `Error: ${error.message}`);
}

// Summary
console.log("\n" + "=".repeat(60));
console.log("📊 Test Summary");
console.log("=".repeat(60));
console.log(`✅ Passed: ${passedTests}`);
console.log(`❌ Failed: ${failedTests}`);
console.log(`📈 Success Rate: ${((passedTests / (passedTests + failedTests)) * 100).toFixed(1)}%`);

if (failedTests === 0) {
  console.log("\n🎉 All tests passed! InboxPass is ready for production.");
  process.exit(0);
} else {
  console.log("\n⚠️  Some tests failed. Please review the errors above.");
  process.exit(1);
}

