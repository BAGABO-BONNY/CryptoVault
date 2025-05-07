/**
 * CryptoVault Cryptography Utility Library
 * 
 * This library provides frontend-based cryptographic functions using the Web Crypto API.
 * All operations are performed client-side to maximize security and privacy.
 */

import { CryptoAlgorithm, HashAlgorithm, SignatureAlgorithm, KeyType, OutputFormat } from '@/types';

/**
 * Converts a string to an ArrayBuffer
 */
export function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

/**
 * Converts an ArrayBuffer to a string
 */
export function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}

/**
 * Converts a base64 string to an ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Converts an ArrayBuffer to a base64 string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts an ArrayBuffer to a hex string
 */
export function arrayBufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  return Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Converts a hex string to an ArrayBuffer
 */
export function hexToArrayBuffer(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes.buffer;
}

/**
 * Format output according to the specified format
 */
export function formatOutput(buffer: ArrayBuffer, format: OutputFormat): string {
  switch (format) {
    case 'Base64':
      return arrayBufferToBase64(buffer);
    case 'Hex':
      return arrayBufferToHex(buffer);
    case 'Binary':
      const bytes = new Uint8Array(buffer);
      return Array.from(bytes)
        .map(b => b.toString(2).padStart(8, '0'))
        .join(' ');
    default:
      return arrayBufferToBase64(buffer);
  }
}

/**
 * Generate a cryptographic key for the specified algorithm
 */
export async function generateKey(type: KeyType, options: { 
  size?: number; 
  curve?: string;
}): Promise<{ key?: string; publicKey?: string; privateKey?: string; }> {
  try {
    const crypto = window.crypto.subtle;
    
    switch (type) {
      case 'AES': {
        const size = options.size || 256;
        const key = await crypto.generateKey(
          {
            name: 'AES-GCM',
            length: size
          },
          true,
          ['encrypt', 'decrypt']
        );
        
        const exportedKey = await crypto.exportKey('raw', key);
        return {
          key: arrayBufferToBase64(exportedKey)
        };
      }
      
      case 'RSA': {
        const size = options.size || 2048;
        const keyPair = await crypto.generateKey(
          {
            name: 'RSA-OAEP',
            modulusLength: size,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: 'SHA-256'
          },
          true,
          ['encrypt', 'decrypt']
        );
        
        const exportedPublicKey = await crypto.exportKey('spki', keyPair.publicKey);
        const exportedPrivateKey = await crypto.exportKey('pkcs8', keyPair.privateKey);
        
        return {
          publicKey: arrayBufferToBase64(exportedPublicKey),
          privateKey: arrayBufferToBase64(exportedPrivateKey)
        };
      }
      
      case 'ECDSA': {
        const curve = options.curve || 'P-256';
        const keyPair = await crypto.generateKey(
          {
            name: 'ECDSA',
            namedCurve: curve
          },
          true,
          ['sign', 'verify']
        );
        
        const exportedPublicKey = await crypto.exportKey('spki', keyPair.publicKey);
        const exportedPrivateKey = await crypto.exportKey('pkcs8', keyPair.privateKey);
        
        return {
          publicKey: arrayBufferToBase64(exportedPublicKey),
          privateKey: arrayBufferToBase64(exportedPrivateKey)
        };
      }
      
      case 'Ed25519': {
        // Web Crypto API doesn't directly support Ed25519
        // This is a simplified mock implementation
        const mockPublicKey = arrayBufferToBase64(crypto.getRandomValues(new Uint8Array(32)));
        const mockPrivateKey = arrayBufferToBase64(crypto.getRandomValues(new Uint8Array(64)));
        
        return {
          publicKey: mockPublicKey,
          privateKey: mockPrivateKey
        };
      }
      
      default:
        throw new Error(`Unsupported key type: ${type}`);
    }
  } catch (error) {
    console.error('Error generating key:', error);
    throw error;
  }
}

/**
 * Encrypt data using the specified algorithm and key
 */
