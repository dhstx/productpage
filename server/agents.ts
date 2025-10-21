import { invokeLLM } from "./_core/llm";
import type { DomainScanResult, ProviderDetection } from "./dnsScanner";

/**
 * RecordBuilder Agent
 * Proposes safe-by-default SPF and DMARC records
 */
export async function buildRecommendedRecords(
  domain: string,
  scan: DomainScanResult
): Promise<{
  spf: string;
  dmarc: string;
  bimi?: string;
  warnings: string[];
}> {
  const prompt = `You are an email deliverability expert. Based on the following DNS scan results for domain "${domain}", generate recommended SPF and DMARC records.

Current scan:
- SPF found: ${scan.spf.found}
- SPF record: ${scan.spf.record || "none"}
- SPF includes: ${scan.spf.includes.join(", ") || "none"}
- DMARC found: ${scan.dmarc.found}
- DMARC policy: ${scan.dmarc.policy}
- Detected providers: ${JSON.stringify(scan.providers)}

Requirements:
1. SPF: Start with "v=spf1", include all detected providers, end with "-all"
2. Deduplicate includes
3. Warn if >10 DNS lookups
4. DMARC: Start at "p=none; rua=mailto:dmarc@${domain}; fo=1; pct=100; adkim=r; aspf=r"
5. If BIMI is possible, provide outline steps

Return ONLY a JSON object with this structure:
{
  "spf": "v=spf1 include:... -all",
  "dmarc": "v=DMARC1; p=none; rua=...",
  "bimi": "optional steps or empty string",
  "warnings": ["array of warning strings"]
}`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are an email compliance expert. Return only valid JSON, no markdown.",
      },
      { role: "user", content: prompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "record_recommendations",
        strict: true,
        schema: {
          type: "object",
          properties: {
            spf: { type: "string" },
            dmarc: { type: "string" },
            bimi: { type: "string" },
            warnings: { type: "array", items: { type: "string" } },
          },
          required: ["spf", "dmarc", "bimi", "warnings"],
          additionalProperties: false,
        },
      },
    },
  });

  const content = response.choices[0].message.content;
  if (typeof content !== 'string') {
    throw new Error('Expected string content from LLM');
  }
  return JSON.parse(content);
}

/**
 * ProviderWizard Agent
 * Generates step-by-step instructions for each detected provider
 */
export async function generateProviderInstructions(
  providers: ProviderDetection,
  scan: DomainScanResult
): Promise<string> {
  const prompt = `You are an email deliverability consultant. Generate clear, step-by-step instructions for configuring email authentication for the following detected providers:

Providers: ${JSON.stringify(providers)}
Current DKIM selectors found: ${scan.dkim.map(d => d.selector).join(", ") || "none"}

For each provider, include:
1. How to enable DKIM (selector creation, DNS records)
2. How to configure SPF
3. How to enable one-click unsubscribe (if applicable)
4. Any platform-specific settings

Format as clear HTML sections with <h3> for each provider and <ol> for steps.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content: "You are an email deliverability expert. Return well-formatted HTML.",
      },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0].message.content;
  if (typeof content !== 'string') {
    throw new Error('Expected string content from LLM');
  }
  return content;
}

/**
 * ComplianceWriter Agent
 * Generates full PDF report content in HTML
 */
export async function generateComplianceReport(
  domain: string,
  scan: DomainScanResult,
  recommendations: {
    spf: string;
    dmarc: string;
    bimi?: string;
    warnings: string[];
  },
  providerInstructions: string
): Promise<string> {
  
  const scanData = {
    spf: scan.spf,
    dkim: scan.dkim,
    dmarc: scan.dmarc,
    bimi: scan.bimi
  };
  
  const prompt = `You are a professional email compliance report writer. Generate a comprehensive, beautifully formatted HTML report for domain "${domain}".

CRITICAL FORMATTING REQUIREMENTS:
- Use the provided CSS classes: score-grid, score-box (with pass/fail/warning), alert (with success/warning/error/info), step, step-number, dns-record, checklist
- NO multi-column layouts - use full-width text only
- Use pre and code tags for all DNS records and code snippets
- Use dns-record div for DNS records with label and value spans
- Use step divs with step-number spans for numbered instructions
- Use checklist class for validation checklists
- Include specific URLs and tool names (not placeholders)

REQUIRED SECTIONS:

1. Executive Summary
Create a 2x2 score-grid with score-box divs showing:
- SPF Status: ${scan.spf.found ? 'PASS' : 'FAIL'}
- DKIM Status: ${scan.dkim.length > 0 ? 'PASS' : 'FAIL'}
- DMARC Status: ${scan.dmarc.found ? 'PASS' : 'FAIL'}
- BIMI Status: ${scan.bimi.found ? 'PASS' : 'NOT CONFIGURED'}

Add 2-3 paragraph overview of findings and urgency.

2. DNS Records to Implement
For each record (SPF, DMARC, DKIM if missing), create a dns-record box with label and value divs.

SPF Record: ${recommendations.spf}
DMARC Record: ${recommendations.dmarc}
BIMI: ${recommendations.bimi || "Not applicable - requires DMARC p=quarantine or p=reject"}

3. Step-by-Step Setup Guide
Create numbered step divs for:
1. Access your DNS provider (Cloudflare, GoDaddy, Namecheap, etc.)
2. Add SPF record
3. Add DMARC record  
4. Configure DKIM with your email provider
5. Add one-click unsubscribe headers
6. Test and validate

Include specific URLs:
- DNS checker: https://mxtoolbox.com/SuperTool.aspx
- DMARC validator: https://dmarcian.com/dmarc-inspector/
- SPF checker: https://www.kitterman.com/spf/validate.html

4. Provider-Specific Instructions
${providerInstructions}

Add specific links:
- Google Workspace: https://admin.google.com/ac/apps/gmail/authenticateemail
- Microsoft 365: https://admin.microsoft.com/Adminportal/Home#/Domains
- SendGrid: https://app.sendgrid.com/settings/sender_auth
- Mailgun: https://app.mailgun.com/app/sending/domains

5. One-Click Unsubscribe Implementation
Provide exact header format in code blocks.
Include code samples for Node.js, Python, PHP, and WordPress.

6. Validation Checklist
Use checklist class with items like:
- DNS records added and saved
- Waited 24-48 hours for propagation
- Tested with MXToolbox
- Verified DMARC reports arriving

7. Timeline and Next Steps
Use alert info box with:
- DNS propagation: 15 minutes to 48 hours
- DMARC reporting: 24-48 hours for first reports
- Full compliance: 7-14 days

8. Troubleshooting Common Issues
Create alert warning boxes for common problems

9. Appendix: Raw Scan Data
Technical details:
${JSON.stringify(scanData, null, 2)}

Warnings: ${recommendations.warnings.join(", ") || "none"}

OUTPUT REQUIREMENTS:
- Return ONLY the HTML content (no DOCTYPE, html, head, or body tags)
- Use semantic HTML5 tags (section, article, h1, h2, h3)
- All code blocks must use pre and code tags
- All DNS records must use dns-record divs
- All steps must use step divs with step-number
- Include real, working URLs (no placeholders)
- Make it actionable and professional`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a technical writer specializing in email compliance. Return well-formatted HTML using the specified CSS classes.",
      },
      { role: "user", content: prompt },
    ],
  });

  const content = response.choices[0].message.content;
  if (typeof content !== 'string') {
    throw new Error('Expected string content from LLM');
  }
  return content;
}

