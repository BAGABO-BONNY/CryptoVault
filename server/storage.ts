import { 
  users, 
  type User, 
  type InsertUser, 
  type ActivityRecord, 
  type InsertActivityRecord,
  type Stats,
  type AlgorithmUsage
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

// Create a memory store for sessions
const MemoryStore = createMemoryStore(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Activity methods
  getActivityRecords(): Promise<ActivityRecord[]>;
  getActivityRecordsByUserId(userId: number): Promise<ActivityRecord[]>;
  addActivityRecord(record: InsertActivityRecord): Promise<ActivityRecord>;
  getStats(): Promise<Stats>;
  getAlgorithmUsage(): Promise<AlgorithmUsage[]>;
  clearAll(): Promise<void>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private activities: Map<number, ActivityRecord>;
  private activityCurrentId: number;
  currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.activities = new Map();
    this.currentId = 1;
    this.activityCurrentId = 1;
    
    // Initialize session store
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // Clear expired sessions every 24h
    });
    
    this.initializeData();
  }

  private initializeData() {
    // Add a demo user with hashed password (password = 'password123')
    const demoUser: User = {
      id: this.currentId++,
      username: 'demo',
      email: 'demo@example.com',
      password: '8675b798b259ffcf4e16607a8ce608dfbcc11b8dd60ef608a2104f2fec7bdd4eb5d3b4e9c3c32987d64a28814739f34aa58e4cb74310c0879a179f22d83cb93c.9c2e91e93afc1d9e8f0a927c'
    };
    this.users.set(demoUser.id, demoUser);
    
    // Initialize with some mock activities for demonstration
    const mockActivities: ActivityRecord[] = [
      {
        id: this.activityCurrentId++,
        operation: "encrypt" as const,
        algorithm: 'AES-256-GCM',
        input: 'data.zip',
        result: true,
        timestamp: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
      },
      {
        id: this.activityCurrentId++,
        operation: "generate-key" as const,
        algorithm: 'RSA-2048',
        input: 'Key Generator',
        result: true,
        timestamp: new Date(Date.now() - 60 * 60000).toISOString(), // 1 hour ago
      },
      {
        id: this.activityCurrentId++,
        operation: "sign" as const,
        algorithm: 'ECDSA P-256',
        input: 'contract.pdf',
        result: true,
        timestamp: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
      },
      {
        id: this.activityCurrentId++,
        operation: "hash" as const,
        algorithm: 'SHA-256',
        input: 'input.json',
        result: true,
        timestamp: new Date(Date.now() - 5 * 60 * 60000).toISOString(), // 5 hours ago
      },
      {
        id: this.activityCurrentId++,
        operation: "decrypt" as const,
        algorithm: 'RSA-OAEP',
        input: 'confidential.enc',
        result: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
      }
    ];

    mockActivities.forEach(activity => {
      this.activities.set(activity.id, activity);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getActivityRecords(): Promise<ActivityRecord[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async getActivityRecordsByUserId(userId: number): Promise<ActivityRecord[]> {
    // In a real database, we would filter by userId
    // For this prototype, we'll just return all activities
    return this.getActivityRecords();
  }

  async addActivityRecord(record: InsertActivityRecord): Promise<ActivityRecord> {
    const id = this.activityCurrentId++;
    // Ensure the operation field is properly typed
    const operation = record.operation as "encrypt" | "decrypt" | "hash" | "generate-key" | "sign" | "verify";
    
    // Create a new record with the required fields
    const newRecord: ActivityRecord = {
      id,
      operation,
      algorithm: record.algorithm,
      input: record.input,
      result: record.result,
      timestamp: (typeof record.timestamp === 'string') 
        ? record.timestamp 
        : new Date().toISOString()
    };
    
    this.activities.set(id, newRecord);
    return newRecord;
  }

  async getStats(): Promise<Stats> {
    const activities = Array.from(this.activities.values());
    
    return {
      totalEncrypted: activities.filter(a => a.operation === 'encrypt' && a.result).length,
      keysGenerated: activities.filter(a => a.operation === 'generate-key' && a.result).length,
      hashOperations: activities.filter(a => a.operation === 'hash' && a.result).length,
      digitalSignatures: activities.filter(a => a.operation === 'sign' && a.result).length,
    };
  }

  async getAlgorithmUsage(): Promise<AlgorithmUsage[]> {
    const activities = Array.from(this.activities.values());
    const algoMap = new Map<string, number>();
    
    activities.forEach(activity => {
      const algo = activity.algorithm.split('-')[0]; // Get the main algorithm type
      algoMap.set(algo, (algoMap.get(algo) || 0) + 1);
    });
    
    // Convert to the expected format
    const colors = ['#0284C7', '#059669', '#8B5CF6', '#EC4899', '#F59E0B'];
    let colorIndex = 0;
    
    return Array.from(algoMap.entries())
      .map(([name, count]) => ({
        name,
        count,
        color: colors[colorIndex++ % colors.length]
      }));
  }

  async clearAll(): Promise<void> {
    this.activities.clear();
    this.activityCurrentId = 1;
    return Promise.resolve();
  }
}

export const storage = new MemStorage();
