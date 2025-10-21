import { scanDomain } from "./server/dnsScanner";

async function testScan() {
  console.log("Testing DNS scan for google.com...\n");
  
  const result = await scanDomain("google.com");
  
  console.log("SPF:", result.spf.found ? "✓ Found" : "✗ Missing");
  console.log("  Record:", result.spf.record);
  console.log("  Includes:", result.spf.includes.join(", "));
  
  console.log("\nDKIM:", result.dkim.length, "selectors found");
  result.dkim.forEach(d => {
    console.log(`  - ${d.selector}: ${d.found ? "✓" : "✗"}`);
  });
  
  console.log("\nDMARC:", result.dmarc.found ? "✓ Found" : "✗ Missing");
  console.log("  Policy:", result.dmarc.policy);
  console.log("  Record:", result.dmarc.record);
  
  console.log("\nProviders:");
  console.log("  Google Workspace:", result.providers.workspace ? "✓" : "✗");
  console.log("  M365:", result.providers.m365 ? "✓" : "✗");
  console.log("  ESPs:", result.providers.esp.join(", ") || "none");
}

testScan().catch(console.error);
