import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from 'zod';
import {
  activityRecordSchema,
  algorithmUsageSchema,
  statsSchema,
  insertActivityRecordSchema
} from "@shared/schema";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes and middleware
  const { isAuthenticated } = setupAuth(app);
  // prefix all routes with /api
  
  // Get dashboard stats - protected endpoint
  app.get('/api/stats', isAuthenticated, async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch stats' });
    }
  });

  // Get activity records - protected endpoint
  app.get('/api/activities', isAuthenticated, async (req, res) => {
    try {
      const activities = await storage.getActivityRecords();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch activities' });
    }
  });

  // Get algorithm usage data for charts - protected endpoint
  app.get('/api/algorithm-usage', isAuthenticated, async (req, res) => {
    try {
      const algoUsage = await storage.getAlgorithmUsage();
      res.json(algoUsage);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch algorithm usage data' });
    }
  });

  // Encryption endpoint
  app.post('/api/crypto/encrypt', async (req, res) => {
    try {
      const { algorithm, input, key, outputFormat } = req.body;
      if (!algorithm || !input) {
        return res.status(400).json({ 
          success: false, 
          error: 'Algorithm and input are required' 
        });
      }

      // In a real app, encryption would happen here
      // Instead, we'll create a mock success response
      const mockResult = {
        success: true,
        data: `ENCRYPTED_${Buffer.from(input).toString('base64')}`,
        key: key || `GENERATED_KEY_${Date.now()}`
      };

      // Record activity
      await storage.addActivityRecord({
        operation: 'encrypt',
        algorithm,
        input: input.substring(0, 30) + (input.length > 30 ? '...' : ''),
        result: true,
        timestamp: new Date().toISOString()
      });

      res.json(mockResult);
    } catch (error) {
      console.error('Encryption error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Encryption failed' 
      });
    }
  });

  // Decryption endpoint
  app.post('/api/crypto/decrypt', async (req, res) => {
    try {
      const { algorithm, input, key } = req.body;
      if (!algorithm || !input || !key) {
        return res.status(400).json({ 
          success: false, 
          error: 'Algorithm, input, and key are required' 
        });
      }

      // In a real app, decryption would happen here
      // For mock purposes, check if input starts with ENCRYPTED_
      let result;
      if (input.startsWith('ENCRYPTED_')) {
        const base64 = input.substring(10);
        result = {
          success: true,
          data: Buffer.from(base64, 'base64').toString()
        };
      } else {
        result = {
          success: false,
          error: 'Invalid encrypted format'
        };
      }

      // Record activity
      await storage.addActivityRecord({
        operation: 'decrypt',
        algorithm,
        input: input.substring(0, 30) + (input.length > 30 ? '...' : ''),
        result: result.success,
        timestamp: new Date().toISOString()
      });

      res.json(result);
    } catch (error) {
      console.error('Decryption error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Decryption failed' 
      });
    }
  });

  // Hashing endpoint
  app.post('/api/crypto/hash', async (req, res) => {
    try {
      const { algorithm, input } = req.body;
      if (!algorithm || !input) {
        return res.status(400).json({ 
          success: false, 
          error: 'Algorithm and input are required' 
        });
      }

      // In a real app, hashing would happen here
      // Instead we'll return a mock hash
      const mockHash = `${algorithm}_HASH_${Buffer.from(input).toString('base64').substring(0, 32)}`;
      
      // Record activity
      await storage.addActivityRecord({
        operation: 'hash',
        algorithm,
        input: input.substring(0, 30) + (input.length > 30 ? '...' : ''),
        result: true,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        data: mockHash
      });
    } catch (error) {
      console.error('Hashing error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Hashing failed' 
      });
    }
  });

  // Key generation endpoint
  app.post('/api/crypto/generate-key', async (req, res) => {
    try {
      const { type, size, curve } = req.body;
      if (!type) {
        return res.status(400).json({ 
          success: false, 
          error: 'Key type is required' 
        });
      }

      let result: any = {
        success: true
      };

      // In a real app, key generation would happen server-side
      // Here we'll return mock keys based on the type
      if (type === 'AES') {
        result.data = JSON.stringify({
          key: `MOCK_AES_KEY_${size || 256}_${Date.now()}`
        });
      } else {
        result.data = JSON.stringify({
          publicKey: `MOCK_PUBLIC_KEY_${type}_${Date.now()}`,
          privateKey: `MOCK_PRIVATE_KEY_${type}_${Date.now()}`
        });
      }

      // Record activity
      await storage.addActivityRecord({
        operation: 'generate-key',
        algorithm: `${type}-${size || ''} ${curve || ''}`.trim(),
        input: 'Key generation',
        result: true,
        timestamp: new Date().toISOString()
      });

      res.json(result);
    } catch (error) {
      console.error('Key generation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Key generation failed' 
      });
    }
  });

  // Digital signature creation endpoint
  app.post('/api/crypto/sign', async (req, res) => {
    try {
      const { algorithm, input, privateKey } = req.body;
      if (!algorithm || !input || !privateKey) {
        return res.status(400).json({ 
          success: false, 
          error: 'Algorithm, input, and private key are required' 
        });
      }

      // In a real app, signature would be created server-side
      // Here we'll return a mock signature
      const mockSignature = `MOCK_SIGNATURE_${algorithm}_${Date.now()}`;
      
      // Record activity
      await storage.addActivityRecord({
        operation: 'sign',
        algorithm,
        input: input.substring(0, 30) + (input.length > 30 ? '...' : ''),
        result: true,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        data: mockSignature
      });
    } catch (error) {
      console.error('Signature creation error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Signature creation failed' 
      });
    }
  });

  // Digital signature verification endpoint
  app.post('/api/crypto/verify', async (req, res) => {
    try {
      const { algorithm, input, signature, publicKey } = req.body;
      if (!algorithm || !input || !signature || !publicKey) {
        return res.status(400).json({ 
          success: false, 
          error: 'Algorithm, input, signature, and public key are required' 
        });
      }

      // In a real app, signature verification would happen server-side
      // Here we'll mock verification (assume it's valid if it starts with MOCK_SIGNATURE)
      const isValid = signature.startsWith('MOCK_SIGNATURE');
      
      // Record activity
      await storage.addActivityRecord({
        operation: 'verify',
        algorithm,
        input: input.substring(0, 30) + (input.length > 30 ? '...' : ''),
        result: isValid,
        timestamp: new Date().toISOString()
      });

      res.json({
        success: true,
        data: isValid
      });
    } catch (error) {
      console.error('Signature verification error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Signature verification failed' 
      });
    }
  });

  // Contact form submission
  app.post('/api/contact', (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      if (!name || !email || !message) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name, email, and message are required' 
        });
      }

      // In a real app, you would save the contact form or send an email
      // Here we'll just return success
      res.json({
        success: true,
        message: 'Contact form submitted successfully'
      });
    } catch (error) {
      console.error('Contact form error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to submit contact form' 
      });
    }
  });

  // Clear all data - protected admin endpoint
  app.post('/api/clear-data', isAuthenticated, async (req, res) => {
    try {
      await storage.clearAll();
      res.json({
        success: true,
        message: 'All data cleared successfully'
      });
    } catch (error) {
      console.error('Clear data error:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Failed to clear data' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
