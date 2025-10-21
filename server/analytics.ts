import { eq, sql } from "drizzle-orm";
import { domains } from "../drizzle/schema";
import { getDb } from "./db";

interface AnalyticsData {
  userId?: string;
  userEmail?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
}

/**
 * Track a domain scan with analytics data
 */
export async function trackDomainScan(
  domainId: string,
  analyticsData: AnalyticsData
) {
  const db = await getDb();
  if (!db) return;

  try {
    await db
      .update(domains)
      .set({
        userId: analyticsData.userId,
        userEmail: analyticsData.userEmail,
        ipAddress: analyticsData.ipAddress,
        userAgent: analyticsData.userAgent,
        referrer: analyticsData.referrer,
        lastScanAt: new Date(),
      })
      .where(eq(domains.id, domainId));
  } catch (error) {
    console.error("[Analytics] Failed to track scan:", error);
  }
}

/**
 * Track checkout initiation
 */
export async function trackCheckoutInitiated(domainId: string) {
  const db = await getDb();
  if (!db) return;

  try {
    await db
      .update(domains)
      .set({
        checkoutInitiatedAt: new Date(),
      })
      .where(eq(domains.id, domainId));
  } catch (error) {
    console.error("[Analytics] Failed to track checkout:", error);
  }
}

/**
 * Track successful payment
 */
export async function trackPaymentCompleted(domainId: string) {
  const db = await getDb();
  if (!db) return;

  try {
    await db
      .update(domains)
      .set({
        paidAt: new Date(),
        status: "paid",
      })
      .where(eq(domains.id, domainId));
  } catch (error) {
    console.error("[Analytics] Failed to track payment:", error);
  }
}

/**
 * Get analytics dashboard data
 */
export async function getAnalyticsDashboard() {
  const db = await getDb();
  if (!db) return null;

  try {
    // Total scans
    const totalScans = await db
      .select({ count: sql<number>`count(*)` })
      .from(domains);

    // Total paid conversions
    const totalPaid = await db
      .select({ count: sql<number>`count(*)` })
      .from(domains)
      .where(eq(domains.status, "paid"));

    // Checkout initiated but not paid (abandoned)
    const checkoutAbandoned = await db
      .select({ count: sql<number>`count(*)` })
      .from(domains)
      .where(
        sql`${domains.checkoutInitiatedAt} IS NOT NULL AND ${domains.status} != 'paid'`
      );

    // Scanned but never initiated checkout
    const scannedNoCheckout = await db
      .select({ count: sql<number>`count(*)` })
      .from(domains)
      .where(sql`${domains.checkoutInitiatedAt} IS NULL`);

    // Recent scans (last 7 days)
    const recentScans = await db
      .select()
      .from(domains)
      .where(sql`${domains.createdAt} >= DATE_SUB(NOW(), INTERVAL 7 DAY)`)
      .orderBy(sql`${domains.createdAt} DESC`)
      .limit(100);

    // Conversion rate
    const conversionRate =
      totalScans[0].count > 0
        ? ((totalPaid[0].count / totalScans[0].count) * 100).toFixed(2)
        : "0.00";

    // Checkout abandonment rate
    const checkoutRate =
      totalScans[0].count > 0
        ? (
            ((checkoutAbandoned[0].count + totalPaid[0].count) /
              totalScans[0].count) *
            100
          ).toFixed(2)
        : "0.00";

    return {
      totalScans: totalScans[0].count,
      totalPaid: totalPaid[0].count,
      checkoutAbandoned: checkoutAbandoned[0].count,
      scannedNoCheckout: scannedNoCheckout[0].count,
      conversionRate: `${conversionRate}%`,
      checkoutRate: `${checkoutRate}%`,
      recentScans,
    };
  } catch (error) {
    console.error("[Analytics] Failed to get dashboard:", error);
    return null;
  }
}

/**
 * Get top domains by scan count
 */
export async function getTopScannedDomains(limit: number = 20) {
  const db = await getDb();
  if (!db) return [];

  try {
    const result = await db
      .select({
        domain: domains.domain,
        scanCount: domains.scanCount,
        status: domains.status,
        createdAt: domains.createdAt,
        paidAt: domains.paidAt,
      })
      .from(domains)
      .orderBy(sql`CAST(${domains.scanCount} AS UNSIGNED) DESC`)
      .limit(limit);

    return result;
  } catch (error) {
    console.error("[Analytics] Failed to get top domains:", error);
    return [];
  }
}

/**
 * Get conversion funnel data
 */
export async function getConversionFunnel() {
  const db = await getDb();
  if (!db) return null;

  try {
    const scanned = await db
      .select({ count: sql<number>`count(*)` })
      .from(domains);

    const initiatedCheckout = await db
      .select({ count: sql<number>`count(*)` })
      .from(domains)
      .where(sql`${domains.checkoutInitiatedAt} IS NOT NULL`);

    const completed = await db
      .select({ count: sql<number>`count(*)` })
      .from(domains)
      .where(eq(domains.status, "paid"));

    return {
      step1_scanned: scanned[0].count,
      step2_initiated_checkout: initiatedCheckout[0].count,
      step3_completed_payment: completed[0].count,
      dropoff_after_scan: scanned[0].count - initiatedCheckout[0].count,
      dropoff_after_checkout: initiatedCheckout[0].count - completed[0].count,
    };
  } catch (error) {
    console.error("[Analytics] Failed to get funnel:", error);
    return null;
  }
}

