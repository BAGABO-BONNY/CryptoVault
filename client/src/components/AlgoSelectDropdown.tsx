import React from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { CryptoAlgorithm, HashAlgorithm, SignatureAlgorithm, KeyType } from '@/types';

interface AlgorithmOption {
  value: string;
  label: string;
  description?: string;
}

interface AlgoSelectDropdownProps {
  type: 'crypto' | 'hash' | 'signature' | 'key';
  value: string;
  onChange: (value: string) => void;
  label?: string;
  disabled?: boolean;
}

const AlgoSelectDropdown = ({ 
  type, 
  value, 
  onChange, 
  label = "Select Algorithm",
  disabled = false
}: AlgoSelectDropdownProps) => {
  
  // Define algorithm options based on type
  const algorithmOptions: AlgorithmOption[] = (() => {
    switch (type) {
      case 'crypto':
        return [
          { value: 'AES-256-GCM', label: 'AES-256-GCM', description: 'Advanced Encryption Standard with GCM mode' },
          { value: 'AES-128-CBC', label: 'AES-128-CBC', description: 'AES with 128-bit key in CBC mode' },
          { value: 'RSA-OAEP', label: 'RSA-OAEP', description: 'RSA with OAEP padding' },
          { value: 'ChaCha20-Poly1305', label: 'ChaCha20-Poly1305', description: 'ChaCha20 stream cipher with Poly1305 authenticator' },
          { value: 'Blowfish', label: 'Blowfish', description: 'Blowfish symmetric block cipher' }
        ];
      case 'hash':
        return [
          { value: 'SHA-256', label: 'SHA-256', description: 'Secure Hash Algorithm 2 (256 bit)' },
          { value: 'SHA-512', label: 'SHA-512', description: 'Secure Hash Algorithm 2 (512 bit)' },
          { value: 'SHA-1', label: 'SHA-1', description: 'Secure Hash Algorithm 1 (deprecated)' },
          { value: 'MD5', label: 'MD5', description: 'Message Digest 5 (insecure)' }
        ];
      case 'signature':
        return [
          { value: 'RSA-SHA256', label: 'RSA-SHA256', description: 'RSA signature with SHA-256' },
          { value: 'ECDSA', label: 'ECDSA', description: 'Elliptic Curve Digital Signature Algorithm' },
          { value: 'Ed25519', label: 'Ed25519', description: 'Edwards-curve Digital Signature Algorithm' }
        ];
      case 'key':
        return [
          { value: 'AES', label: 'AES', description: 'Advanced Encryption Standard (symmetric)' },
          { value: 'RSA', label: 'RSA', description: 'Rivest–Shamir–Adleman (asymmetric)' },
          { value: 'ECDSA', label: 'ECDSA', description: 'Elliptic Curve Digital Signature Algorithm' },
          { value: 'Ed25519', label: 'Ed25519', description: 'Edwards-curve Digital Signature Algorithm' }
        ];
      default:
        return [];
    }
  })();

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
          <SelectValue placeholder="Select an algorithm" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Algorithms</SelectLabel>
            {algorithmOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {value && (
        <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {algorithmOptions.find(opt => opt.value === value)?.description}
        </div>
      )}
    </div>
  );
};

export default AlgoSelectDropdown;
