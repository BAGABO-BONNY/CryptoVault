import { useState, useEffect, useRef, useCallback } from 'react';
import { useToast } from './use-toast';

interface UseVoiceRecognitionProps {
  onCommand?: (command: string) => void;
  commands?: string[];
  continuous?: boolean;
  language?: string;
  enabled?: boolean;
}

// TypeScript definitions for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }

  // Define the SpeechRecognition and related interfaces if they don't exist
  class SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    abort(): void;
    start(): void;
    stop(): void;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    error: string;
    message: string;
  }

  interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
    readonly isFinal: boolean;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }
}

interface VoiceRecognitionState {
  isListening: boolean;
  transcript: string;
  error: string | null;
  recognition: SpeechRecognition | null;
}

// Supported commands for the application
export const VOICE_COMMANDS = [
  // Navigation commands
  'go to dashboard',
  'go to encryption',
  'go to decryption',
  'go to hashing',
  'go to key generator',
  'go to digital signature',
  'go to logs',
  'go to settings',
  'go to help',
  'go to about',
  'show dashboard',
  'show encryption',
  'show decryption',
  'show hashing',
  'show keys',
  'show signatures',
  'show logs',
  'show settings',
  'show help',
  
  // Theme commands
  'switch to dark mode',
  'switch to light mode',
  'use system theme',
  'toggle dark mode',
  'toggle theme',
  
  // Action commands
  'encrypt',
  'decrypt',
  'hash',
  'generate key',
  'sign',
  'verify',
  'clear input',
  'clear output',
  'copy output',
  'save output',
  'download',
  
  // UI control
  'open sidebar',
  'close sidebar',
  'show notifications',
  'clear notifications',
  'toggle accessibility',
  'help',
];

export const useVoiceRecognition = ({
  onCommand,
  commands = VOICE_COMMANDS,
  continuous = false,
  language = 'en-US', 
  enabled = true,
}: UseVoiceRecognitionProps = {}) => {
  const [state, setState] = useState<VoiceRecognitionState>({
    isListening: false,
    transcript: '',
    error: null,
    recognition: null,
  });
  const { toast } = useToast();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const commandsRef = useRef<string[]>(commands);
  
  // Update commands ref when commands prop changes
  useEffect(() => {
    commandsRef.current = commands;
  }, [commands]);
  
  // Initialize speech recognition
  useEffect(() => {
    if (!enabled) return;
    
    // Check browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setState(prev => ({
        ...prev,
        error: 'Speech recognition is not supported in this browser.'
      }));
      return;
    }
    
    // Create recognition instance
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    // Configure
    recognition.continuous = continuous;
    recognition.interimResults = false;
    recognition.lang = language;
    
    // Set up handlers
    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, error: null }));
    };
    
    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };
    
    recognition.onerror = (event: any) => {
      setState(prev => ({ ...prev, error: event.error || 'Unknown error' }));
      
      if (event.error === 'not-allowed') {
        toast({
          title: 'Microphone Access Denied',
          description: 'Please enable microphone access to use voice commands.',
          variant: 'destructive',
        });
      }
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      setState(prev => ({ ...prev, transcript }));
      
      // Process command
      processCommand(transcript);
    };
    
    setState(prev => ({ ...prev, recognition }));
    
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current && state.isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [enabled, continuous, language, toast]);
  
  // Find the best matching command
  const findBestMatch = useCallback((transcript: string): string | null => {
    // Check for exact matches first
    const exactMatch = commandsRef.current.find(
      cmd => transcript === cmd.toLowerCase()
    );
    
    if (exactMatch) return exactMatch;
    
    // Check if the transcript includes any of our commands
    for (const cmd of commandsRef.current) {
      if (transcript.includes(cmd.toLowerCase())) {
        return cmd;
      }
    }
    
    // If no exact or included match, check for semantic similarity
    // This is a simple check - could be improved with fuzzy matching algorithms
    for (const cmd of commandsRef.current) {
      const cmdWords = cmd.toLowerCase().split(' ');
      const transcriptWords = transcript.split(' ');
      
      // Check if all command words appear in the transcript
      const allWordsMatch = cmdWords.every(word => 
        transcriptWords.some(tw => tw === word || tw.includes(word))
      );
      
      if (allWordsMatch) return cmd;
    }
    
    return null;
  }, []);
  
  // Process command
  const processCommand = useCallback((transcript: string) => {
    const matchedCommand = findBestMatch(transcript);
    
    if (matchedCommand) {
      // Here we're just calling the onCommand callback with the matched command
      if (onCommand) {
        onCommand(matchedCommand);
      }
      
      toast({
        title: 'Voice Command Recognized',
        description: `Executing: "${matchedCommand}"`,
        duration: 3000,
      });
    } else {
      // No matching command found
      toast({
        title: 'Unknown Command',
        description: `Couldn't recognize: "${transcript}"`,
        variant: 'destructive',
        duration: 3000,
      });
    }
  }, [findBestMatch, onCommand, toast]);
  
  // Start listening
  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (state.isListening) return;
    
    try {
      recognitionRef.current.start();
      toast({
        title: 'Listening for commands',
        description: 'Speak clearly into your microphone',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      setState(prev => ({ 
        ...prev, 
        error: 'Failed to start speech recognition.' 
      }));
    }
  }, [state.isListening, toast]);
  
  // Stop listening
  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (!state.isListening) return;
    
    try {
      recognitionRef.current.stop();
      toast({
        title: 'Voice recognition stopped',
        description: 'No longer listening for commands',
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to stop speech recognition:', error);
    }
  }, [state.isListening, toast]);
  
  // Toggle listening
  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);
  
  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
    commandsRef,
    supported: !!state.recognition,
  };
};