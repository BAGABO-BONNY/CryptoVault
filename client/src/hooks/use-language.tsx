import { createContext, useState, useContext, ReactNode, useEffect } from "react";

// Define available languages
export type Language = 'en' | 'fr' | 'es' | 'de' | 'zh';

// Map of languages to their display names
export const LANGUAGES = {
  'en': 'English',
  'fr': 'Français',
  'es': 'Español',
  'de': 'Deutsch',
  'zh': '中文'
};

// Language options with flags for the dropdown
export const LANGUAGE_OPTIONS = [
  { value: 'en' as Language, label: 'English', flag: '🇺🇸' },
  { value: 'fr' as Language, label: 'Français', flag: '🇫🇷' },
  { value: 'es' as Language, label: 'Español', flag: '🇪🇸' },
  { value: 'de' as Language, label: 'Deutsch', flag: '🇩🇪' },
  { value: 'zh' as Language, label: '中文', flag: '🇨🇳' }
];

// Mock translations - in a real app, this would be loaded from separate files
const translations = {
  en: {
    dashboard: 'Dashboard',
    encryption: 'Encryption',
    decryption: 'Decryption',
    hashing: 'Hashing',
    keyGenerator: 'Key Generator',
    digitalSignature: 'Digital Signature',
    welcome: 'Welcome',
    settings: 'Settings',
    profile: 'Profile',
    logout: 'Logout',
    signIn: 'Sign In',
    login: 'Login',
    register: 'Register',
    about: 'About',
    help: 'Help',
    home: 'Home'
  },
  fr: {
    dashboard: 'Tableau de Bord',
    encryption: 'Chiffrement',
    decryption: 'Déchiffrement',
    hashing: 'Hachage',
    keyGenerator: 'Générateur de Clés',
    digitalSignature: 'Signature Numérique',
    welcome: 'Bienvenue',
    settings: 'Paramètres',
    profile: 'Profil',
    logout: 'Déconnexion',
    signIn: 'Se Connecter',
    login: 'Connexion',
    register: 'S\'inscrire',
    about: 'À Propos',
    help: 'Aide',
    home: 'Accueil'
  },
  es: {
    dashboard: 'Panel',
    encryption: 'Cifrado',
    decryption: 'Descifrado',
    hashing: 'Hashing',
    keyGenerator: 'Generador de Claves',
    digitalSignature: 'Firma Digital',
    welcome: 'Bienvenido',
    settings: 'Configuración',
    profile: 'Perfil',
    logout: 'Cerrar Sesión',
    signIn: 'Iniciar Sesión',
    login: 'Acceso',
    register: 'Registrarse',
    about: 'Acerca de',
    help: 'Ayuda',
    home: 'Inicio'
  },
  de: {
    dashboard: 'Dashboard',
    encryption: 'Verschlüsselung',
    decryption: 'Entschlüsselung',
    hashing: 'Hashing',
    keyGenerator: 'Schlüsselgenerator',
    digitalSignature: 'Digitale Signatur',
    welcome: 'Willkommen',
    settings: 'Einstellungen',
    profile: 'Profil',
    logout: 'Abmelden',
    signIn: 'Anmelden',
    login: 'Login',
    register: 'Registrieren',
    about: 'Über',
    help: 'Hilfe',
    home: 'Startseite'
  },
  zh: {
    dashboard: '仪表板',
    encryption: '加密',
    decryption: '解密',
    hashing: '哈希',
    keyGenerator: '密钥生成器',
    digitalSignature: '数字签名',
    welcome: '欢迎',
    settings: '设置',
    profile: '个人资料',
    logout: '登出',
    signIn: '登录',
    login: '登录',
    register: '注册',
    about: '关于',
    help: '帮助',
    home: '首页'
  }
};

// Context type definition
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

// Create context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Get saved language from localStorage or default to English
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('crypto-language');
    return (savedLang as Language) || 'en';
  });

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('crypto-language', language);
    // Update html lang attribute for accessibility
    document.documentElement.lang = language;
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    // @ts-ignore - we know our translations object structure
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}