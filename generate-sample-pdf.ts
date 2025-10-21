/**
 * Generate a sample PDF report for product preview
 * Run with: pnpm exec tsx generate-sample-pdf.ts
 */

import { generateComplianceReport } from './server/agents';
import { generatePDF } from './server/pdfGenerator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSampleReport() {
  console.log('Generating sample compliance report...');

  // Sample scan results for example.com
  const sampleResults = {
    domain: 'example.com',
    spf: {
      exists: true,
      record: 'v=spf1 include:_spf.google.com ~all',
      valid: true,
      issues: [],
    },
    dkim: {
      exists: true,
      selector: 'google',
      record: 'v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC...',
      valid: true,
      issues: [],
    },
    dmarc: {
      exists: true,
      record: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com',
      policy: 'quarantine',
      valid: true,
      issues: ['Policy should be set to "reject" for maximum protection'],
    },
    bimi: {
      exists: false,
      record: null,
      valid: false,
      issues: ['BIMI record not found - add brand logo for inbox visibility'],
    },
    provider: 'Google Workspace',
  };

  try {
    // Generate recommendations
    const recommendations = {
      spf: 'v=spf1 include:_spf.google.com ~all',
      dmarc: 'v=DMARC1; p=reject; rua=mailto:dmarc@example.com; ruf=mailto:dmarc@example.com; pct=100',
      bimi: 'v=BIMI1; l=https://example.com/logo.svg; a=https://example.com/certificate.pem',
      warnings: ['Upgrade DMARC policy from quarantine to reject for maximum protection'],
    };

    const providerInstructions = `
      <h3>Google Workspace Setup Instructions</h3>
      <p>Follow these steps to configure your DNS records in Google Workspace:</p>
      <ol>
        <li>Log in to your Google Admin console</li>
        <li>Navigate to Apps → Google Workspace → Gmail → Authenticate email</li>
        <li>Add the SPF, DKIM, and DMARC records shown above</li>
        <li>Wait 24-48 hours for DNS propagation</li>
        <li>Verify your setup using Google's Admin Toolbox</li>
      </ol>
    `;

    // Generate compliance report HTML
    const reportHtml = await generateComplianceReport(
      'example.com',
      sampleResults,
      recommendations,
      providerInstructions
    );

    // Generate PDF
    const pdfBuffer = await generatePDF(reportHtml, 'example.com');

    // Save to public directory
    const publicDir = path.join(__dirname, 'client', 'public');
    const pdfPath = path.join(publicDir, 'sample-compliance-report.pdf');

    fs.writeFileSync(pdfPath, pdfBuffer);

    console.log(`✅ Sample PDF generated: ${pdfPath}`);
    console.log('📄 Access at: /sample-compliance-report.pdf');
  } catch (error) {
    console.error('❌ Error generating sample PDF:', error);
    process.exit(1);
  }
}

generateSampleReport();

