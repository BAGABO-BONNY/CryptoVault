import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Unlock, Upload, Copy, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AlgoSelectDropdown from '@/components/AlgoSelectDropdown';
import FileUploader from '@/components/FileUploader';
import CodeBlock from '@/components/CodeBlock';
import type { CryptoAlgorithm, CryptoResult } from '@/types';

const Decryption = () => {
  const { toast } = useToast();
  
  // State for decryption options
  const [algorithm, setAlgorithm] = useState<CryptoAlgorithm>('AES-256-GCM');
  const [key, setKey] = useState('');
  
  // Input and output
  const [inputText, setInputText] = useState('');
  const [decryptedOutput, setDecryptedOutput] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  // Handle decryption logic
  const decryptMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/crypto/decrypt', {
        algorithm,
        input: inputText,
        key
      });
      return response.json();
    },
    onSuccess: (data: CryptoResult) => {
      if (data.success) {
        setDecryptedOutput(data.data || '');
        toast({
          title: "Decrypted successfully",
          description: "Your data has been decrypted.",
          variant: "default",
        });
      } else {
        toast({
          title: "Decryption failed",
          description: data.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Decryption failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleDecrypt = () => {
    if (!inputText) {
      toast({
        title: "Input required",
        description: "Please enter encrypted text to decrypt",
        variant: "destructive",
      });
      return;
    }
    
    if (!key) {
      toast({
        title: "Key required",
        description: "Please enter the decryption key",
        variant: "destructive",
      });
      return;
    }
    
    decryptMutation.mutate();
  };
  
  const handleFileSelect = (file: File, content: string) => {
    setFile(file);
    setInputText(content);
  };
  
  const resetForm = () => {
    setInputText('');
    setDecryptedOutput('');
    setFile(null);
  };
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Decryption Tool</h1>
        <div className="mt-3 sm:mt-0">
          <Button variant="outline" size="sm" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left panel - Settings */}
            <div className="lg:col-span-1 space-y-6">
              <AlgoSelectDropdown
                type="crypto"
                value={algorithm}
                onChange={(value) => setAlgorithm(value as CryptoAlgorithm)}
                label="Select Algorithm"
                disabled={decryptMutation.isPending}
              />
              
              <div>
                <Label htmlFor="key-input">Decryption Key</Label>
                <div className="mt-1">
                  <Input
                    id="key-input"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    disabled={decryptMutation.isPending}
                    placeholder="Enter the decryption key"
                    className="w-full"
                  />
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enter the same key that was used for encryption.
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full gap-2" 
                  onClick={handleDecrypt}
                  disabled={!inputText || !key || decryptMutation.isPending}
                >
                  <Unlock className="h-5 w-5" />
                  {decryptMutation.isPending ? 'Decrypting...' : 'Decrypt'}
                </Button>
              </div>
            </div>
            
            {/* Right panel - Input/Output */}
            <div className="lg:col-span-2">
              <div className="flex flex-col h-full space-y-6">
                {/* Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="input-text">Encrypted Text</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={decryptMutation.isPending}
                      className="gap-1"
                    >
                      <Upload className="h-4 w-4" />
                      Upload File
                    </Button>
                  </div>
                  
                  {!file ? (
                    <Textarea
                      id="input-text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={decryptMutation.isPending}
                      rows={6}
                      placeholder="Enter encrypted text to decrypt"
                      className="resize-none"
                    />
                  ) : (
                    <FileUploader
                      onFileSelect={handleFileSelect}
                      disabled={decryptMutation.isPending}
                    />
                  )}
                </div>
                
                {/* Output */}
                <CodeBlock
                  content={decryptedOutput}
                  title="Decrypted Output"
                  showCopy={true}
                  showDownload={true}
                  fileName="decrypted.txt"
                  readOnly={true}
                />
                
                {/* Decryption visualization */}
                <div className="mt-4 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=300" 
                    alt="Decryption visualization" 
                    className="rounded-lg max-h-32" 
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Decryption;
