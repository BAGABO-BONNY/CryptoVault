import { Route, Switch } from "wouter";
import { ThemeProvider } from "@/components/ThemeProvider";
import HomePage from "@/pages/home-page";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="crypto-theme">
      <Switch>
        <Route path="/" component={HomePage} />
      </Switch>
    </ThemeProvider>
  );
}

export default App;
