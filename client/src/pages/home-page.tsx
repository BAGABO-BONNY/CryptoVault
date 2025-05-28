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
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="bg-primary/10 p-2 rounded-full">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white">
                CryptoVault
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-shadow"
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/auth")}
                    className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary"
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={() => navigate("/auth?tab=register")}
                    className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-shadow"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-slate-50 via-secondary to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-800 overflow-hidden relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute top-1/2 -right-48 w-96 h-96 bg-accent rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-24 left-1/3 w-64 h-64 bg-primary rounded-full filter blur-3xl opacity-10"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row items-center justify-between md:space-x-10">
            <div className="md:w-1/2 mb-10 md:mb-0 z-10">
              <div className="inline-block px-3 py-1 bg-primary/20 text-primary rounded-full font-medium text-sm mb-6 animate-pulse">
                Industry-Leading Security Solutions
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
                <span className="block">Secure Your Digital</span>
                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  World with Cryptography
                </span>
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                CryptoVault provides enterprise-grade cryptographic tools for
                protecting your sensitive information with military-grade
                encryption methods and intuitive tools.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 hover:translate-y-[-2px]"
                >
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/about")}
                  className="border-slate-300 hover:border-primary hover:text-primary transition-colors duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 z-10">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-700 transition-all duration-300    relative overflow-hidden">
                <div className="absolute -top-14 -right-14 w-28 h-28 bg-primary/10 rounded-full"></div>
                <div className="absolute -bottom-14 -left-14 w-28 h-28 bg-accent/10 rounded-full"></div>

                <div className="relative">
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-primary to-accent text-white text-xs px-3 py-1 rounded-full shadow-lg">
                    Client-side encryption
                  </div>
                  <div className="rounded-xl bg-slate-100 dark:bg-slate-700 p-5 font-mono text-sm mb-4 shadow-inner">
                    <div className="text-green-600 dark:text-green-400">
                      // Example: Encrypt a message with AES-256
                    </div>
                    <div className="text-slate-800 dark:text-slate-200 mt-2">
                      <span className="text-blue-500 dark:text-blue-400">
                        const
                      </span>{" "}
                      <span className="text-purple-500 dark:text-purple-400">
                        encrypted
                      </span>{" "}
                      ={" "}
                      <span className="text-yellow-500 dark:text-yellow-400">
                        await
                      </span>{" "}
                      encrypt(
                      <br />
                      &nbsp;&nbsp;
                      <span className="text-green-500 dark:text-green-400">
                        "AES-256-GCM"
                      </span>
                      ,
                      <br />
                      &nbsp;&nbsp;message,
                      <br />
                      &nbsp;&nbsp;key
                      <br />
                      );
                    </div>
                  </div>

                  <div className="flex items-center justify-center space-x-6 text-sm">
                    <div className="flex items-center bg-success/10 text-success px-3 py-2 rounded-full">
                      <Shield className="h-4 w-4 mr-2" />
                      <span className="font-medium">Secure</span>
                    </div>
                    <div className="flex items-center bg-info/10 text-info px-3 py-2 rounded-full">
                      <Globe className="h-4 w-4 mr-2" />
                      <span className="font-medium">Private</span>
                    </div>
                    <div className="flex items-center bg-warning/10 text-warning px-3 py-2 rounded-full">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="font-medium">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-64 top-0 w-96 h-96 bg-primary/5 rounded-full"></div>
          <div className="absolute -left-64 bottom-0 w-96 h-96 bg-accent/5 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full font-medium text-sm mb-4">
              Powerful & Intuitive
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
              Advanced Cryptographic Features
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300">
              CryptoVault offers a comprehensive suite of cryptographic tools to
              help you protect your data and verify its integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:border-primary/20 group hover:-translate-y-1"
              >
                <div className="text-primary bg-primary/10 p-4 rounded-2xl inline-block mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">
                  {feature.description}
                </p>
                <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="px-0 text-primary hover:text-primary/80 hover:bg-transparent"
                    onClick={() =>
                      navigate(
                        `/${feature.title.toLowerCase().replace(" ", "-")}`
                      )
                    }
                  >
                    Learn more <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-8 rounded-2xl border border-slate-200 dark:border-slate-600 inline-block">
              <div className="flex items-center justify-center mb-6 text-accent">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Military-Grade Security
              </h3>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                All cryptographic operations are performed client-side using the
                latest Web Crypto API standards, ensuring your sensitive data
                never leaves your device unencrypted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-br from-secondary via-white to-secondary dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-primary/20 rounded-full"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-accent/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-primary/10 rounded-full"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full font-medium text-sm mb-4">
              Got Questions?
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-slate-600 dark:text-slate-300">
              Have questions about CryptoVault? Here are answers to some common
              questions to help you get started.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`border-b border-slate-200 dark:border-slate-700 ${
                    index === faqs.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <button
                    className="flex w-full justify-between items-center text-left p-6 font-medium text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
                    onClick={() => toggleFaq(index)}
                  >
                    <span className="text-lg">{faq.question}</span>
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 transition-transform duration-300 ${
                        activeFaq === index
                          ? "rotate-180 bg-primary/10 text-primary dark:bg-primary/20"
                          : ""
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      activeFaq === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-6 pt-0 text-slate-600 dark:text-slate-300 text-lg">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <p className="text-slate-600 dark:text-slate-300 mb-4">
                Still have questions? We're here to help.
              </p>
              <Button
                variant="outline"
                onClick={() => navigate("/help")}
                className="border-primary text-primary hover:bg-primary hover:text-white transition-colors"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-primary via-primary to-accent text-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 border-4 border-white rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/20 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/20 rounded-full"></div>

          {/* Floating encryption symbols */}
          <div className="absolute top-[15%] left-[10%] text-white/30 text-7xl animate-float-slow">
            🔒
          </div>
          <div className="absolute top-[65%] left-[20%] text-white/20 text-5xl animate-float-medium">
            🔑
          </div>
          <div className="absolute top-[30%] right-[15%] text-white/20 text-6xl animate-float-fast">
            🛡️
          </div>
          <div className="absolute top-[70%] right-[10%] text-white/30 text-5xl animate-float-medium">
            🔐
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6 rounded-lg px-3 py-1 bg-white/10 backdrop-blur-md">
            <span className="text-white/90 font-medium text-sm">
              Secure Your Digital Future
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight max-w-4xl mx-auto">
            Ready to protect your most sensitive data with military-grade
            encryption?
          </h2>
          <p className="max-w-2xl mx-auto mb-12 text-xl text-white/80 leading-relaxed">
            Start using CryptoVault's powerful cryptographic tools today and
            secure your digital assets with confidence and peace of mind.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-primary hover:bg-white/90 transition-all shadow-xl hover:shadow-white/20 hover:-translate-y-1 px-8 py-6 text-lg"
            >
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/about")}
              className="border-white text-blue-500 hover:bg-white/10 transition-all px-8 py-6 text-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="bg-white/10 rounded-full p-4 mb-3">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-1">100% Secure</h3>
                <p className="text-white/70 text-sm">
                  Client-side encryption keeps your data private
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/10 rounded-full p-4 mb-3">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-1">Reliable</h3>
                <p className="text-white/70 text-sm">
                  Used by thousands of security professionals
                </p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white/10 rounded-full p-4 mb-3">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-1">Accessible</h3>
                <p className="text-white/70 text-sm">
                  Works across all your devices and platforms
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-slate-900 text-slate-400">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-2 rounded-lg mr-2">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <span className="text-white font-bold text-xl">
                  CryptoVault
                </span>
              </div>
              <p className="text-slate-400 mb-4">
                Enterprise-grade cryptographic tools for everyone.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://x.com/BagaboBonn56348"
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61555186797204"
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a
                  href="https://github.com/BAGABO-BONNY"
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                    <path d="M9 18c-4.51 2-5-2-7-2"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-slate-400 hover:text-primary transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Enterprise
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} CryptoVault. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
