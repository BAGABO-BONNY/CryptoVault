import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Key, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import AlgoSelectDropdown from '@/components/AlgoSelectDropdown';
import CodeBlock from '@/components/CodeBlock';
import type { KeyType, CryptoResult } from '@/types';

const KeyGenerator = () => {
  const { toast } = useToast();
  
  // State for key generation options
  const [keyType, setKeyType] = useState<KeyType>('AES');
  const [keySize, setKeySize] = useState(256); // bits
  const [curve, setCurve] = useState('P-256');
  
  // Generated keys
  const [symmetricKey, setSymmetricKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  
  // Key sizes by algorithm
  const keySizeOptions = {
    AES: [128, 192, 256],
    RSA: [1024, 2048, 3072, 4096],
    ECDSA: [],
    Ed25519: []
  };
  
  // Curve options for ECC
  const curveOptions = [
    { value: 'P-256', label: 'NIST P-256' },
    { value: 'P-384', label: 'NIST P-384' },
    { value: 'P-521', label: 'NIST P-521' },
    { value: 'secp256k1', label: 'secp256k1 (Bitcoin/Ethereum)' }
  ];
  
  // Handle key generation
  const keyGenMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/crypto/generate-key', {
        type: keyType,
        size: keySize,
        curve: keyType === 'ECDSA' ? curve : undefined
      });
      return response.json();
    },
    onSuccess: (data: CryptoResult) => {
      if (data.success && data.data) {
        try {
          const keys = JSON.parse(data.data);
          if (keyType === 'AES') {
            setSymmetricKey(keys.key);
            setPublicKey('');
            setPrivateKey('');
          } else {
            setSymmetricKey('');
            setPublicKey(keys.publicKey);
            setPrivateKey(keys.privateKey);
          }
          
          toast({
            title: "Key generated successfully",
            description: `Your ${keyType} key has been generated.`,
            variant: "default",
          });
        } catch (error) {
          toast({
            title: "Failed to parse keys",
            description: "The server returned an invalid response",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Key generation failed",
          description: data.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Key generation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleGenerateKey = () => {
    keyGenMutation.mutate();
  };
  
  const resetForm = () => {
    setSymmetricKey('');
    setPublicKey('');
    setPrivateKey('');
  };
  
  // Determine if the key type uses a key size slider
  const showKeySize = keyType === 'AES' || keyType === 'RSA';
  
  // Determine if the key type uses curves
  const showCurves = keyType === 'ECDSA';
  
  // Determine if the key type is asymmetric (has public/private keys)
  const isAsymmetric = keyType === 'RSA' || keyType === 'ECDSA' || keyType === 'Ed25519';
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Key Generator</h1>
        <div className="mt-3 sm:mt-0">
          <Button variant="outline" size="sm" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left panel - Options */}
            <div className="space-y-6">
              <AlgoSelectDropdown
                type="key"
                value={keyType}
                onChange={(value) => setKeyType(value as KeyType)}
                label="Key Type"
                disabled={keyGenMutation.isPending}
              />
              
              {showKeySize && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="key-size">Key Size: {keySize} bits</Label>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {keyType === 'AES' ? 'Stronger' : 'Weaker'} ←→ {keyType === 'AES' ? 'Faster' : 'Stronger'}
                    </span>
                  </div>
                  
                  <Select 
                    value={keySize.toString()} 
                    onValueChange={(value) => setKeySize(parseInt(value))}
                    disabled={keyGenMutation.isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select key size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {keySizeOptions[keyType].map((size) => (
                          <SelectItem key={size} value={size.toString()}>
                            {size} bits
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {showCurves && (
                <div>
                  <Label htmlFor="curve">Elliptic Curve</Label>
                  <Select 
                    value={curve} 
                    onValueChange={setCurve}
                    disabled={keyGenMutation.isPending}
                  >
                    <SelectTrigger id="curve">
                      <SelectValue placeholder="Select curve" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {curveOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="pt-4">
                <Button 
                  className="w-full gap-2" 
                  onClick={handleGenerateKey}
                  disabled={keyGenMutation.isPending}
                >
                  <Key className="h-5 w-5" />
                  {keyGenMutation.isPending ? 'Generating...' : 'Generate Key'}
                </Button>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Important Security Note</h3>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  Keep your {isAsymmetric ? 'private key' : 'key'} secure and never share it. {isAsymmetric ? 'Only share your public key.' : ''}
                  For production use, consider generating keys in a secure environment.
                </p>
              </div>
            </div>
            
            {/* Right panel - Generated Keys */}
            <div className="space-y-6">
              {isAsymmetric ? (
                <Tabs defaultValue="public" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="public">Public Key</TabsTrigger>
                    <TabsTrigger value="private">Private Key</TabsTrigger>
                  </TabsList>
                  <TabsContent value="public" className="space-y-4 pt-4">
                    <CodeBlock
                      content={publicKey}
                      title="Public Key"
                      showCopy={true}
                      showDownload={true}
                      fileName="public_key.pem"
                      readOnly={true}
                      rows={12}
                    />
                  </TabsContent>
                  <TabsContent value="private" className="space-y-4 pt-4">
                    <CodeBlock
                      content={privateKey}
                      title="Private Key (Keep this secret!)"
                      showCopy={true}
                      showDownload={true}
                      fileName="private_key.pem"
                      readOnly={true}
                      rows={12}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <CodeBlock
                  content={symmetricKey}
                  title={`${keyType}-${keySize} Symmetric Key`}
                  showCopy={true}
                  showDownload={true}
                  fileName="symmetric_key.txt"
                  readOnly={true}
                  rows={4}
                />
              )}
              
              <div className="mt-4 flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=300" 
                  alt="Cryptographic keys visualization" 
                  className="rounded-lg max-h-32" 
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KeyGenerator;
