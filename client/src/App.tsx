import TempHomePage from "@/pages/temp-home";
import { ThemeProvider } from "@/components/ThemeProvider";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="crypto-theme">
      <TempHomePage />
    </ThemeProvider>
  );
}

export default App;
