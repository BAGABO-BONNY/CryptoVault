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
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";

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

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/about" component={About} />
      <Route path="/help" component={Help} />
      
      {/* Protected routes */}
      <ProtectedRoute path="/dashboard" component={Dashboard} />
      <ProtectedRoute path="/encryption" component={Encryption} />
      <ProtectedRoute path="/decryption" component={Decryption} />
      <ProtectedRoute path="/hashing" component={Hashing} />
      <ProtectedRoute path="/key-generator" component={KeyGenerator} />
      <ProtectedRoute path="/digital-signature" component={DigitalSignature} />
      <ProtectedRoute path="/logs" component={Logs} />
      <ProtectedRoute path="/settings" component={Settings} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="crypto-theme">
        <AuthProvider>
          <SettingsProvider>
            <TooltipProvider>
              <AppLayout>
                <Router />
              </AppLayout>
              <Toaster />
            </TooltipProvider>
          </SettingsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
