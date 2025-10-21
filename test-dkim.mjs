import dns from "dns";
import { promisify } from "util";

const resolveTxt = promisify(dns.resolveTxt);

const testDomains = [
  { domain: "github.com", selectors: ["default", "pf2014", "google"] },
  { domain: "twitter.com", selectors: ["default", "google", "s1", "s2"] },
  { domain: "facebook.com", selectors: ["default", "google", "selector1"] },
  { domain: "sendgrid.net", selectors: ["default", "s1", "s2", "smtpapi"] },
];

async function testDKIM() {
  console.log("Testing DKIM records for various domains...\n");
  
  for (const { domain, selectors } of testDomains) {
    console.log(`Testing ${domain}:`);
    for (const selector of selectors) {
      try {
        const records = await resolveTxt(`${selector}._domainkey.${domain}`);
        const dkimRecord = records.map(r => r.join("")).find(r => r.includes("v=DKIM1") || r.includes("k=") || r.includes("p="));
        if (dkimRecord) {
          console.log(`  ✅ Found DKIM at ${selector}._domainkey.${domain}`);
          console.log(`     ${dkimRecord.substring(0, 60)}...`);
          break;
        }
      } catch (error) {
        // Continue to next selector
      }
    }
  }
}

testDKIM();
