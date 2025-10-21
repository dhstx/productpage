import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getAnalyticsDashboard,
  getTopScannedDomains,
  getConversionFunnel,
} from "./analytics";

/**
 * Analytics router for admin dashboard
 * Only accessible to admin users
 */
export const analyticsRouter = router({
  // Get main analytics dashboard
  getDashboard: protectedProcedure.query(async ({ ctx }) => {
    // Check if user is admin
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const dashboard = await getAnalyticsDashboard();
    return dashboard;
  }),

  // Get top scanned domains
  getTopDomains: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const topDomains = await getTopScannedDomains(input.limit);
      return topDomains;
    }),

  // Get conversion funnel
  getFunnel: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Admin access required",
      });
    }

    const funnel = await getConversionFunnel();
    return funnel;
  }),
});

