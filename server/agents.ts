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
        content:
          "You are an email compliance expert. Return clear HTML instructions.",
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
  const prompt = `You are an email compliance report writer. Generate a comprehensive HTML report for domain "${domain}" with the following sections:

1. Executive Overview
   - Current compliance status
   - Key issues found
   - Recommended actions

2. DNS Records to Add
   - SPF: ${recommendations.spf}
   - DMARC: ${recommendations.dmarc}
   - BIMI: ${recommendations.bimi || "Not applicable"}
   - Copy-paste ready format

3. Provider-Specific Steps
${providerInstructions}

4. One-Click Unsubscribe Headers
   - List-Unsubscribe header format
   - List-Unsubscribe-Post header (RFC 8058)
   - Sample code for common ESPs

5. Validation Checklist
   - What to check after DNS propagates
   - Testing tools to use
   - Timeline expectations

6. Appendix: Raw Scan Data
   - SPF: ${JSON.stringify(scan.spf, null, 2)}
   - DKIM: ${JSON.stringify(scan.dkim, null, 2)}
   - DMARC: ${JSON.stringify(scan.dmarc, null, 2)}
   - BIMI: ${JSON.stringify(scan.bimi, null, 2)}

Warnings: ${recommendations.warnings.join(", ") || "none"}

Format as professional HTML with proper headings, code blocks, and styling. Use semantic HTML5 tags.`;

  const response = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a technical writer specializing in email compliance. Return well-formatted HTML.",
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

