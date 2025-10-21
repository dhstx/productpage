import { storagePut } from "./storage";

/**
 * Generate professional PDF compliance report
 */
export async function generatePDF(
  htmlContent: string,
  domain: string
): Promise<string> {
  const { exec } = await import("child_process");
  const { promisify } = await import("util");
  const { writeFile, unlink } = await import("fs/promises");
  const path = await import("path");
  const os = await import("os");

  const execAsync = promisify(exec);

  // Create temporary files
  const tmpDir = os.tmpdir();
  const htmlPath = path.join(tmpDir, `${domain}-${Date.now()}.html`);
  const pdfPath = path.join(tmpDir, `${domain}-${Date.now()}.pdf`);

  try {
    // Professional PDF styling
    const styledHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page {
      size: A4;
      margin: 2cm 2cm 2.5cm 2cm;
      @bottom-center {
        content: "Page " counter(page) " of " counter(pages);
        font-size: 10px;
        color: #6b7280;
      }
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      font-size: 11pt;
    }
    
    /* Cover Page */
    .cover {
      text-align: center;
      padding: 80px 0;
      page-break-after: always;
    }
    
    .cover h1 {
      font-size: 36pt;
      color: #1e40af;
      margin-bottom: 20px;
      font-weight: 700;
    }
    
    .cover .domain {
      font-size: 24pt;
      color: #3b82f6;
      margin: 30px 0;
      font-weight: 600;
    }
    
    .cover .date {
      font-size: 12pt;
      color: #6b7280;
      margin-top: 40px;
    }
    
    /* Headings */
    h1 {
      font-size: 24pt;
      color: #1e40af;
      margin: 40px 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 3px solid #3b82f6;
      page-break-after: avoid;
      font-weight: 700;
    }
    
    h2 {
      font-size: 18pt;
      color: #1e3a8a;
      margin: 30px 0 15px 0;
      page-break-after: avoid;
      font-weight: 600;
    }
    
    h3 {
      font-size: 14pt;
      color: #1e40af;
      margin: 20px 0 10px 0;
      page-break-after: avoid;
      font-weight: 600;
    }
    
    h4 {
      font-size: 12pt;
      color: #374151;
      margin: 15px 0 8px 0;
      font-weight: 600;
    }
    
    p {
      margin: 10px 0;
      text-align: justify;
    }
    
    /* Score Boxes */
    .score-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin: 25px 0;
      page-break-inside: avoid;
    }
    
    .score-box {
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      page-break-inside: avoid;
    }
    
    .score-box.pass {
      background: #d1fae5;
      border: 2px solid #10b981;
    }
    
    .score-box.fail {
      background: #fee2e2;
      border: 2px solid #ef4444;
    }
    
    .score-box.warning {
      background: #fef3c7;
      border: 2px solid #f59e0b;
    }
    
    .score-box h3 {
      margin: 0 0 10px 0;
      font-size: 14pt;
    }
    
    .score-box .status {
      font-size: 20pt;
      font-weight: 700;
      margin: 10px 0;
    }
    
    .score-box .status.pass { color: #059669; }
    .score-box .status.fail { color: #dc2626; }
    .score-box .status.warning { color: #d97706; }
    
    /* Alert Boxes */
    .alert {
      padding: 15px 20px;
      margin: 20px 0;
      border-radius: 6px;
      border-left: 4px solid;
      page-break-inside: avoid;
    }
    
    .alert.success {
      background: #d1fae5;
      border-color: #10b981;
      color: #065f46;
    }
    
    .alert.warning {
      background: #fef3c7;
      border-color: #f59e0b;
      color: #92400e;
    }
    
    .alert.error {
      background: #fee2e2;
      border-color: #ef4444;
      color: #991b1b;
    }
    
    .alert.info {
      background: #dbeafe;
      border-color: #3b82f6;
      color: #1e40af;
    }
    
    .alert strong {
      display: block;
      margin-bottom: 5px;
      font-size: 12pt;
    }
    
    /* Code Blocks */
    code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', Courier, monospace;
      font-size: 10pt;
      color: #1f2937;
    }
    
    pre {
      background: #1f2937;
      color: #f9fafb;
      border-radius: 6px;
      padding: 20px;
      overflow-x: auto;
      font-family: 'Courier New', Courier, monospace;
      font-size: 9pt;
      line-height: 1.5;
      margin: 15px 0;
      page-break-inside: avoid;
    }
    
    pre code {
      background: transparent;
      color: #f9fafb;
      padding: 0;
    }
    
    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 10pt;
      page-break-inside: avoid;
    }
    
    th, td {
      border: 1px solid #d1d5db;
      padding: 12px;
      text-align: left;
    }
    
    th {
      background: #f3f4f6;
      font-weight: 600;
      color: #1f2937;
    }
    
    tr:nth-child(even) {
      background: #f9fafb;
    }
    
    /* Lists */
    ol, ul {
      margin: 15px 0;
      padding-left: 30px;
    }
    
    li {
      margin: 8px 0;
      line-height: 1.6;
    }
    
    li strong {
      color: #1e40af;
    }
    
    /* Step-by-Step Guide */
    .step {
      margin: 25px 0;
      padding: 20px;
      background: #f9fafb;
      border-left: 4px solid #3b82f6;
      border-radius: 6px;
      page-break-inside: avoid;
    }
    
    .step-number {
      display: inline-block;
      width: 35px;
      height: 35px;
      background: #3b82f6;
      color: white;
      border-radius: 50%;
      text-align: center;
      line-height: 35px;
      font-weight: 700;
      font-size: 14pt;
      margin-right: 15px;
    }
    
    .step h4 {
      display: inline;
      color: #1e40af;
      font-size: 13pt;
    }
    
    .step p {
      margin: 10px 0 10px 50px;
    }
    
    .step pre {
      margin-left: 50px;
    }
    
    /* DNS Record Box */
    .dns-record {
      background: #1f2937;
      color: #10b981;
      padding: 20px;
      border-radius: 6px;
      margin: 15px 0;
      font-family: 'Courier New', Courier, monospace;
      font-size: 9pt;
      page-break-inside: avoid;
    }
    
    .dns-record .label {
      color: #9ca3af;
      font-size: 8pt;
      text-transform: uppercase;
      margin-bottom: 5px;
    }
    
    .dns-record .value {
      color: #f9fafb;
      word-break: break-all;
    }
    
    /* Links */
    a {
      color: #3b82f6;
      text-decoration: none;
      font-weight: 500;
    }
    
    a:hover {
      text-decoration: underline;
    }
    
    /* Checklist */
    .checklist {
      list-style: none;
      padding-left: 0;
    }
    
    .checklist li {
      padding-left: 30px;
      position: relative;
      margin: 12px 0;
    }
    
    .checklist li:before {
      content: "☐";
      position: absolute;
      left: 0;
      font-size: 14pt;
      color: #6b7280;
    }
    
    /* Section Divider */
    hr {
      border: none;
      border-top: 2px solid #e5e7eb;
      margin: 30px 0;
    }
    
    /* Footer */
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 9pt;
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
    }
    
    /* Page Breaks */
    .page-break {
      page-break-after: always;
    }
    
    .no-break {
      page-break-inside: avoid;
    }
  </style>
</head>
<body>
  <!-- Cover Page -->
  <div class="cover">
    <h1>📧 Email Compliance Report</h1>
    <div class="domain">${domain}</div>
    <p style="font-size: 14pt; color: #6b7280; margin: 20px 0;">
      Complete DNS Configuration & Setup Guide
    </p>
    <div class="date">
      Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}
    </div>
    <p style="margin-top: 60px; color: #3b82f6; font-size: 12pt;">
      <strong>InboxPass</strong> | Professional Email Deliverability
    </p>
  </div>
  
  <!-- Main Content -->
  ${htmlContent}
  
  <!-- Footer -->
  <div class="footer">
    <p><strong>InboxPass</strong> - Email Compliance Made Simple</p>
    <p>For support, visit <a href="https://inboxpass.org">inboxpass.org</a></p>
  </div>
</body>
</html>`;

    await writeFile(htmlPath, styledHtml, "utf-8");

    // Generate PDF using WeasyPrint
    await execAsync(`weasyprint "${htmlPath}" "${pdfPath}"`);

    // Read PDF and upload to S3
    const { readFile } = await import("fs/promises");
    const pdfBuffer = await readFile(pdfPath);

    const s3Key = `compliance-reports/${domain}-${Date.now()}.pdf`;
    const { url } = await storagePut(s3Key, pdfBuffer, "application/pdf");

    // Clean up temp files
    await unlink(htmlPath);
    await unlink(pdfPath);

    return url;
  } catch (error) {
    // Clean up on error
    try {
      await unlink(htmlPath);
      await unlink(pdfPath);
    } catch {}

    throw new Error(`PDF generation failed: ${error}`);
  }
}

