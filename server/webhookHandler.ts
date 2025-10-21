import type { Request, Response } from "express";
import { verifyWebhookSignature } from "./stripe";
import { getDomain, updateDomain } from "./db";
import { buildRecommendedRecords, generateProviderInstructions, generateComplianceReport } from "./agents";
import { generatePDF } from "./pdfGenerator";

/**
 * Handle Stripe webhook events
 * This is called by Express middleware for /api/stripe/webhook
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (!signature || typeof signature !== "string") {
    return res.status(400).send("Missing signature");
  }

  try {
    // Verify webhook signature
    const event = verifyWebhookSignature(req.body, signature);

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const domainId = session.metadata?.domainId;

      if (!domainId) {
        console.error("No domainId in session metadata");
        return res.status(400).send("Invalid session");
      }

      // Get domain from database
      const domain = await getDomain(domainId);
      if (!domain) {
        console.error(`Domain not found: ${domainId}`);
        return res.status(404).send("Domain not found");
      }

      // Update domain status to paid
      await updateDomain(domainId, {
        status: "paid",
        stripePaymentIntentId: session.payment_intent,
      });

      // Generate compliance report in background
      // We don't await this to respond to Stripe quickly
      generateComplianceReportAsync(domainId, domain).catch((error) => {
        console.error("Failed to generate compliance report:", error);
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).send(`Webhook Error: ${error}`);
  }
}

/**
 * Generate compliance report asynchronously after payment
 */
async function generateComplianceReportAsync(domainId: string, domain: any) {
  try {
    // Reconstruct scan result from database
    const scanResult = {
      spf: {
        found: !!domain.spfRecord,
        record: domain.spfRecord || "",
        includes: domain.spfIncludes ? JSON.parse(domain.spfIncludes) : [],
        tooLong: domain.spfTooLong === "true",
        hasAllTerm: domain.spfHasAllTerm === "true",
      },
      dkim: domain.dkimSelectors ? JSON.parse(domain.dkimSelectors) : [],
      dmarc: {
        found: !!domain.dmarcRecord,
        record: domain.dmarcRecord || "",
        policy: domain.dmarcPolicy || "none",
        rua: domain.dmarcRua || undefined,
        ruf: domain.dmarcRuf || undefined,
        alignment: {
          spf: domain.dmarcSpfAlignment === "true",
          dkim: domain.dmarcDkimAlignment === "true",
        },
      },
      bimi: {
        found: !!domain.bimiRecord,
        record: domain.bimiRecord || undefined,
        hasVMC: domain.bimiHasVMC === "true",
      },
      headers: {
        listUnsub: domain.hasListUnsub === "true",
        oneClick: domain.hasOneClick === "true",
      },
      providers: {
        workspace: domain.hasWorkspace === "true",
        m365: domain.hasM365 === "true",
        esp: domain.espList ? JSON.parse(domain.espList) : [],
      },
    };

    // Generate recommendations and report
    const recommendations = await buildRecommendedRecords(domain.domain, scanResult);
    const providerInstructions = await generateProviderInstructions(scanResult.providers, scanResult);
    const reportHtml = await generateComplianceReport(
      domain.domain,
      scanResult,
      recommendations,
      providerInstructions
    );

    // Generate PDF and upload to S3
    const pdfUrl = await generatePDF(reportHtml, domain.domain);

    // Update domain with report
    await updateDomain(domainId, {
      pdfPath: pdfUrl,
      previewHtml: reportHtml,
    });

    console.log(`Compliance report generated for ${domain.domain}: ${pdfUrl}`);
  } catch (error) {
    console.error(`Failed to generate report for ${domainId}:`, error);
    // Update domain status to failed
    await updateDomain(domainId, {
      status: "failed",
    });
  }
}

