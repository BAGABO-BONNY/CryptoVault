export type CryptoOperation = 
  | 'encrypt'
  | 'decrypt'
  | 'hash'
  | 'generate-key'
  | 'sign'
  | 'verify';

export type CryptoAlgorithm = 
  | 'AES-256-GCM'
  | 'AES-128-CBC'
  | 'RSA-OAEP'
  | 'ChaCha20-Poly1305'
  | 'Blowfish';

export type HashAlgorithm = 
  | 'SHA-256'
  | 'SHA-512'
  | 'SHA-1'
  | 'MD5';

export type SignatureAlgorithm = 
  | 'RSA-SHA256'
  | 'ECDSA'
  | 'Ed25519';

export type KeyType = 
  | 'AES'
  | 'RSA'
  | 'ECDSA'
  | 'Ed25519';

export type OutputFormat = 
  | 'Base64'
  | 'Hex'
  | 'Binary';

export interface CryptoResult {
  success: boolean;
  data?: string;
  error?: string;
}

export interface ActivityRecord {
  id: number;
  operation: CryptoOperation;
  algorithm: string;
  input: string;
  result: boolean;
  timestamp: string;
}

export interface StatCard {
  title: string;
  value: number;
  change: {
    value: number;
    trend: 'up' | 'down';
  };
  icon: string;
}

export interface AlgorithmUsage {
  name: string;
  count: number;
  color: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'fr' | 'es' | 'de' | 'zh';
  defaultAlgorithm: CryptoAlgorithm;
  clearDataOnExit: boolean;
  defaultOutputFormat: OutputFormat;
}
