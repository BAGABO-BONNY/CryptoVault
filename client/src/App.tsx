import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SettingsProvider } from "@/pages/settings";
import { AppLayout } from "@/components/layouts/AppLayout";
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

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/encryption" component={Encryption} />
      <Route path="/decryption" component={Decryption} />
      <Route path="/hashing" component={Hashing} />
      <Route path="/key-generator" component={KeyGenerator} />
      <Route path="/digital-signature" component={DigitalSignature} />
      <Route path="/logs" component={Logs} />
      <Route path="/settings" component={Settings} />
      <Route path="/help" component={Help} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="crypto-theme">
        <SettingsProvider>
          <TooltipProvider>
            <AppLayout>
              <Router />
            </AppLayout>
            <Toaster />
          </TooltipProvider>
        </SettingsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
