import React from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { 
  Menu, 
  Search,
  Sun,
  Moon,
  Bell
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';

interface TopbarProps {
  toggleSidebar: () => void;
}

const Topbar = ({ toggleSidebar }: TopbarProps) => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Mobile menu button */}
        <button 
          type="button" 
          className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        {/* Search bar */}
        <div className="flex-1 mx-4 md:mx-8">
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              type="search" 
              placeholder="Search..." 
              className="pl-9 h-9" 
            />
          </div>
        </div>
        
        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          {/* Theme switch */}
          <button 
            type="button" 
            onClick={toggleTheme} 
            className="p-1 rounded-full text-slate-400 hover:text-slate-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>
          
          {/* Notification bell */}
          <button 
            type="button" 
            className="p-1 rounded-full text-slate-400 hover:text-slate-500 dark:hover:text-white relative"
          >
            <Bell className="h-6 w-6" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          {/* Profile dropdown */}
          <div className="relative">
            <button 
              type="button" 
              className="flex items-center max-w-xs bg-white dark:bg-slate-800 rounded-full focus:outline-none"
            >
              <Avatar>
                <AvatarImage src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
