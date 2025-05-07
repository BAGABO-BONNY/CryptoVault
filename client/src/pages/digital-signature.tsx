import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { FileSignature, Upload, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import AlgoSelectDropdown from '@/components/AlgoSelectDropdown';
import FileUploader from '@/components/FileUploader';
import CodeBlock from '@/components/CodeBlock';
import type { SignatureAlgorithm, CryptoResult } from '@/types';

const DigitalSignature = () => {
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'sign' | 'verify'>('sign');
  const [algorithm, setAlgorithm] = useState<SignatureAlgorithm>('RSA-SHA256');
  
  // Sign mode state
  const [inputText, setInputText] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [signature, setSignature] = useState('');
  
  // Verify mode state
  const [verifyText, setVerifyText] = useState('');
  const [verifySignature, setVerifySignature] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  
  // File state
  const [file, setFile] = useState<File | null>(null);
  
  // Handle signature creation
  const signMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/crypto/sign', {
        algorithm,
        input: inputText,
        privateKey
      });
      return response.json();
    },
    onSuccess: (data: CryptoResult) => {
      if (data.success) {
        setSignature(data.data || '');
        toast({
          title: "Signature created",
          description: "Your digital signature has been generated.",
          variant: "default",
        });
      } else {
        toast({
          title: "Signature creation failed",
          description: data.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Signature creation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Handle signature verification
  const verifyMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/crypto/verify', {
        algorithm,
        input: verifyText,
        signature: verifySignature,
        publicKey
      });
      return response.json();
    },
    onSuccess: (data: CryptoResult) => {
      if (data.success && data.data) {
        const isValid = data.data === 'true' || data.data === true;
        setVerificationResult(isValid);
        toast({
          title: isValid ? "Signature verified" : "Invalid signature",
          description: isValid 
            ? "The signature is valid and matches the data." 
            : "The signature is invalid or has been tampered with.",
          variant: isValid ? "default" : "destructive",
        });
      } else {
        setVerificationResult(false);
        toast({
          title: "Verification failed",
          description: data.error || "An unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      setVerificationResult(false);
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  const handleSign = () => {
    if (!inputText) {
      toast({
        title: "Input required",
        description: "Please enter text to sign",
        variant: "destructive",
      });
      return;
    }
    
    if (!privateKey) {
      toast({
        title: "Private key required",
        description: "Please enter your private key",
        variant: "destructive",
      });
      return;
    }
    
    signMutation.mutate();
  };
  
  const handleVerify = () => {
    if (!verifyText) {
      toast({
        title: "Input required",
        description: "Please enter text to verify",
        variant: "destructive",
      });
      return;
    }
    
    if (!verifySignature) {
      toast({
        title: "Signature required",
        description: "Please enter the signature to verify",
        variant: "destructive",
      });
      return;
    }
    
    if (!publicKey) {
      toast({
        title: "Public key required",
        description: "Please enter the public key",
        variant: "destructive",
      });
      return;
    }
    
    verifyMutation.mutate();
  };
  
  const handleFileSelect = (file: File, content: string) => {
    setFile(file);
    if (mode === 'sign') {
      setInputText(content);
    } else {
      setVerifyText(content);
    }
  };
  
  const resetForm = () => {
    if (mode === 'sign') {
      setInputText('');
      setPrivateKey('');
      setSignature('');
    } else {
      setVerifyText('');
      setVerifySignature('');
      setPublicKey('');
      setVerificationResult(null);
    }
    setFile(null);
  };
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Digital Signatures</h1>
        <div className="mt-3 sm:mt-0">
          <Button variant="outline" size="sm" onClick={resetForm} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
      
      <Tabs value={mode} onValueChange={(v) => setMode(v as 'sign' | 'verify')} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="sign">Create Signature</TabsTrigger>
          <TabsTrigger value="verify">Verify Signature</TabsTrigger>
        </TabsList>
        
        {/* Sign Tab */}
        <TabsContent value="sign">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left panel - Options */}
                <div className="lg:col-span-1 space-y-6">
                  <AlgoSelectDropdown
                    type="signature"
                    value={algorithm}
                    onChange={(value) => setAlgorithm(value as SignatureAlgorithm)}
                    label="Signature Algorithm"
                    disabled={signMutation.isPending}
                  />
                  
                  <div>
                    <Label htmlFor="private-key">Private Key</Label>
                    <Textarea
                      id="private-key"
                      value={privateKey}
                      onChange={(e) => setPrivateKey(e.target.value)}
                      disabled={signMutation.isPending}
                      rows={6}
                      placeholder="Enter your private key"
                      className="mt-2 font-mono text-sm"
                    />
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      This is the key you want to use to prove your identity.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full gap-2" 
                      onClick={handleSign}
                      disabled={!inputText || !privateKey || signMutation.isPending}
                    >
                      <FileSignature className="h-5 w-5" />
                      {signMutation.isPending ? 'Signing...' : 'Sign Document'}
                    </Button>
                  </div>
                </div>
                
                {/* Right panel - Input/Output */}
                <div className="lg:col-span-2">
                  <div className="flex flex-col h-full space-y-6">
                    {/* Input */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="input-text">Document to Sign</Label>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={signMutation.isPending}
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
                          disabled={signMutation.isPending}
                          rows={6}
                          placeholder="Enter text to sign"
                          className="resize-none"
                        />
                      ) : (
                        <FileUploader
                          onFileSelect={handleFileSelect}
                          disabled={signMutation.isPending}
                        />
                      )}
                    </div>
                    
                    {/* Signature Output */}
                    <CodeBlock
                      content={signature}
                      title="Digital Signature"
                      showCopy={true}
                      showDownload={true}
                      fileName="signature.txt"
                      readOnly={true}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Verify Tab */}
        <TabsContent value="verify">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left panel - Options */}
                <div className="lg:col-span-1 space-y-6">
                  <AlgoSelectDropdown
                    type="signature"
                    value={algorithm}
                    onChange={(value) => setAlgorithm(value as SignatureAlgorithm)}
                    label="Signature Algorithm"
                    disabled={verifyMutation.isPending}
                  />
                  
                  <div>
                    <Label htmlFor="verify-signature">Signature to Verify</Label>
                    <Textarea
                      id="verify-signature"
                      value={verifySignature}
                      onChange={(e) => setVerifySignature(e.target.value)}
                      disabled={verifyMutation.isPending}
                      rows={4}
                      placeholder="Enter the signature to verify"
                      className="mt-2 font-mono text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="public-key">Public Key</Label>
                    <Textarea
                      id="public-key"
                      value={publicKey}
                      onChange={(e) => setPublicKey(e.target.value)}
                      disabled={verifyMutation.isPending}
                      rows={4}
                      placeholder="Enter the signer's public key"
                      className="mt-2 font-mono text-sm"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      className="w-full gap-2" 
                      onClick={handleVerify}
                      disabled={!verifyText || !verifySignature || !publicKey || verifyMutation.isPending}
                    >
                      <CheckCircle className="h-5 w-5" />
                      {verifyMutation.isPending ? 'Verifying...' : 'Verify Signature'}
                    </Button>
                  </div>
                  
                  {verificationResult !== null && (
                    <div className={`mt-4 p-4 rounded-md ${verificationResult ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                      <div className="flex items-center">
                        {verificationResult ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <p className="text-sm font-medium text-green-800 dark:text-green-200">
                              Valid signature. Document verified.
                            </p>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                            <p className="text-sm font-medium text-red-800 dark:text-red-200">
                              Invalid signature. Verification failed.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Right panel - Document */}
                <div className="lg:col-span-2">
                  <div className="flex flex-col h-full space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="verify-text">Document to Verify</Label>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={verifyMutation.isPending}
                          className="gap-1"
                        >
                          <Upload className="h-4 w-4" />
                          Upload File
                        </Button>
                      </div>
                      
                      {!file ? (
                        <Textarea
                          id="verify-text"
                          value={verifyText}
                          onChange={(e) => setVerifyText(e.target.value)}
                          disabled={verifyMutation.isPending}
                          rows={12}
                          placeholder="Enter the signed document text"
                          className="resize-none"
                        />
                      ) : (
                        <FileUploader
                          onFileSelect={handleFileSelect}
                          disabled={verifyMutation.isPending}
                        />
                      )}
                    </div>
                    
                    <div className="mt-4 flex justify-center">
                      <img 
                        src="https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&h=300" 
                        alt="Digital signature concept" 
                        className="rounded-lg max-h-32" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DigitalSignature;
