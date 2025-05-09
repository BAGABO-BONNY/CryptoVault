import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Key,
  Lock,
  Hash,
  FileText,
  ChevronRight,
  CheckCircle,
  Globe,
} from "lucide-react";

const HomePage = () => {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "What is CryptoVault?",
      answer:
        "CryptoVault is a comprehensive cryptography application that provides tools for encryption, decryption, hashing, key generation, and digital signatures. It uses client-side encryption to ensure your data never leaves your browser unprotected.",
    },
    {
      question: "Is my data safe with CryptoVault?",
      answer:
        "Yes, CryptoVault performs all cryptographic operations directly in your browser. Your sensitive data and cryptographic keys never leave your computer unencrypted, providing you with maximum security and privacy.",
    },
    {
      question: "What encryption algorithms does CryptoVault support?",
      answer:
        "CryptoVault supports industry-standard encryption algorithms, including AES-256, RSA, ChaCha20-Poly1305, and more. For hashing, we support SHA-256, SHA-512, and others. For digital signatures, we support RSA and ECDSA signatures.",
    },
    {
      question: "Do I need to create an account to use CryptoVault?",
      answer:
        "While you can access basic functions without an account, creating an account allows you to save your encryption settings, view your activity history, and access additional features like secure key storage and activity logs.",
    },
  ];

  const features = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Data Encryption",
      description:
        "Encrypt your sensitive data with AES-256, RSA, and other industry-standard algorithms.",
    },
    {
      icon: <Key className="h-6 w-6" />,
      title: "Key Generation",
      description:
        "Generate secure cryptographic keys for your encryption and signing needs.",
    },
    {
      icon: <Hash className="h-6 w-6" />,
      title: "File Hashing",
      description:
        "Verify file integrity with SHA-256, SHA-512, and other hashing algorithms.",
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Digital Signatures",
      description:
        "Sign and verify documents with RSA and ECDSA digital signatures.",
    },
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white">
                CryptoVault
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button onClick={() => navigate("/dashboard")}>
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/auth")}
                    className="hidden sm:inline-flex"
                  >
                    Log In
                  </Button>
                  <Button onClick={() => navigate("/auth?tab=register")}>
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between md:space-x-10">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4">
                Secure Your Data with Advanced Cryptography
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
                CryptoVault provides enterprise-grade cryptographic tools for
                protecting your most sensitive information.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button size="lg" onClick={handleGetStarted}>
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/about")}
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 border border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <div className="absolute -top-4 -right-4 bg-primary text-white text-xs px-3 py-1 rounded-full">
                    Client-side encryption
                  </div>
                  <div className="rounded-md bg-slate-100 dark:bg-slate-700 p-4 font-mono text-sm mb-4">
                    <div className="text-green-600 dark:text-green-400">
                      // Example: Encrypt a message with AES-256
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 mt-2">
                      const encrypted = await encrypt(
                      <br />
                      &nbsp;&nbsp;"AES-256-GCM",
                      <br />
                      &nbsp;&nbsp;message,
                      <br />
                      &nbsp;&nbsp;key
                      <br />
                      );
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-300">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 text-green-500 mr-1" />
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-blue-500 mr-1" />
                      <span>Private</span>
                    </div>
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-amber-500 mr-1" />
                      <span>Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Advanced Cryptographic Features
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
              CryptoVault offers a comprehensive suite of cryptographic tools to
              help you protect your data and verify its integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="text-primary bg-primary/10 p-3 rounded-lg inline-block mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-300">
              Have questions about CryptoVault? Here are answers to some common
              questions.
            </p>
          </div>

          <div className="max-w-3xl mx-auto divide-y divide-slate-200 dark:divide-slate-700">
            {faqs.map((faq, index) => (
              <div key={index} className="py-5">
                <button
                  className="flex w-full justify-between items-center text-left font-medium text-slate-900 dark:text-white"
                  onClick={() => toggleFaq(index)}
                >
                  <span>{faq.question}</span>
                  <ChevronRight
                    className={`h-5 w-5 text-slate-500 transform transition-transform duration-200 ${
                      activeFaq === index ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {activeFaq === index && (
                  <div className="mt-3 text-slate-600 dark:text-slate-300 pl-2">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to protect your data?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-primary-100">
            Start using CryptoVault's powerful cryptographic tools today and
            secure your digital assets.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleGetStarted}
            className="bg-white text-primary hover:bg-slate-100"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-6 w-6 text-primary" />
              <span className="ml-2 text-white font-medium">CryptoVault</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            &copy; {new Date().getFullYear()} CryptoVault. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;