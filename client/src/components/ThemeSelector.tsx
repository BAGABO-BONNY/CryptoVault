import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Check, Moon, Sun, Monitor } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ThemeSelector() {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full text-slate-400 hover:text-slate-500 dark:hover:text-white"
        >
          {resolvedTheme === 'dark' ? (
            <Moon className="h-6 w-6" />
          ) : (
            <Sun className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('theme')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setTheme('light')} className="flex items-center justify-between">
          <div className="flex items-center">
            <Sun className="mr-2 h-4 w-4" />
            <span>{t('lightMode')}</span>
          </div>
          {theme === 'light' && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')} className="flex items-center justify-between">
          <div className="flex items-center">
            <Moon className="mr-2 h-4 w-4" />
            <span>{t('darkMode')}</span>
          </div>
          {theme === 'dark' && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')} className="flex items-center justify-between">
          <div className="flex items-center">
            <Monitor className="mr-2 h-4 w-4" />
            <span>{t('systemTheme')}</span>
          </div>
          {theme === 'system' && <Check className="ml-2 h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}