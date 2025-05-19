import React from 'react';
import { Link, useLocation } from 'wouter';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/hooks/use-language';
import { 
  Home, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Key, 
  FileSignature, 
  List, 
  Settings, 
  HelpCircle, 
  Info,
  LayoutDashboard,
  Users,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [location] = useLocation();
  const { t } = useLanguage();
  
  // Helper to check if a link is active
  const isActive = (path: string) => {
    if (path === '/dashboard' && location === '/') return true;
    return location === path;
  };
  
  return (
    <>
      {/* Desktop sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm md:static md:block",
        isOpen ? "block" : "hidden"
      )}>
        <div className="p-4 flex items-center border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <span className="text-xl font-bold text-slate-900 dark:text-white">CryptoVault</span>
          </div>
          
          {/* Close button (mobile only) */}
          <button 
            className="ml-auto text-slate-500 hover:text-slate-600 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <ScrollArea className="flex-1 h-[calc(100vh-4rem)]">
          <nav className="p-4" data-component="sidebar-navigation">
            <ul className="space-y-1">
              <li>
                <Link href="/" className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive("/") 
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                )}>
                  <Home className="h-5 w-5 mr-3" />
                  {t('home')}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                  isActive("/dashboard") 
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                )}>
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  {t('dashboard')}
                </Link>
              </li>
              
              <li className="mt-6">
                <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {t('cryptographyTools')}
                </h3>
                <div className="mt-2 space-y-1">
                  <Link href="/encryption" className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/encryption") 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  )}>
                    <Lock className="h-5 w-5 mr-3 text-slate-400" />
                    {t('encryption')}
                  </Link>
                  
                  <Link href="/decryption" className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/decryption") 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  )}>
                    <Unlock className="h-5 w-5 mr-3 text-slate-400" />
                    {t('decryption')}
                  </Link>
                  
                  <Link href="/hashing" className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/hashing") 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  )}>
                    <ShieldCheck className="h-5 w-5 mr-3 text-slate-400" />
                    {t('hashing')}
                  </Link>
                  
                  <Link href="/key-generator" className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/key-generator") 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  )}>
                    <Key className="h-5 w-5 mr-3 text-slate-400" />
                    {t('keyGenerator')}
                  </Link>
                  
                  <Link href="/digital-signature" className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/digital-signature") 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  )}>
                    <FileSignature className="h-5 w-5 mr-3 text-slate-400" />
                    {t('digitalSignature')}
                  </Link>
                </div>
              </li>
              
              <li className="mt-6">
                <h3 className="px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Application
                </h3>
                <div className="mt-2 space-y-1">
                  <Link href="/logs" className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/logs") 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  )}>
                    <List className="h-5 w-5 mr-3 text-slate-400" />
                    {t('logs')}
                  </Link>
                  
                  <Link href="/settings" className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/settings") 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  )}>
                    <Settings className="h-5 w-5 mr-3 text-slate-400" />
                    {t('settings')}
                  </Link>
                  
                  <Link href="/help" className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/help") 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  )}>
                    <HelpCircle className="h-5 w-5 mr-3 text-slate-400" />
                    {t('help')}
                  </Link>
                  
                  <Link href="/about" className={cn(
                    "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                    isActive("/about") 
                      ? "bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-100" 
                      : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700"
                  )}>
                    <Info className="h-5 w-5 mr-3 text-slate-400" />
                    {t('about')}
                  </Link>
                </div>
              </li>
            </ul>
          </nav>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;
