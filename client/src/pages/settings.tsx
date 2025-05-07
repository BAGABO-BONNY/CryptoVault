import React, { useState, useEffect } from 'react';
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
  Trash2
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
import AlgoSelectDropdown from '@/components/AlgoSelectDropdown';
import { AppSettings, CryptoAlgorithm, OutputFormat } from '@/types';

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // Default settings
  const defaultSettings: AppSettings = {
    theme: 'light',
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
    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values",
    });
  };
  
  const handleClearAllData = () => {
    clearDataMutation.mutate();
  };
  
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
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => setSettings({...settings, theme: value as 'light' | 'dark' | 'system'})}
                >
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="light" className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">
                        <div className="flex items-center gap-2">
                          <Laptop className="h-4 w-4" />
                          System
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Choose your preferred theme or use your system's settings
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => setSettings({...settings, language: value as 'en' | 'fr' | 'es' | 'de' | 'zh'})}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="en">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          English
                        </div>
                      </SelectItem>
                      <SelectItem value="fr">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Français
                        </div>
                      </SelectItem>
                      <SelectItem value="es">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Español
                        </div>
                      </SelectItem>
                      <SelectItem value="de">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          Deutsch
                        </div>
                      </SelectItem>
                      <SelectItem value="zh">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          中文
                        </div>
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Select your preferred language
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
