import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck, Upload, RotateCcw, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import AlgoSelectDropdown from '@/components/AlgoSelectDropdown';
import FileUploader from '@/components/FileUploader';
import CodeBlock from '@/components/CodeBlock';
import type { HashAlgorithm, CryptoResult } from '@/types';

const Hashing = () => {
  const { toast } = useToast();
  
  // State for hashing options
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const [compareMode, setCompareMode] = useState(false);
  
  // Input and output
  const [inputText, setInputText] = useState('');
  const [compareText, setCompareText] = useState('');
  const [hashOutput, setHashOutput] = useState('');
  const [compareHash, setCompareHash] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [hashesMatch, setHashesMatch] = useState<boolean | null>(null);
  
  // Update hash match status whenever either hash changes
  useEffect(() => {
    if (compareMode && hashOutput && compareHash) {
      setHashesMatch(hashOutput.toLowerCase() === compareHash.toLowerCase());
    } else {
      setHashesMatch(null);
    }
  }, [hashOutput, compareHash, compareMode]);
  
  // Handle hashing logic
  const hashMutation = useMutation({
    mutationFn: async (textToHash: string) => {
      const response = await apiRequest('POST', '/api/crypto/hash', {
        algorithm,
        input: textToHash
      });
      return response.json();
    },
    onSuccess: (data: CryptoResult, variables) => {
      if (data.success) {
        // If it's compare text, update compareHash, otherwise update hashOutput
        if (variables === compareText && compareMode) {
          setCompareHash(data.data || '');
        } else {
          setHashOutput(data.data || '');
        }
        
        toast({
          title: "Hash generated",
          description: `${algorithm} hash has been computed.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Hashing failed",
          description: data.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Hashing failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleHash = () => {
    if (!inputText) {
      toast({
        title: "Input required",
        description: "Please enter text to hash",
        variant: "destructive",
      });
      return;
    }
    
    hashMutation.mutate(inputText);
    
    // If in compare mode, also hash the compare text
    if (compareMode && compareText) {
      hashMutation.mutate(compareText);
    }
  };
  
  const handleFileSelect = (file: File, content: string) => {
    setFile(file);
    setInputText(content);
  };
  
  const resetForm = () => {
    setInputText('');
    setCompareText('');
    setHashOutput('');
    setCompareHash('');
    setFile(null);
    setHashesMatch(null);
  };
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hashing Utilities</h1>
        <div className="mt-3 sm:mt-0 flex gap-2">
          <div className="flex items-center space-x-2">
            <Switch
              id="compare-mode"
              checked={compareMode}
              onCheckedChange={setCompareMode}
              disabled={hashMutation.isPending}
            />
            <Label htmlFor="compare-mode">Compare Mode</Label>
          </div>
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
                type="hash"
                value={algorithm}
                onChange={(value) => setAlgorithm(value as HashAlgorithm)}
                label="Select Hash Algorithm"
                disabled={hashMutation.isPending}
              />
              
              <div className="pt-4">
                <Button 
                  className="w-full gap-2" 
                  onClick={handleHash}
                  disabled={!inputText || hashMutation.isPending}
                >
                  <ShieldCheck className="h-5 w-5" />
                  {hashMutation.isPending ? 'Computing...' : 'Compute Hash'}
                </Button>
              </div>
              
              {compareMode && hashesMatch !== null && (
                <div className={`mt-4 p-4 rounded-md ${hashesMatch ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <p className={`text-sm font-medium ${hashesMatch ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                    {hashesMatch ? 'Hashes match! Data integrity verified.' : 'Hashes do not match. Data may be corrupted or tampered.'}
                  </p>
                </div>
              )}
            </div>
            
            {/* Right panel - Input/Output */}
            <div className="lg:col-span-2">
              {!compareMode ? (
                <div className="flex flex-col h-full space-y-6">
                  {/* Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="input-text">Input Text</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        disabled={hashMutation.isPending}
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
                        disabled={hashMutation.isPending}
                        rows={6}
                        placeholder="Enter text to hash"
                        className="resize-none"
                      />
                    ) : (
                      <FileUploader
                        onFileSelect={handleFileSelect}
                        disabled={hashMutation.isPending}
                      />
                    )}
                  </div>
                  
                  {/* Output */}
                  <CodeBlock
                    content={hashOutput}
                    title={`${algorithm} Hash Output`}
                    showCopy={true}
                    showDownload={false}
                    readOnly={true}
                  />
                </div>
              ) : (
                <Tabs defaultValue="original" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="original">Original</TabsTrigger>
                    <TabsTrigger value="compare">Compare</TabsTrigger>
                  </TabsList>
                  <TabsContent value="original" className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="input-text">Original Text</Label>
                      <Textarea
                        id="input-text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        disabled={hashMutation.isPending}
                        rows={4}
                        placeholder="Enter original text"
                        className="resize-none mt-2"
                      />
                    </div>
                    
                    <CodeBlock
                      content={hashOutput}
                      title={`Original ${algorithm} Hash`}
                      showCopy={true}
                      showDownload={false}
                      readOnly={true}
                    />
                  </TabsContent>
                  <TabsContent value="compare" className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="compare-text">Compare Text</Label>
                      <Textarea
                        id="compare-text"
                        value={compareText}
                        onChange={(e) => setCompareText(e.target.value)}
                        disabled={hashMutation.isPending}
                        rows={4}
                        placeholder="Enter text to compare"
                        className="resize-none mt-2"
                      />
                    </div>
                    
                    <CodeBlock
                      content={compareHash}
                      title={`Compare ${algorithm} Hash`}
                      showCopy={true}
                      showDownload={false}
                      readOnly={true}
                    />
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Hashing;
