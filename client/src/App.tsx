import { Route, Switch } from "wouter";
import TempHomePage from "@/pages/temp-home";
import { ThemeProvider } from "@/components/ThemeProvider";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="crypto-theme">
      <Switch>
        <Route path="/" component={TempHomePage} />
        <Route component={NotFound} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
