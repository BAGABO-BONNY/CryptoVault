import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { 
  Mic, 
  MicOff, 
  VolumeX, 
  Volume2, 
  Eye, 
  EyeOff, 
  Maximize, 
  X,
  HelpCircle,
  Settings,
  Keyboard
} from 'lucide-react';
import { useVoiceRecognition, VOICE_COMMANDS } from '@/hooks/use-voice-recognition';
import { useTheme } from './ThemeProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface AccessibilityPanelProps {
  onToggleSidebar?: () => void;
}

const AccessibilityFab: React.FC<AccessibilityPanelProps> = ({ onToggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    screenReader: false,
    reducedMotion: false,
    voiceCommands: true,
  });
  const [, navigate] = useLocation();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  // Sync preferences with localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        setAccessibilitySettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse accessibility settings', e);
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('accessibility-settings', JSON.stringify(accessibilitySettings));
    
    // Apply CSS classes based on settings
    const htmlElement = document.documentElement;
    if (accessibilitySettings.highContrast) {
      htmlElement.classList.add('high-contrast');
    } else {
      htmlElement.classList.remove('high-contrast');
    }
    
    if (accessibilitySettings.largeText) {
      htmlElement.classList.add('large-text');
    } else {
      htmlElement.classList.remove('large-text');
    }
    
    if (accessibilitySettings.reducedMotion) {
      htmlElement.classList.add('reduced-motion');
    } else {
      htmlElement.classList.remove('reduced-motion');
    }
  }, [accessibilitySettings]);

  // Handle voice commands
  const handleVoiceCommand = useCallback((command: string) => {
    console.log('Voice command received:', command);
    
    // Navigation commands
    if (command.includes('go to') || command.includes('show')) {
      let page = command.replace('go to', '').replace('show', '').trim();
      
      // Map command words to actual routes
      const routeMap: Record<string, string> = {
        'dashboard': '/dashboard',
        'encryption': '/encryption',
        'decryption': '/decryption',
        'hashing': '/hashing',
        'key generator': '/key-generator',
        'keys': '/key-generator',
        'digital signature': '/digital-signature',
        'signatures': '/digital-signature',
        'logs': '/logs',
        'settings': '/settings',
        'help': '/help',
        'about': '/about'
      };
      
      // Find matching route
      const route = Object.entries(routeMap).find(([key]) => page.includes(key));
      
      if (route) {
        navigate(route[1]);
        toast({
          title: 'Navigating',
          description: `Going to ${route[0]}`
        });
      }
    }
    
    // Theme commands
    else if (command.includes('dark mode') || command.includes('light mode') || command.includes('system theme')) {
      if (command.includes('dark mode')) {
        setTheme('dark');
        toast({
          title: 'Theme Changed',
          description: 'Switched to dark mode'
        });
      } else if (command.includes('light mode')) {
        setTheme('light');
        toast({
          title: 'Theme Changed',
          description: 'Switched to light mode'
        });
      } else if (command.includes('system theme')) {
        setTheme('system');
        toast({
          title: 'Theme Changed',
          description: 'Using system theme preference'
        });
      }
    }
    
    // Toggle theme
    else if (command.includes('toggle theme') || command.includes('toggle dark mode')) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      toast({
        title: 'Theme Toggled',
        description: `Switched to ${theme === 'dark' ? 'light' : 'dark'} mode`
      });
    }
    
    // UI control
    else if (command.includes('sidebar')) {
      if (onToggleSidebar) {
        onToggleSidebar();
        toast({
          title: 'Sidebar Toggled',
          description: command.includes('open') ? 'Opened sidebar' : 'Closed sidebar'
        });
      }
    }
    
    // Accessibility panel
    else if (command.includes('toggle accessibility')) {
      setOpen(!open);
    }
    
    // Other commands can be handled here
    
  }, [navigate, onToggleSidebar, setTheme, theme, toast, open]);

  const { 
    isListening, 
    toggleListening, 
    startListening, 
    stopListening,
    supported 
  } = useVoiceRecognition({ 
    onCommand: handleVoiceCommand,
    enabled: accessibilitySettings.voiceCommands
  });

  // Update voice recognition state when voiceCommands setting changes
  useEffect(() => {
    if (!accessibilitySettings.voiceCommands && isListening) {
      stopListening();
    }
  }, [accessibilitySettings.voiceCommands, isListening, stopListening]);

  return (
    <>
      {/* Floating action button for quick access */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-4">
        {/* Voice commands toggle button */}
        {accessibilitySettings.voiceCommands && supported && (
          <Button 
            variant={isListening ? "default" : "outline"}
            size="icon"
            className={`rounded-full shadow-lg ${isListening ? 'animate-pulse bg-primary' : 'bg-white dark:bg-slate-800'}`}
            onClick={toggleListening}
            aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
          >
            {isListening ? (
              <Mic className="h-5 w-5" />
            ) : (
              <MicOff className="h-5 w-5" />
            )}
          </Button>
        )}
        
        {/* Main accessibility button */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full shadow-lg bg-white dark:bg-slate-800"
              aria-label="Accessibility options"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Accessibility Settings</SheetTitle>
              <SheetDescription>
                Customize your experience with these accessibility features
              </SheetDescription>
            </SheetHeader>
            
            <ScrollArea className="h-[calc(100vh-12rem)] pr-4 mt-6">
              <div className="space-y-6">
                {/* Visual settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Visual</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="high-contrast">High Contrast</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase contrast for better readability
                      </p>
                    </div>
                    <Switch
                      id="high-contrast"
                      checked={accessibilitySettings.highContrast}
                      onCheckedChange={(checked) => {
                        setAccessibilitySettings(prev => ({...prev, highContrast: checked}));
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="large-text">Larger Text</Label>
                      <p className="text-sm text-muted-foreground">
                        Increase text size throughout the application
                      </p>
                    </div>
                    <Switch
                      id="large-text"
                      checked={accessibilitySettings.largeText}
                      onCheckedChange={(checked) => {
                        setAccessibilitySettings(prev => ({...prev, largeText: checked}));
                      }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reduced-motion">Reduced Motion</Label>
                      <p className="text-sm text-muted-foreground">
                        Minimize animations and transitions
                      </p>
                    </div>
                    <Switch
                      id="reduced-motion"
                      checked={accessibilitySettings.reducedMotion}
                      onCheckedChange={(checked) => {
                        setAccessibilitySettings(prev => ({...prev, reducedMotion: checked}));
                      }}
                    />
                  </div>
                </div>
                
                <Separator />
                
                {/* Voice Commands */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Voice Commands</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="voice-commands">Enable Voice Commands</Label>
                      <p className="text-sm text-muted-foreground">
                        Control the application using voice instructions
                      </p>
                    </div>
                    <Switch
                      id="voice-commands"
                      checked={accessibilitySettings.voiceCommands}
                      onCheckedChange={(checked) => {
                        setAccessibilitySettings(prev => ({...prev, voiceCommands: checked}));
                        
                        if (!checked && isListening) {
                          stopListening();
                        }
                        
                        toast({
                          title: `Voice Commands ${checked ? 'Enabled' : 'Disabled'}`,
                          description: checked 
                            ? "You can now control the app with your voice" 
                            : "Voice command feature has been turned off"
                        });
                      }}
                    />
                  </div>
                  
                  {accessibilitySettings.voiceCommands && (
                    <>
                      <div className="rounded-md bg-secondary p-4">
                        <div className="flex items-center">
                          {supported ? (
                            <>
                              <div className="mr-3">
                                {isListening ? (
                                  <Mic className="h-5 w-5 text-green-500 animate-pulse" />
                                ) : (
                                  <MicOff className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">
                                  {isListening 
                                    ? "Listening for commands..." 
                                    : "Voice recognition is ready"}
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {isListening
                                    ? "Speak clearly. Try saying 'go to dashboard' or 'toggle dark mode'"
                                    : "Click the microphone button to start listening for commands"}
                                </p>
                              </div>
                              <Button
                                variant={isListening ? "destructive" : "default"}
                                size="sm"
                                className="ml-auto"
                                onClick={toggleListening}
                              >
                                {isListening ? "Stop" : "Start"}
                              </Button>
                            </>
                          ) : (
                            <>
                              <VolumeX className="h-5 w-5 text-destructive mr-3" />
                              <div>
                                <p className="text-sm font-medium">
                                  Voice Recognition Not Available
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Your browser doesn't support the speech recognition API
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4">
                        <Accordion type="single" collapsible>
                          <AccordionItem value="commands">
                            <AccordionTrigger>Available Voice Commands</AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Navigation</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">go to dashboard</Badge>
                                    <Badge variant="outline">show encryption</Badge>
                                    <Badge variant="outline">go to hashing</Badge>
                                    <Badge variant="outline">show settings</Badge>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Theme</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">switch to dark mode</Badge>
                                    <Badge variant="outline">switch to light mode</Badge>
                                    <Badge variant="outline">toggle theme</Badge>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">Actions</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">encrypt</Badge>
                                    <Badge variant="outline">decrypt</Badge>
                                    <Badge variant="outline">hash</Badge>
                                    <Badge variant="outline">generate key</Badge>
                                    <Badge variant="outline">clear input</Badge>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-sm font-medium mb-2">UI Control</h4>
                                  <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">open sidebar</Badge>
                                    <Badge variant="outline">close sidebar</Badge>
                                    <Badge variant="outline">toggle accessibility</Badge>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </>
                  )}
                </div>
                
                <Separator />
                
                {/* Screen Reader */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Screen Reader</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="screen-reader">Text-to-Speech Feedback</Label>
                      <p className="text-sm text-muted-foreground">
                        Read notifications and results aloud
                      </p>
                    </div>
                    <Switch
                      id="screen-reader"
                      checked={accessibilitySettings.screenReader}
                      onCheckedChange={(checked) => {
                        setAccessibilitySettings(prev => ({...prev, screenReader: checked}));
                        
                        if (checked && 'speechSynthesis' in window) {
                          const utterance = new SpeechSynthesisUtterance(
                            "Screen reader activated. I will read important information aloud."
                          );
                          window.speechSynthesis.speak(utterance);
                        }
                      }}
                    />
                  </div>
                  
                  {accessibilitySettings.screenReader && (
                    <div className="rounded-md bg-secondary p-4">
                      <div className="flex items-center">
                        {'speechSynthesis' in window ? (
                          <>
                            <Volume2 className="h-5 w-5 text-green-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium">
                                Text-to-Speech is active
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Important notifications will be read aloud
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-auto"
                              onClick={() => {
                                if ('speechSynthesis' in window) {
                                  const utterance = new SpeechSynthesisUtterance(
                                    "This is a test of the text to speech system. If you can hear this, it's working correctly."
                                  );
                                  window.speechSynthesis.speak(utterance);
                                }
                              }}
                            >
                              Test
                            </Button>
                          </>
                        ) : (
                          <>
                            <VolumeX className="h-5 w-5 text-destructive mr-3" />
                            <div>
                              <p className="text-sm font-medium">
                                Text-to-Speech Not Available
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Your browser doesn't support the speech synthesis API
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                {/* Keyboard Shortcuts */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Keyboard Shortcuts</h3>
                  
                  <div className="rounded-md border p-4">
                    <div className="grid grid-cols-2 gap-y-3">
                      <div className="flex items-center">
                        <Badge variant="outline" className="w-16 flex justify-center">Alt+D</Badge>
                        <span className="ml-3 text-sm">Dashboard</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="w-16 flex justify-center">Alt+E</Badge>
                        <span className="ml-3 text-sm">Encryption</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="w-16 flex justify-center">Alt+H</Badge>
                        <span className="ml-3 text-sm">Hashing</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="w-16 flex justify-center">Alt+K</Badge>
                        <span className="ml-3 text-sm">Key Generator</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="w-16 flex justify-center">Alt+S</Badge>
                        <span className="ml-3 text-sm">Settings</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="w-16 flex justify-center">Alt+T</Badge>
                        <span className="ml-3 text-sm">Toggle Theme</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="w-16 flex justify-center">Alt+V</Badge>
                        <span className="ml-3 text-sm">Voice Commands</span>
                      </div>
                      <div className="flex items-center">
                        <Badge variant="outline" className="w-16 flex justify-center">Alt+A</Badge>
                        <span className="ml-3 text-sm">Accessibility</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            
            <SheetFooter className="mt-6">
              <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Keyboard listener for shortcuts */}
      <KeyboardShortcuts 
        onToggleAccessibility={() => setOpen(!open)} 
        onToggleVoice={() => {
          if (accessibilitySettings.voiceCommands && supported) {
            toggleListening();
          }
        }}
        onToggleSidebar={onToggleSidebar}
      />
    </>
  );
};

// Component to handle keyboard shortcuts
const KeyboardShortcuts: React.FC<{
  onToggleAccessibility: () => void;
  onToggleVoice: () => void;
  onToggleSidebar?: () => void;
}> = ({ onToggleAccessibility, onToggleVoice, onToggleSidebar }) => {
  const [, navigate] = useLocation();
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only activate when Alt key is pressed
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case 'a':
            onToggleAccessibility();
            break;
          case 'v':
            onToggleVoice();
            break;
          case 'd':
            navigate('/dashboard');
            break;
          case 'e':
            navigate('/encryption');
            break;
          case 'h':
            navigate('/hashing');
            break;
          case 'k':
            navigate('/key-generator');
            break;
          case 's':
            navigate('/settings');
            break;
          case 't':
            setTheme(theme === 'dark' ? 'light' : 'dark');
            break;
          case 'b':
            if (onToggleSidebar) onToggleSidebar();
            break;
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, onToggleAccessibility, onToggleVoice, onToggleSidebar, theme, setTheme]);
  
  return null; // This component doesn't render anything
};

export default AccessibilityFab;