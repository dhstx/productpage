import dns from "dns";
import { promisify } from "util";

const resolveTxt = promisify(dns.resolveTxt);

export interface SPFScan {
  found: boolean;
  record: string;
  includes: string[];
  tooLong: boolean;
  hasAllTerm: boolean;
}

export interface DKIMScan {
  selector: string;
  found: boolean;
  keybits?: number;
}

export interface DMARCScan {
  found: boolean;
  record: string;
  policy: string;
  rua?: string;
  ruf?: string;
  alignment: {
    spf: boolean;
    dkim: boolean;
  };
}

export interface BIMIScan {
  found: boolean;
  record?: string;
  hasVMC?: boolean;
}

export interface HeadersScan {
  listUnsub: boolean;
  oneClick: boolean;
}

export interface ProviderDetection {
  workspace?: boolean;
  m365?: boolean;
  esp: string[];
}

export interface DomainScanResult {
  spf: SPFScan;
  dkim: DKIMScan[];
  dmarc: DMARCScan;
  bimi: BIMIScan;
  headers: HeadersScan;
  providers: ProviderDetection;
}

/**
 * Scan SPF record for a domain
 */
export async function scanSPF(domain: string): Promise<SPFScan> {
  try {
    const records = await resolveTxt(domain);
    const spfRecord = records
      .map(r => r.join(""))
      .find(r => r.startsWith("v=spf1"));

    if (!spfRecord) {
      return {
        found: false,
        record: "",
        includes: [],
        tooLong: false,
        hasAllTerm: false,
      };
    }

    // Parse includes
    const includes: string[] = [];
    const includeRegex = /include:([^\s]+)/g;
    let match;
    while ((match = includeRegex.exec(spfRecord)) !== null) {
      includes.push(match[1]);
    }

    // Check for -all or ~all
    const hasAllTerm = /[-~]all/.test(spfRecord);

    // Check if too long (>10 DNS lookups is a common limit)
    const tooLong = includes.length > 10;

    return {
      found: true,
      record: spfRecord,
      includes,
      tooLong,
      hasAllTerm,
    };
  } catch (error) {
    return {
      found: false,
      record: "",
      includes: [],
      tooLong: false,
      hasAllTerm: false,
    };
  }
}

/**
 * Scan DKIM records for common selectors
 */
export async function scanDKIM(domain: string): Promise<DKIMScan[]> {
  const commonSelectors = [
    "default",
    "google",
    "selector1",
    "selector2",
    "k1",
    "s1",
    "s2",
    "dkim",
    "mail",
    "smtp",
  ];

  const results: DKIMScan[] = [];

  for (const selector of commonSelectors) {
    try {
      const dkimDomain = `${selector}._domainkey.${domain}`;
      const records = await resolveTxt(dkimDomain);
      const dkimRecord = records.map(r => r.join("")).join("");

      if (dkimRecord && dkimRecord.includes("v=DKIM1")) {
        // Try to extract key bits
        let keybits: number | undefined;
        const keyMatch = dkimRecord.match(/p=([A-Za-z0-9+/=]+)/);
        if (keyMatch) {
          // Rough estimate: base64 length * 6 / 8
          keybits = Math.floor((keyMatch[1].length * 6) / 8) * 8;
        }

        results.push({
          selector,
          found: true,
          keybits,
        });
      }
    } catch (error) {
      // Selector not found, continue
    }
  }

  return results;
}

/**
 * Scan DMARC record
 */
