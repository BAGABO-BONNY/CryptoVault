import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  HelpCircle,
  FileQuestion,
  Send,
  ChevronDown,
  ExternalLink,
  Mail,
  BookOpen,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { copyToClipboard } from '@/lib/utils';

interface FAQ {
  question: string;
  answer: string;
}

const Help = () => {
  const { toast } = useToast();
  
  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // List of FAQs
  const faqs: FAQ[] = [
    {
      question: "What is encryption and how does it work?",
      answer: "Encryption is the process of encoding information in a way that only authorized parties can access it. It uses mathematical algorithms to transform readable data (plaintext) into an unreadable format (ciphertext). Only those with the correct decryption key can convert the ciphertext back to plaintext."
    },
    {
      question: "What's the difference between symmetric and asymmetric encryption?",
      answer: "Symmetric encryption uses the same key for both encryption and decryption (like AES). Asymmetric encryption uses a pair of keys: a public key for encryption and a private key for decryption (like RSA). Symmetric is faster but requires secure key exchange, while asymmetric is slower but offers more secure key management."
    },
    {
      question: "Why should I use different key sizes for different algorithms?",
      answer: "Different algorithms have different security characteristics. For AES, 128-bit keys are generally secure, while 256-bit keys provide extra security for highly sensitive data. For RSA, 2048-bit keys are the minimum recommended, with 3072-bit or 4096-bit for long-term security. Larger keys provide more security but require more computational resources."
    },
    {
      question: "What is a hash and why would I use it?",
      answer: "A hash is a fixed-size string of characters generated from any size of data input. It's a one-way function, meaning you can't reverse it to get the original data. Hashes are used to verify data integrity, store passwords securely, and create digital signatures. Common hash algorithms include SHA-256, SHA-512, and SHA-3."
    },
    {
      question: "What is a digital signature and how does it work?",
      answer: "A digital signature is a mathematical technique used to validate the authenticity and integrity of a digital message or document. It's created by encrypting a hash of the message with the sender's private key. The recipient can verify the signature using the sender's public key, confirming the message wasn't altered and was sent by the owner of the private key."
    },
    {
      question: "Is my data secure when using CryptoVault?",
      answer: "CryptoVault processes all cryptographic operations locally in your browser. Your sensitive data never leaves your device unless you explicitly share or export it. We don't store your keys or encrypted data on our servers. For maximum security, always download and safely store your encryption keys, and clear your browser data regularly."
    },
    {
      question: "What should I do if I lose my encryption key?",
      answer: "Unfortunately, if you lose your encryption key, there is no way to recover the encrypted data. This is a fundamental security feature of strong encryption. Always keep backup copies of your keys in secure locations. Consider using a password manager to securely store your encryption keys."
    },
    {
      question: "Which encryption algorithm should I choose?",
      answer: "For most general purposes, AES-256-GCM is recommended as it offers excellent security and performance. If you need asymmetric encryption (where different keys are used for encryption and decryption), RSA-OAEP is a good choice. For specialized applications like blockchain, consider algorithms like ChaCha20-Poly1305."
    }
  ];
  
  // Submit contact form
  const contactMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/contact', {
        name,
        email,
        subject,
        message
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible",
      });
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again later or contact support directly",
        variant: "destructive",
      });
    }
  });
  
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name || !email || !message) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    contactMutation.mutate();
  };
  
  // Copy email to clipboard
  const handleCopyEmail = async () => {
    const success = await copyToClipboard('support@cryptovault.example.com');
    if (success) {
      toast({
        title: "Email copied",
        description: "Email address copied to clipboard",
      });
    } else {
      toast({
        title: "Failed to copy",
        description: "Please copy the email address manually",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help & Documentation</h1>
      </div>
      
      <Tabs defaultValue="guide">
        <TabsList className="mb-6">
          <TabsTrigger value="guide">User Guide</TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="contact">Contact Support</TabsTrigger>
        </TabsList>
        
        <TabsContent value="guide">
          <Card>
            <CardHeader>
              <CardTitle>CryptoVault User Guide</CardTitle>
              <CardDescription>
                Learn how to use CryptoVault's cryptographic tools effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Encryption */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-full mr-3">
                      <Lock className="h-5 w-5 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Encryption</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Securely encrypt sensitive text or files with robust algorithms.
                  </p>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal pl-5">
                    <li>Select your preferred encryption algorithm</li>
                    <li>Enter text or upload a file to encrypt</li>
                    <li>Either provide your own key or let the system generate one</li>
                    <li>Click "Encrypt" to process the data</li>
                    <li>Copy or download the encrypted output</li>
                    <li><strong>Important:</strong> Save your encryption key securely</li>
                  </ol>
                  <Button variant="link" size="sm" className="mt-3 p-0 h-auto" asChild>
                    <a href="/encryption">
                      Go to Encryption Tool
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
                
                {/* Decryption */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-full mr-3">
                      <Unlock className="h-5 w-5 text-green-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Decryption</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Decrypt your previously encrypted data using the correct key.
                  </p>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal pl-5">
                    <li>Select the same algorithm used for encryption</li>
                    <li>Enter the encrypted text or upload the encrypted file</li>
                    <li>Provide the exact encryption key used previously</li>
                    <li>Click "Decrypt" to reveal the original data</li>
                    <li>If decryption fails, verify the algorithm and key are correct</li>
                  </ol>
                  <Button variant="link" size="sm" className="mt-3 p-0 h-auto" asChild>
                    <a href="/decryption">
                      Go to Decryption Tool
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
                
                {/* Hashing */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 p-2 rounded-full mr-3">
                      <ShieldCheck className="h-5 w-5 text-indigo-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Hashing</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Generate cryptographic hashes to verify data integrity.
                  </p>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal pl-5">
                    <li>Select a hash algorithm (SHA-256 recommended)</li>
                    <li>Enter text or upload a file to hash</li>
                    <li>Click "Compute Hash" to generate the hash value</li>
                    <li>Use "Compare Mode" to verify if two files have the same hash</li>
                    <li>Remember that hashing is one-way - you cannot recover the original data</li>
                  </ol>
                  <Button variant="link" size="sm" className="mt-3 p-0 h-auto" asChild>
                    <a href="/hashing">
                      Go to Hashing Tool
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
                
                {/* Key Generator */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-2 rounded-full mr-3">
                      <Key className="h-5 w-5 text-amber-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Key Generator</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Create cryptographic keys for various encryption algorithms.
                  </p>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal pl-5">
                    <li>Select the key type (AES, RSA, ECDSA, etc.)</li>
                    <li>Choose an appropriate key size for your security needs</li>
                    <li>For asymmetric keys, select a curve type if applicable</li>
                    <li>Click "Generate Key" to create your keys</li>
                    <li>Download and store your keys in a secure location</li>
                    <li><strong>Never</strong> share your private keys</li>
                  </ol>
                  <Button variant="link" size="sm" className="mt-3 p-0 h-auto" asChild>
                    <a href="/key-generator">
                      Go to Key Generator
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
                
                {/* Digital Signatures */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-full mr-3">
                      <FileSignature className="h-5 w-5 text-purple-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Digital Signatures</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Sign documents to prove authenticity and integrity.
                  </p>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal pl-5">
                    <li>Select a signature algorithm (RSA-SHA256 recommended)</li>
                    <li>Enter the document text or upload a file to sign</li>
                    <li>Provide your private key to create a signature</li>
                    <li>Share the document and signature (not your private key)</li>
                    <li>To verify, use the "Verify Signature" tab with the recipient's public key</li>
                  </ol>
                  <Button variant="link" size="sm" className="mt-3 p-0 h-auto" asChild>
                    <a href="/digital-signature">
                      Go to Digital Signatures
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
                
                {/* Logs & History */}
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-full mr-3">
                      <List className="h-5 w-5 text-blue-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Logs & History</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    View and manage your cryptographic activity history.
                  </p>
                  <ol className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-decimal pl-5">
                    <li>Access a complete history of your cryptographic operations</li>
                    <li>Filter logs by operation type, date range, or search term</li>
                    <li>Export logs as CSV or JSON for record-keeping</li>
                    <li>Clear logs when they're no longer needed</li>
                    <li>For privacy, regularly clear your logs in Settings</li>
                  </ol>
                  <Button variant="link" size="sm" className="mt-3 p-0 h-auto" asChild>
                    <a href="/logs">
                      Go to Logs & History
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </div>
              
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-md text-sm text-slate-700 dark:text-slate-300">
                <div className="flex items-start mb-2">
                  <BookOpen className="h-5 w-5 text-primary-500 mr-2 mt-0.5" />
                  <h3 className="font-semibold">Looking for more detailed documentation?</h3>
                </div>
                <p>
                  For comprehensive guides, technical specifications, and advanced usage scenarios, 
                  please refer to our <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">complete documentation</a>.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faq">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Find answers to common questions about CryptoVault and cryptography
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center">
                        <FileQuestion className="h-5 w-5 text-primary-500 mr-2 flex-shrink-0" />
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 dark:text-slate-400 pl-7">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
              
              <Separator className="my-6" />
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Still have questions?</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  If you couldn't find the answer you were looking for, our support team is here to help.
                </p>
                <Button asChild>
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('[data-value="contact"]')?.click();
                  }}>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Contact Support
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Get help from our team of cryptography experts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Your name" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="your.email@example.com" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input 
                        id="subject" 
                        value={subject} 
                        onChange={(e) => setSubject(e.target.value)} 
                        placeholder="How can we help you?" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        placeholder="Please describe your issue or question in detail..." 
                        rows={5} 
                        required 
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={contactMutation.isPending}
                    >
                      <Send className="mr-2 h-4 w-4" />
                      {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </div>
                
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Other Ways to Reach Us</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center mb-2">
                        <Mail className="h-5 w-5 text-primary-500 mr-2" />
                        <h4 className="font-medium">Email Support</h4>
                      </div>
                      <div className="flex items-center ml-7 text-sm">
                        <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">support@cryptovault.example.com</code>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 ml-1" onClick={handleCopyEmail}>
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Copy email</span>
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-7">
                        Responses typically within 24 hours
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center mb-2">
                        <HelpCircle className="h-5 w-5 text-primary-500 mr-2" />
                        <h4 className="font-medium">Knowledge Base</h4>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 ml-7">
                        Browse our <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">extensive knowledge base</a> for tutorials, guides, and troubleshooting tips.
                      </p>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-md mt-6">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">Support Hours</h4>
                      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                        <p>Monday - Friday: 9:00 AM - 8:00 PM EST</p>
                        <p>Saturday: 10:00 AM - 5:00 PM EST</p>
                        <p>Sunday: Closed</p>
                      </div>
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

// These components are referenced in the JSX but not defined in the imports
// So we define them here for proper rendering
const Lock = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const Unlock = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);

export default Help;
