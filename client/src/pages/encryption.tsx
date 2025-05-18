import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/use-language';
import { Lock, Upload, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import AlgoSelectDropdown from '@/components/AlgoSelectDropdown';
import FileUploader from '@/components/FileUploader';
import CodeBlock from '@/components/CodeBlock';
import { CryptoToolSkeleton } from '@/components/SkeletonLoaders';
import type { CryptoAlgorithm, OutputFormat, CryptoResult } from '@/types';

const Encryption = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // State for encryption options
  const [algorithm, setAlgorithm] = useState<CryptoAlgorithm>('AES-256-GCM');
  const [key, setKey] = useState('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('Base64');
  const [generateKey, setGenerateKey] = useState(true);
  
  // Input and output
  const [inputText, setInputText] = useState('');
  const [encryptedOutput, setEncryptedOutput] = useState('');
  const [generatedKey, setGeneratedKey] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  // UI state
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Handle encryption logic
  const encryptMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/crypto/encrypt', {
        algorithm,
        input: inputText,
        key: generateKey ? null : key,
        outputFormat
      });
      return response.json();
    },
    onSuccess: (data: any) => {
      // Reset processing state
      setIsProcessing(false);
      
      if (data.success) {
        setEncryptedOutput(data.data || '');
        if (generateKey && data.key) {
          setGeneratedKey(data.key);
        }
        toast({
          title: "Encrypted successfully",
          description: "Your data has been encrypted.",
          variant: "default",
        });
      } else {
        toast({
          title: "Encryption failed",
          description: data.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      // Reset processing state
      setIsProcessing(false);
      
      toast({
        title: "Encryption failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleEncrypt = () => {
    if (!inputText) {
      toast({
        title: "Input required",
        description: "Please enter text to encrypt",
        variant: "destructive",
      });
      return;
    }
    
    // Set the processing state to show loading skeletons
    setIsProcessing(true);
    
    // Simulate a longer delay to better showcase the loading skeletons
    setTimeout(() => {
      encryptMutation.mutate();
    }, 3000);
  };
  
  const handleGenerateKey = () => {
    // For demonstration, generate a random key
    const keyLength = algorithm === 'AES-256-GCM' ? 32 : 16;
    const array = new Uint8Array(keyLength);
    window.crypto.getRandomValues(array);
    
    // Convert to base64 using a safer approach
    let keyStr = '';
    for (let i = 0; i < array.length; i++) {
      keyStr += String.fromCharCode(array[i]);
    }
    const key = btoa(keyStr);
    setKey(key);
    
    toast({
      title: "Key generated",
      description: "A new random key has been generated",
    });
  };
  
  const handleFileSelect = (file: File, content: string) => {
    setFile(file);
    setInputText(content);
  };
  
  const resetForm = () => {
    setInputText('');
    setEncryptedOutput('');
    setGeneratedKey('');
    setFile(null);
  };
  
  // Show loading skeletons while encrypting
  if (encryptMutation.isPending) {
    return <CryptoToolSkeleton />;
  }
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('encryption')}</h1>
        <div className="mt-3 sm:mt-0">
          <Button variant="outline" size="sm" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            {t('reset')}
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
                label={t('selectAlgorithm')}
                disabled={encryptMutation.isPending}
              />
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="key-input">{t('encryptionKey')}</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto-generate"
                      checked={generateKey}
                      onCheckedChange={setGenerateKey}
                      disabled={encryptMutation.isPending}
                    />
                    <Label htmlFor="auto-generate" className="text-xs">{t('autoGenerate')}</Label>
                  </div>
                </div>
                
                <div className="mt-1 flex rounded-md shadow-sm">
                  <Input
                    type="password"
                    id="key-input"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    disabled={generateKey || encryptMutation.isPending}
                    placeholder={generateKey ? t('keyAutoGenerated') : t('enterKey')}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateKey}
                    disabled={generateKey || encryptMutation.isPending}
                    className="ml-2"
                  >
                    {t('generate')}
                  </Button>
                </div>
                
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {t('aesKeyHelp')}
                </div>
              </div>
              
              <div>
                <Label htmlFor="outputFormat">{t('outputFormat')}</Label>
                <div className="mt-1">
                  <Select 
                    value={outputFormat} 
                    onValueChange={(value) => setOutputFormat(value as OutputFormat)}
                    disabled={encryptMutation.isPending}
                  >
                    <SelectTrigger id="outputFormat">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Base64">Base64</SelectItem>
                        <SelectItem value="Hex">Hex</SelectItem>
                        <SelectItem value="Binary">Binary</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="pt-4">
                <Button 
                  className="w-full gap-2" 
                  onClick={handleEncrypt}
                  disabled={!inputText || encryptMutation.isPending}
                >
                  <Lock className="h-5 w-5" />
                  {encryptMutation.isPending ? t('encryptingText') : t('encryptBtn')}
                </Button>
              </div>
            </div>
            
            {/* Right panel - Input/Output */}
            <div className="lg:col-span-2">
              <div className="flex flex-col h-full space-y-6">
                {/* Input */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="input-text">{t('inputText')}</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={encryptMutation.isPending}
                      className="gap-1"
                    >
                      <Upload className="h-4 w-4" />
                      {t('uploadFile')}
                    </Button>
                  </div>
                  
                  {!file ? (
                    <Textarea
                      id="input-text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      disabled={encryptMutation.isPending}
                      rows={6}
                      placeholder="Enter text to encrypt"
                      className="resize-none"
                    />
                  ) : (
                    <FileUploader
                      onFileSelect={handleFileSelect}
                      disabled={encryptMutation.isPending}
                    />
                  )}
                </div>
                
                {/* Output */}
                <CodeBlock
                  content={encryptedOutput}
                  title="Encrypted Output"
                  showCopy={true}
                  showDownload={true}
                  fileName="encrypted.txt"
                  readOnly={true}
                  isLoading={isProcessing}
                />
                
                {/* Generated Key (if auto-generated) */}
                {(generateKey && generatedKey) || isProcessing ? (
                  <CodeBlock
                    content={generatedKey}
                    title="Generated Key (Save this securely!)"
                    showCopy={true}
                    showDownload={true}
                    fileName="encryption-key.txt"
                    readOnly={true}
                    isLoading={isProcessing}
                  />
                ) : null}
                
                {/* Encryption visualization */}
                <div className="mt-4 flex justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=300" 
                    alt="Encryption visualization" 
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

export default Encryption;
