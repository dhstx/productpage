import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // InboxPass routers
  scan: router({
    // Scan a domain for email compliance
    scanDomain: publicProcedure
      .input(
        z.object({
          domain: z.string().min(3),
          sampleHeaders: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { nanoid } = await import("nanoid");
        const { scanDomain } = await import("./dnsScanner");
        const { createDomain, getDomainByName, updateDomain } = await import("./db");

        // Check if domain already exists
        let existingDomain = await getDomainByName(input.domain);
        
        // Perform DNS scan
        const scanResult = await scanDomain(input.domain, input.sampleHeaders);

        const domainId = existingDomain?.id || nanoid();
        const domainData = {
          id: domainId,
          domain: input.domain,
          lastScanAt: new Date(),
          hasWorkspace: scanResult.providers.workspace ? "true" : "false",
          hasM365: scanResult.providers.m365 ? "true" : "false",
          espList: JSON.stringify(scanResult.providers.esp),
          spfRecord: scanResult.spf.record,
          spfIncludes: JSON.stringify(scanResult.spf.includes),
          spfTooLong: scanResult.spf.tooLong ? "true" : "false",
          spfHasAllTerm: scanResult.spf.hasAllTerm ? "true" : "false",
          dkimSelectors: JSON.stringify(scanResult.dkim),
          dmarcRecord: scanResult.dmarc.record,
          dmarcPolicy: scanResult.dmarc.policy,
          dmarcRua: scanResult.dmarc.rua,
          dmarcRuf: scanResult.dmarc.ruf,
          dmarcSpfAlignment: scanResult.dmarc.alignment.spf ? "true" : "false",
          dmarcDkimAlignment: scanResult.dmarc.alignment.dkim ? "true" : "false",
          bimiRecord: scanResult.bimi.record,
          bimiHasVMC: scanResult.bimi.hasVMC ? "true" : "false",
          hasListUnsub: scanResult.headers.listUnsub ? "true" : "false",
          hasOneClick: scanResult.headers.oneClick ? "true" : "false",
        };

        if (existingDomain) {
          await updateDomain(domainId, domainData);
        } else {
          await createDomain(domainData);
        }

        // Generate preview summary
        const preview = {
          domainId,
          spf: {
            status: scanResult.spf.found ? "ok" : "missing",
            hasAllTerm: scanResult.spf.hasAllTerm,
            tooLong: scanResult.spf.tooLong,
          },
          dkim: {
            status: scanResult.dkim.length > 0 ? "ok" : "missing",
            count: scanResult.dkim.length,
          },
          dmarc: {
            status: scanResult.dmarc.found ? "ok" : "missing",
            policy: scanResult.dmarc.policy,
            alignment: scanResult.dmarc.alignment,
          },
          headers: {
            listUnsub: scanResult.headers.listUnsub,
            oneClick: scanResult.headers.oneClick,
          },
        };

        return preview;
      }),

    // Get domain details
    getDomain: publicProcedure
      .input(z.object({ domainId: z.string() }))
      .query(async ({ input }) => {
        const { getDomain } = await import("./db");
        return await getDomain(input.domainId);
      }),
  }),

  payment: router({
    // Create Stripe checkout session
    createCheckout: publicProcedure
      .input(
        z.object({
          domainId: z.string(),
          couponCode: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { getDomain } = await import("./db");
        const { createCheckoutSession } = await import("./stripe");

        const domain = await getDomain(input.domainId);
        if (!domain) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Domain not found" });
        }

        const { sessionId, url } = await createCheckoutSession(
          input.domainId,
          domain.domain,
          input.couponCode
        );

        // Update domain with checkout session
        const { updateDomain } = await import("./db");
        await updateDomain(input.domainId, {
          stripeCheckoutSessionId: sessionId,
        });

        return { sessionId, url };
      }),

    // Verify payment and get report
    verifyPayment: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const { getCheckoutSession } = await import("./stripe");
        const session = await getCheckoutSession(input.sessionId);

        if (session.payment_status !== "paid") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Payment not completed" });
        }

        const domainId = session.metadata?.domainId;
        if (!domainId) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid session" });
        }

        const { getDomain } = await import("./db");
        const domain = await getDomain(domainId);

        return {
          domain,
          paid: true,
        };
      }),

    // Generate and download PDF report
    generateReport: publicProcedure
      .input(z.object({ domainId: z.string() }))
      .mutation(async ({ input }) => {
        const { getDomain, updateDomain } = await import("./db");
        const domain = await getDomain(input.domainId);

        if (!domain) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Domain not found" });
        }

        if (domain.status !== "paid") {
          throw new TRPCError({ code: "FORBIDDEN", message: "Payment required" });
        }

        // If PDF already exists, return it
        if (domain.pdfPath) {
          return { pdfUrl: domain.pdfPath };
        }

        // Generate report
        const { buildRecommendedRecords, generateProviderInstructions, generateComplianceReport } = await import("./agents");
        const { generatePDF } = await import("./pdfGenerator");

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

        const recommendations = await buildRecommendedRecords(domain.domain, scanResult);
        const providerInstructions = await generateProviderInstructions(scanResult.providers, scanResult);
        const reportHtml = await generateComplianceReport(
          domain.domain,
          scanResult,
          recommendations,
          providerInstructions
        );

        const pdfUrl = await generatePDF(reportHtml, domain.domain);

        await updateDomain(input.domainId, {
          pdfPath: pdfUrl,
          previewHtml: reportHtml,
        });

        return { pdfUrl };
      }),
  }),
});

export type AppRouter = typeof appRouter;