export async function scanDMARC(domain: string): Promise<DMARCScan> {
  try {
    const dmarcDomain = `_dmarc.${domain}`;
    const records = await resolveTxt(dmarcDomain);
    const dmarcRecord = records.map(r => r.join("")).join("");

    if (!dmarcRecord || !dmarcRecord.startsWith("v=DMARC1")) {
      return {
        found: false,
        record: "",
        policy: "none",
        alignment: { spf: false, dkim: false },
      };
    }

    // Parse policy
    const policyMatch = dmarcRecord.match(/p=([^;]+)/);
    const policy = policyMatch ? policyMatch[1].trim() : "none";

    // Parse RUA
    const ruaMatch = dmarcRecord.match(/rua=([^;]+)/);
    const rua = ruaMatch ? ruaMatch[1].trim() : undefined;

    // Parse RUF
    const rufMatch = dmarcRecord.match(/ruf=([^;]+)/);
    const ruf = rufMatch ? rufMatch[1].trim() : undefined;

    // Parse alignment (aspf and adkim)
    const aspfMatch = dmarcRecord.match(/aspf=([^;]+)/);
    const aspf = aspfMatch ? aspfMatch[1].trim() : "r"; // default relaxed

    const adkimMatch = dmarcRecord.match(/adkim=([^;]+)/);
    const adkim = adkimMatch ? adkimMatch[1].trim() : "r"; // default relaxed

    return {
      found: true,
      record: dmarcRecord,
      policy,
      rua,
      ruf,
      alignment: {
        spf: aspf === "r" || aspf === "s",
        dkim: adkim === "r" || adkim === "s",
      },
    };
  } catch (error) {
    return {
      found: false,
      record: "",
      policy: "none",
      alignment: { spf: false, dkim: false },
    };
  }
}

/**
 * Scan BIMI record
 */
export async function scanBIMI(domain: string): Promise<BIMIScan> {
  try {
    const bimiDomain = `default._bimi.${domain}`;
    const records = await resolveTxt(bimiDomain);
    const bimiRecord = records.map(r => r.join("")).join("");

    if (!bimiRecord || !bimiRecord.startsWith("v=BIMI1")) {
      return { found: false };
    }

    // Check for VMC (Verified Mark Certificate)
    const hasVMC = bimiRecord.includes("a=");

    return {
      found: true,
      record: bimiRecord,
      hasVMC,
    };
  } catch (error) {
    return { found: false };
  }
}

/**
 * Parse email headers for List-Unsubscribe and one-click
 */
export function parseHeaders(headers: string): HeadersScan {
  const listUnsub = headers.includes("List-Unsubscribe:");
  const oneClick = headers.includes("List-Unsubscribe-Post:");

  return { listUnsub, oneClick };
}

/**
 * Detect email providers from SPF includes and DKIM selectors
 */
export function detectProviders(
  spf: SPFScan,
  dkim: DKIMScan[]
): ProviderDetection {
  const providers: ProviderDetection = { esp: [] };

  // Check for Google Workspace
  if (
    spf.includes.some(inc => inc.includes("_spf.google.com")) ||
    dkim.some(d => d.selector === "google" && d.found)
  ) {
    providers.workspace = true;
  }

  // Check for Microsoft 365
  if (
    spf.includes.some(inc => inc.includes("spf.protection.outlook.com")) ||
    dkim.some(
      d => (d.selector === "selector1" || d.selector === "selector2") && d.found
    )
  ) {
    providers.m365 = true;
  }

  // Check for ESPs
  const espPatterns = [
    { name: "SendGrid", pattern: "sendgrid" },
    { name: "Mailgun", pattern: "mailgun" },
    { name: "Postmark", pattern: "postmarkapp" },
    { name: "Mailchimp", pattern: "mailchimp" },
    { name: "Klaviyo", pattern: "klaviyo" },
    { name: "Amazon SES", pattern: "amazonses" },
    { name: "SparkPost", pattern: "sparkpost" },
  ];

  for (const esp of espPatterns) {
    if (spf.includes.some(inc => inc.includes(esp.pattern))) {
      providers.esp.push(esp.name);
    }
  }

  return providers;
}

/**
 * Full domain scan
 */
export async function scanDomain(
  domain: string,
  optionalHeaders?: string
): Promise<DomainScanResult> {
  const [spf, dkim, dmarc, bimi] = await Promise.all([
    scanSPF(domain),
    scanDKIM(domain),
    scanDMARC(domain),
    scanBIMI(domain),
  ]);

  const headers = optionalHeaders
    ? parseHeaders(optionalHeaders)
    : { listUnsub: false, oneClick: false };

  const providers = detectProviders(spf, dkim);

  return {
    spf,
    dkim,
    dmarc,
    bimi,
    headers,
    providers,
  };
}