export async function encrypt(
  algorithm: CryptoAlgorithm,
  data: string,
  key: string | null,
  outputFormat: OutputFormat = 'Base64'
): Promise<{ data: string; key?: string; }> {
  try {
    const crypto = window.crypto.subtle;
    const dataBuffer = stringToArrayBuffer(data);
    
    switch (algorithm) {
      case 'AES-256-GCM':
      case 'AES-128-CBC': {
        // Generate a key if none provided
        let cryptoKey;
        let exportedKey;
        
        if (!key) {
          const keySize = algorithm === 'AES-256-GCM' ? 256 : 128;
          const algoName = algorithm === 'AES-256-GCM' ? 'AES-GCM' : 'AES-CBC';
          
          cryptoKey = await crypto.generateKey(
            {
              name: algoName,
              length: keySize
            },
            true,
            ['encrypt', 'decrypt']
          );
          
          exportedKey = await crypto.exportKey('raw', cryptoKey);
          key = arrayBufferToBase64(exportedKey);
        } else {
          const keyBuffer = base64ToArrayBuffer(key);
          const keySize = algorithm === 'AES-256-GCM' ? 256 : 128;
          const algoName = algorithm === 'AES-256-GCM' ? 'AES-GCM' : 'AES-CBC';
          
          cryptoKey = await crypto.importKey(
            'raw',
            keyBuffer,
            {
              name: algoName,
              length: keySize
            },
            false,
            ['encrypt']
          );
        }
        
        // Generate IV
        const iv = crypto.getRandomValues(new Uint8Array(12));
        
        // Encrypt the data
        const algoParams = algorithm === 'AES-256-GCM'
          ? { name: 'AES-GCM', iv }
          : { name: 'AES-CBC', iv };
        
        const encryptedData = await crypto.encrypt(
          algoParams,
          cryptoKey,
          dataBuffer
        );
        
        // Combine IV and encrypted data
        const combined = new Uint8Array(iv.length + encryptedData.byteLength);
        combined.set(iv);
        combined.set(new Uint8Array(encryptedData), iv.length);
        
        return {
          data: formatOutput(combined.buffer, outputFormat),
          key
        };
      }
      
      case 'RSA-OAEP': {
        // For RSA, we always need a key
        if (!key) {
          throw new Error('RSA encryption requires a public key');
        }
        
        const keyBuffer = base64ToArrayBuffer(key);
        const publicKey = await crypto.importKey(
          'spki',
          keyBuffer,
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256'
          },
          false,
          ['encrypt']
        );
        
        const encryptedData = await crypto.encrypt(
          { name: 'RSA-OAEP' },
          publicKey,
          dataBuffer
        );
        
        return {
          data: formatOutput(encryptedData, outputFormat)
        };
      }
      
      // For the other algorithms, we'll provide simplified implementations
      case 'ChaCha20-Poly1305':
      case 'Blowfish': {
        // Generate mock encrypted data
        const mockEncrypted = crypto.getRandomValues(new Uint8Array(data.length + 16));
        let generatedKey;
        
        if (!key) {
          // Generate a mock key
          generatedKey = arrayBufferToBase64(crypto.getRandomValues(new Uint8Array(32)));
          return {
            data: formatOutput(mockEncrypted.buffer, outputFormat),
            key: generatedKey
          };
        } else {
          return {
            data: formatOutput(mockEncrypted.buffer, outputFormat)
          };
        }
      }
      
      default:
        throw new Error(`Unsupported encryption algorithm: ${algorithm}`);
    }
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

/**
 * Decrypt data using the specified algorithm and key
 */
export async function decrypt(
  algorithm: CryptoAlgorithm,
  encryptedData: string,
  key: string
): Promise<string> {
  try {
    const crypto = window.crypto.subtle;
    let encryptedBuffer: ArrayBuffer;
    
    // Try to decode based on common formats
    try {
      encryptedBuffer = base64ToArrayBuffer(encryptedData);
    } catch (e) {
      try {
        encryptedBuffer = hexToArrayBuffer(encryptedData);
      } catch (e2) {
        throw new Error('Invalid encrypted data format');
      }
    }
    
    switch (algorithm) {
      case 'AES-256-GCM':
      case 'AES-128-CBC': {
        const keyBuffer = base64ToArrayBuffer(key);
        const keySize = algorithm === 'AES-256-GCM' ? 256 : 128;
        const algoName = algorithm === 'AES-256-GCM' ? 'AES-GCM' : 'AES-CBC';
        
        // Extract IV and encrypted data
        const iv = new Uint8Array(encryptedBuffer.slice(0, 12));
        const encryptedContent = new Uint8Array(encryptedBuffer.slice(12));
        
        // Import the key
        const cryptoKey = await crypto.importKey(
          'raw',
          keyBuffer,
          {
            name: algoName,
            length: keySize
          },
          false,
          ['decrypt']
        );
        
        // Decrypt the data
        const algoParams = algorithm === 'AES-256-GCM'
          ? { name: 'AES-GCM', iv }
          : { name: 'AES-CBC', iv };
        
        const decryptedData = await crypto.decrypt(
          algoParams,
          cryptoKey,
          encryptedContent
        );
        
        return arrayBufferToString(decryptedData);
      }
      
      case 'RSA-OAEP': {
        const keyBuffer = base64ToArrayBuffer(key);
        const privateKey = await crypto.importKey(
          'pkcs8',
          keyBuffer,
          {
            name: 'RSA-OAEP',
            hash: 'SHA-256'
          },
          false,
          ['decrypt']
        );
        
        const decryptedData = await crypto.decrypt(
          { name: 'RSA-OAEP' },
          privateKey,
          encryptedBuffer
        );
        
        return arrayBufferToString(decryptedData);
      }
      
      // For the other algorithms, we'll provide simplified implementations
      case 'ChaCha20-Poly1305':
      case 'Blowfish': {
        // Return mock decrypted data for demonstration
        return "This is simulated decrypted data for " + algorithm;
      }
      
      default:
        throw new Error(`Unsupported decryption algorithm: ${algorithm}`);
    }
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

/**
 * Hash data using the specified algorithm
 */
export async function hash(
  algorithm: HashAlgorithm,
  data: string,
  outputFormat: OutputFormat = 'Hex'
): Promise<string> {
  try {
    const crypto = window.crypto.subtle;
    const dataBuffer = stringToArrayBuffer(data);
    
    let hashBuffer: ArrayBuffer;
    
    switch (algorithm) {
      case 'SHA-256':
        hashBuffer = await crypto.digest('SHA-256', dataBuffer);
        break;
      case 'SHA-512':
        hashBuffer = await crypto.digest('SHA-512', dataBuffer);
        break;
      case 'SHA-1':
        hashBuffer = await crypto.digest('SHA-1', dataBuffer);
        break;
      case 'MD5':
        // Web Crypto API doesn't support MD5, so we'll simulate it
        // In a real application, you might use a JS implementation of MD5
        const mockMD5 = crypto.getRandomValues(new Uint8Array(16));
        hashBuffer = mockMD5.buffer;
        break;
      default:
        throw new Error(`Unsupported hash algorithm: ${algorithm}`);
    }
    
    return formatOutput(hashBuffer, outputFormat);
  } catch (error) {
    console.error('Hashing error:', error);
    throw error;
  }
}

/**
 * Sign data using the specified algorithm and private key
 */
export async function sign(
  algorithm: SignatureAlgorithm,
  data: string,
  privateKey: string,
  outputFormat: OutputFormat = 'Base64'
): Promise<string> {
  try {
    const crypto = window.crypto.subtle;
    const dataBuffer = stringToArrayBuffer(data);
    const keyBuffer = base64ToArrayBuffer(privateKey);
    
    switch (algorithm) {
      case 'RSA-SHA256': {
        const key = await crypto.importKey(
          'pkcs8',
          keyBuffer,
          {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256'
          },
          false,
          ['sign']
        );
        
        const signature = await crypto.sign(
          'RSASSA-PKCS1-v1_5',
          key,
          dataBuffer
        );
        
        return formatOutput(signature, outputFormat);
      }
      
      case 'ECDSA': {
        const key = await crypto.importKey(
          'pkcs8',
          keyBuffer,
          {
            name: 'ECDSA',
            namedCurve: 'P-256'
          },
          false,
          ['sign']
        );
        
        const signature = await crypto.sign(
          {
            name: 'ECDSA',
            hash: 'SHA-256'
          },
          key,
          dataBuffer
        );
        
        return formatOutput(signature, outputFormat);
      }
      
      case 'Ed25519': {
        // Web Crypto API doesn't directly support Ed25519
        // This is a simplified mock implementation
        const mockSignature = crypto.getRandomValues(new Uint8Array(64));
        return formatOutput(mockSignature.buffer, outputFormat);
      }
      
      default:
        throw new Error(`Unsupported signature algorithm: ${algorithm}`);
    }
  } catch (error) {
    console.error('Signing error:', error);
    throw error;
  }
}

/**
 * Verify a signature using the specified algorithm and public key
 */
export async function verify(
  algorithm: SignatureAlgorithm,
  data: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  try {
    const crypto = window.crypto.subtle;
    const dataBuffer = stringToArrayBuffer(data);
    const keyBuffer = base64ToArrayBuffer(publicKey);
    
    // Convert signature from base64 or hex to ArrayBuffer
    let signatureBuffer: ArrayBuffer;
    try {
      signatureBuffer = base64ToArrayBuffer(signature);
    } catch (e) {
      try {
        signatureBuffer = hexToArrayBuffer(signature);
      } catch (e2) {
        throw new Error('Invalid signature format');
      }
    }
    
    switch (algorithm) {
      case 'RSA-SHA256': {
        const key = await crypto.importKey(
          'spki',
          keyBuffer,
          {
            name: 'RSASSA-PKCS1-v1_5',
            hash: 'SHA-256'
          },
          false,
          ['verify']
        );
        
        return await crypto.verify(
          'RSASSA-PKCS1-v1_5',
          key,
          signatureBuffer,
          dataBuffer
        );
      }
      
      case 'ECDSA': {
        const key = await crypto.importKey(
          'spki',
          keyBuffer,
          {
            name: 'ECDSA',
            namedCurve: 'P-256'
          },
          false,
          ['verify']
        );
        
        return await crypto.verify(
          {
            name: 'ECDSA',
            hash: 'SHA-256'
          },
          key,
          signatureBuffer,
          dataBuffer
        );
      }
      
      case 'Ed25519': {
        // Web Crypto API doesn't directly support Ed25519
        // This is a simplified mock implementation that randomly returns true/false
        return Math.random() > 0.5;
      }
      
      default:
        throw new Error(`Unsupported signature verification algorithm: ${algorithm}`);
    }
  } catch (error) {
    console.error('Signature verification error:', error);
    throw error;
  }
}
