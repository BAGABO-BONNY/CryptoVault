import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SettingsProvider } from "@/pages/settings";
import { AppLayout } from "@/components/layouts/AppLayout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { LanguageProvider } from "@/hooks/use-language";
import NotFound from "@/pages/not-found";

// Import all pages
import Dashboard from "@/pages/dashboard";
import Encryption from "@/pages/encryption";
import Decryption from "@/pages/decryption";
import Hashing from "@/pages/hashing";
import KeyGenerator from "@/pages/key-generator";
import DigitalSignature from "@/pages/digital-signature";
import Logs from "@/pages/logs";
import Settings from "@/pages/settings";
import Help from "@/pages/help";
import About from "@/pages/about";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProfilePage from "@/pages/profile";
import AdminDashboard from "@/pages/admin-dashboard";
import CustomerDashboard from "@/pages/customer-dashboard";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/about" component={About} />
      <Route path="/help" component={Help} />
      <Route path="/" component={HomePage} />
      
      {/* Protected routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/encryption" component={Encryption} />
      <ProtectedRoute path="/decryption" component={Decryption} />
      <ProtectedRoute path="/hashing" component={Hashing} />
      <ProtectedRoute path="/key-generator" component={KeyGenerator} />
      <ProtectedRoute path="/digital-signature" component={DigitalSignature} />
      <ProtectedRoute path="/logs" component={Logs} />
      <ProtectedRoute path="/settings" component={Settings} />
      <ProtectedRoute path="/profile" component={ProfilePage} />
      
      {/* Catch-all route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="crypto-theme">
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <AppLayout>
                <Router />
              </AppLayout>
              <Toaster />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
