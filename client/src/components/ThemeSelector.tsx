import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { Button } from '@/components/ui/button';

// Simple theme toggle without dependency on ThemeProvider context
export function ThemeSelector() {
  const { t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Initialize on component mount
  useEffect(() => {
    // Check current theme preference from HTML class or localStorage
    const isDark = document.documentElement.classList.contains('dark') || 
                  localStorage.getItem('ui-theme') === 'dark';
    setIsDarkMode(isDark);
  }, []);
  
  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    // Apply theme to document
    const root = document.documentElement;
    if (newIsDarkMode) {
      root.classList.remove('light');
      root.classList.add('dark');
      document.body.classList.add('dark');
      localStorage.setItem('ui-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.classList.remove('dark');
      localStorage.setItem('ui-theme', 'light');
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="rounded-full text-slate-400 hover:text-slate-500 dark:hover:text-white"
      onClick={toggleTheme}
      title={isDarkMode ? t('lightMode') : t('darkMode')}
    >
      {isDarkMode ? (
        <Sun className="h-6 w-6" />
      ) : (
        <Moon className="h-6 w-6" />
      )}
      <span className="sr-only">
        {isDarkMode ? t('lightMode') : t('darkMode')}
      </span>
    </Button>
  );
}