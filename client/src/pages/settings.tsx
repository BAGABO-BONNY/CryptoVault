import React, { useState, useEffect, createContext, useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTheme } from '@/components/ThemeProvider';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon,
  Save,
  RotateCcw,
  Moon,
  Sun,
  Laptop,
  Globe,
  Key,
  Trash2,
  Monitor,
  Check,
  Languages
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import AlgoSelectDropdown from '@/components/AlgoSelectDropdown';
import { AppSettings, CryptoAlgorithm, OutputFormat } from '@/types';

// Define a context to share app settings across components
interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  saveSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useAppSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within a SettingsProvider');
  }
  return context;
};

// Create a provider component
export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme: currentTheme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // Default settings
  const defaultSettings: AppSettings = {
    theme: 'system',
    language: 'en',
    defaultAlgorithm: 'AES-256-GCM',
    clearDataOnExit: false,
    defaultOutputFormat: 'Base64'
  };
  
  // Load saved settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('crypto-app-settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });
  
  // Update theme when settings change
  useEffect(() => {
    if (settings.theme !== currentTheme) {
      setTheme(settings.theme as 'light' | 'dark' | 'system');
    }
  }, [settings.theme, setTheme, currentTheme]);
  
  // Sync with current theme in ThemeProvider
  useEffect(() => {
    if (currentTheme !== settings.theme) {
      setSettings(prev => ({ ...prev, theme: currentTheme }));
    }
  }, [currentTheme]);
  
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };
  
  const saveSettings = () => {
    localStorage.setItem('crypto-app-settings', JSON.stringify(settings));
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated",
    });
  };
  
  return (
    <SettingsContext.Provider value={{ settings, updateSettings, saveSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

const Settings = () => {
  const { theme, setTheme, systemTheme, resolvedTheme } = useTheme();
  const { toast } = useToast();
  
  // Default settings
  const defaultSettings: AppSettings = {
    theme: 'system',
    language: 'en',
    defaultAlgorithm: 'AES-256-GCM',
    clearDataOnExit: false,
    defaultOutputFormat: 'Base64'
  };
  
  // Load saved settings from localStorage
  const [settings, setSettings] = useState<AppSettings>(() => {
    const savedSettings = localStorage.getItem('crypto-app-settings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (e) {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });
  
  // Update theme when settings change
  useEffect(() => {
    setTheme(settings.theme as 'light' | 'dark' | 'system');
  }, [settings.theme, setTheme]);
  
  // Handle save settings
  const saveSettingsMutation = useMutation({
    mutationFn: async () => {
      // In a real app, this would be an API call to save settings
      // For now, we'll just use localStorage
      localStorage.setItem('crypto-app-settings', JSON.stringify(settings));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save settings",
        description: "There was an error saving your preferences",
        variant: "destructive",
      });
    }
  });
  
  // Handle clear all data
  const clearDataMutation = useMutation({
    mutationFn: async () => {
      // Clear local storage data (except settings)
      const savedSettings = localStorage.getItem('crypto-app-settings');
      localStorage.clear();
      if (savedSettings) {
        localStorage.setItem('crypto-app-settings', savedSettings);
      }
      
      // API call to clear data
      const response = await apiRequest('POST', '/api/clear-data', {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Data cleared",
        description: "All your data has been removed",
      });
    },
    onError: () => {
      toast({
        title: "Failed to clear data",
        description: "There was an error clearing your data",
        variant: "destructive",
      });
    }
  });
  
  const handleSaveSettings = () => {
    saveSettingsMutation.mutate();
  };
  
  const handleResetSettings = () => {
    setSettings(defaultSettings);
    setTheme(defaultSettings.theme as 'light' | 'dark' | 'system');
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values",
    });
  };
  
  const handleClearAllData = () => {
    clearDataMutation.mutate();
  };
  
  // Language options with flags
  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' },
    { value: 'es', label: 'Español', flag: '🇪🇸' },
    { value: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { value: 'zh', label: '中文', flag: '🇨🇳' }
  ];
  
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <div className="mt-3 sm:mt-0 flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleResetSettings}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={saveSettingsMutation.isPending}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saveSettingsMutation.isPending ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="appearance">
        <TabsList className="mb-6">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how CryptoVault looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base">Theme</Label>
                <RadioGroup
                  value={settings.theme}
                  onValueChange={(value) => setSettings({...settings, theme: value as 'light' | 'dark' | 'system'})}
                  className="grid grid-cols-3 gap-4"
                >
                  <div>
                    <RadioGroupItem
                      value="light"
                      id="theme-light"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="theme-light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-100 hover:border-primary-400 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <Sun className="mb-3 h-6 w-6" />
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium leading-none">Light</p>
                        <p className="text-xs text-muted-foreground">
                          Light mode
                        </p>
                      </div>
                      {settings.theme === 'light' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                      )}
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="dark"
                      id="theme-dark"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="theme-dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-100 hover:border-primary-400 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      <Moon className="mb-3 h-6 w-6" />
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium leading-none">Dark</p>
                        <p className="text-xs text-muted-foreground">
                          Dark mode
                        </p>
                      </div>
                      {settings.theme === 'dark' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                      )}
                    </Label>
                  </div>
                  
                  <div>
                    <RadioGroupItem
                      value="system"
                      id="theme-system"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="theme-system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-100 hover:border-primary-400 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      <Monitor className="mb-3 h-6 w-6" />
                      <div className="text-center space-y-1">
                        <p className="text-sm font-medium leading-none">System</p>
                        <p className="text-xs text-muted-foreground">
                          Follow system ({systemTheme})
                        </p>
                      </div>
                      {settings.theme === 'system' && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                      )}
                    </Label>
                  </div>
                </RadioGroup>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Choose your preferred theme or use your system's settings
                </p>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <Label className="text-base">Language</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {languageOptions.map((option) => (
                    <div key={option.value} className="relative">
                      <button
                        type="button"
                        className={`w-full flex items-center space-x-3 rounded-md border-2 p-4 hover:border-primary-400 transition-all ${
                          settings.language === option.value 
                            ? 'border-primary' 
                            : 'border-muted'
                        }`}
                        onClick={() => setSettings({...settings, language: option.value as 'en' | 'fr' | 'es' | 'de' | 'zh'})}
                      >
                        <span className="text-2xl">{option.flag}</span>
                        <span className="text-sm font-medium">{option.label}</span>
                        {settings.language === option.value && (
                          <Check className="absolute top-2 right-2 h-4 w-4 text-primary" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Select your preferred language for the interface
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Configure your default cryptography settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <AlgoSelectDropdown
                  type="crypto"
                  value={settings.defaultAlgorithm}
                  onChange={(value) => setSettings({...settings, defaultAlgorithm: value as CryptoAlgorithm})}
                  label="Default Algorithm"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  This algorithm will be pre-selected for new encryption operations
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="outputFormat">Default Output Format</Label>
                <Select 
                  value={settings.defaultOutputFormat} 
                  onValueChange={(value) => setSettings({...settings, defaultOutputFormat: value as OutputFormat})}
                >
                  <SelectTrigger id="outputFormat">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Base64">Base64</SelectItem>
                      <SelectItem value="Hex">Hex</SelectItem>
                      <SelectItem value="Binary">Binary</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose the default format for encrypted output
                </p>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="clear-data-exit">Clear Data on Exit</Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Automatically clear sensitive data when you close the app
                  </p>
                </div>
                <Switch
                  id="clear-data-exit"
                  checked={settings.clearDataOnExit}
                  onCheckedChange={(checked) => setSettings({...settings, clearDataOnExit: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <Card>
            <CardHeader>
              <CardTitle>Data & Privacy</CardTitle>
              <CardDescription>
                Manage your data and privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md">
                <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-2">Data Storage Information</h3>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  CryptoVault stores your encryption settings, logs, and preferences locally in your browser. 
                  No sensitive data is ever sent to servers without your explicit consent.
                </p>
              </div>
              
              <div className="border border-slate-200 dark:border-slate-700 rounded-md p-4">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-2">Local Storage</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                  The following data is stored locally in your browser:
                </p>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2 list-disc pl-5">
                  <li>User preferences and settings</li>
                  <li>Recent encryption/decryption operations</li>
                  <li>Operation logs and history</li>
                  <li>Generated keys (if not downloaded and cleared)</li>
                </ul>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive" className="w-full gap-2">
                    <Trash2 className="h-4 w-4" />
                    Clear All Data
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                    <DialogDescription>
                      This action will permanently delete all your stored data, including logs, recent operations, and saved preferences.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button 
                      variant="destructive" 
                      onClick={handleClearAllData}
                      disabled={clearDataMutation.isPending}
                    >
                      {clearDataMutation.isPending ? 'Clearing...' : 'Yes, clear all data'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter className="text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4 flex flex-col items-start">
              <p>
                For questions about data handling or privacy concerns, please refer to our <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacy Policy</a>.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
