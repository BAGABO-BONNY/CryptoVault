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

// Add these types to the storage interface
declare module "./storage" {
  export interface IStorage {
    getActivityRecords(): Promise<ActivityRecord[]>;
    addActivityRecord(record: InsertActivityRecord): Promise<ActivityRecord>;
    getStats(): Promise<Stats>;
    getAlgorithmUsage(): Promise<AlgorithmUsage[]>;
    clearAll(): Promise<void>;
  }
}

// Extend the MemStorage class implementation
import { MemStorage } from "./storage";

// Add implementation to the prototype
MemStorage.prototype.getActivityRecords = async function(): Promise<ActivityRecord[]> {
  // Mock implementation
  return [
    {
      id: 1,
      operation: 'encrypt',
      algorithm: 'AES-256-GCM',
      input: 'data.zip',
      result: true,
      timestamp: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
    },
    {
      id: 2,
      operation: 'generate-key',
      algorithm: 'RSA-2048',
      input: 'Key Generator',
      result: true,
      timestamp: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
    },
    {
      id: 3,
      operation: 'sign',
      algorithm: 'ECDSA P-256',
      input: 'contract.pdf',
      result: true,
      timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    },
    {
      id: 4,
      operation: 'hash',
      algorithm: 'SHA-256',
      input: 'input.json',
      result: true,
      timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(), // 5 hours ago
    },
    {
      id: 5,
      operation: 'decrypt',
      algorithm: 'RSA-OAEP',
      input: 'confidential.enc',
      result: true,
      timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
    }
  ];
};

MemStorage.prototype.addActivityRecord = async function(record: InsertActivityRecord): Promise<ActivityRecord> {
  const id = Math.floor(Math.random() * 1000) + 6; // Mock ID generation
  const newRecord: ActivityRecord = {
    ...record,
    id,
  };
  return newRecord;
};

MemStorage.prototype.getStats = async function(): Promise<Stats> {
  return {
    totalEncrypted: 248,
    keysGenerated: 42,
    hashOperations: 164,
    digitalSignatures: 52
  };
};

MemStorage.prototype.getAlgorithmUsage = async function(): Promise<AlgorithmUsage[]> {
  return [
    { name: 'AES-256', count: 120, color: '#0284C7' },
    { name: 'RSA', count: 68, color: '#059669' },
    { name: 'ChaCha20', count: 34, color: '#8B5CF6' },
    { name: 'Blowfish', count: 15, color: '#EC4899' },
    { name: 'Other', count: 11, color: '#F59E0B' }
  ];
};

MemStorage.prototype.clearAll = async function(): Promise<void> {
  // In a real app, this would clear all stored data
  return Promise.resolve();
};
