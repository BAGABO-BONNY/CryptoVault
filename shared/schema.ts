import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base user schema (required by the template)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Activity records for cryptographic operations
export const activityRecords = pgTable("activity_records", {
  id: serial("id").primaryKey(),
  operation: text("operation").notNull(), // encrypt, decrypt, hash, generate-key, sign, verify
  algorithm: text("algorithm").notNull(), // AES-256-GCM, SHA-256, etc.
  input: text("input").notNull(), // what was processed (truncated for privacy/storage)
  result: boolean("result").notNull(), // success or failure
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const activityRecordSchema = z.object({
  id: z.number(),
  operation: z.enum(['encrypt', 'decrypt', 'hash', 'generate-key', 'sign', 'verify']),
  algorithm: z.string(),
  input: z.string(),
  result: z.boolean(),
  timestamp: z.string(),
});

export const insertActivityRecordSchema = createInsertSchema(activityRecords).omit({
  id: true,
});

export type ActivityRecord = z.infer<typeof activityRecordSchema>;
export type InsertActivityRecord = z.infer<typeof insertActivityRecordSchema>;

// Stats schema for dashboard
export const statsSchema = z.object({
  totalEncrypted: z.number(),
  keysGenerated: z.number(),
  hashOperations: z.number(),
  digitalSignatures: z.number(),
});

export type Stats = z.infer<typeof statsSchema>;

// Algorithm usage schema for charts
export const algorithmUsageSchema = z.object({
  name: z.string(),
  count: z.number(),
  color: z.string(),
});

export type AlgorithmUsage = z.infer<typeof algorithmUsageSchema>;

// These interface methods are now properly implemented in the storage.ts file
