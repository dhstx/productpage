import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// InboxPass domain and test tables
export const domains = mysqlTable("domains", {
  id: varchar("id", { length: 64 }).primaryKey(),
  domain: varchar("domain", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastScanAt: timestamp("lastScanAt"),
  
  // Provider detection
  hasWorkspace: varchar("hasWorkspace", { length: 10 }),
  hasM365: varchar("hasM365", { length: 10 }),
  espList: text("espList"), // JSON array of ESP names
  
  // Scan results (JSON)
  spfRecord: text("spfRecord"),
  spfIncludes: text("spfIncludes"),
  spfTooLong: varchar("spfTooLong", { length: 10 }),
  spfHasAllTerm: varchar("spfHasAllTerm", { length: 10 }),
  
  dkimSelectors: text("dkimSelectors"), // JSON array
  
  dmarcRecord: text("dmarcRecord"),
  dmarcPolicy: varchar("dmarcPolicy", { length: 50 }),
  dmarcRua: text("dmarcRua"),
  dmarcRuf: text("dmarcRuf"),
  dmarcSpfAlignment: varchar("dmarcSpfAlignment", { length: 10 }),
  dmarcDkimAlignment: varchar("dmarcDkimAlignment", { length: 10 }),
  
  bimiRecord: text("bimiRecord"),
  bimiHasVMC: varchar("bimiHasVMC", { length: 10 }),
  
  // Headers from test email
  hasListUnsub: varchar("hasListUnsub", { length: 10 }),
  hasOneClick: varchar("hasOneClick", { length: 10 }),
  gmailSpamRate: varchar("gmailSpamRate", { length: 20 }),
  
  // Payment & report
  status: mysqlEnum("status", ["draft", "paid", "failed"]).default("draft").notNull(),
  stripeCheckoutSessionId: varchar("stripeCheckoutSessionId", { length: 255 }),
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  previewHtml: text("previewHtml"),
  pdfPath: varchar("pdfPath", { length: 500 }),
});

export const tests = mysqlTable("tests", {
  id: varchar("id", { length: 64 }).primaryKey(),
  domainId: varchar("domainId", { length: 64 }).notNull(),
  testType: mysqlEnum("testType", ["dns", "headers"]).notNull(),
  sampleHeaders: text("sampleHeaders"),
  result: text("result"), // JSON
  createdAt: timestamp("createdAt").defaultNow(),
});

export type Domain = typeof domains.$inferSelect;
export type InsertDomain = typeof domains.$inferInsert;
export type Test = typeof tests.$inferSelect;
export type InsertTest = typeof tests.$inferInsert;
