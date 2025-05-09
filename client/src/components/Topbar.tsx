import React, { useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { useLocation } from 'wouter';
import { 
  Menu, 
  Search,
  Sun,
  Moon,
  Bell,
  User,
  Settings,
  LogOut,
  Info,
  Clock,
  CheckCircle,
  ShieldAlert,
  MessageCircle
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TopbarProps {
  toggleSidebar: () => void;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

const Topbar = ({ toggleSidebar }: TopbarProps) => {
  const { theme, setTheme } = useTheme();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Demo notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Key Generated',
      description: 'Your new RSA-2048 key pair has been created successfully.',
      time: '10 min ago',
      type: 'success',
      read: false
    },
    {
      id: 2,
      title: 'Security Alert',
      description: 'Remember to store your keys in a secure location.',
      time: '1 hour ago',
      type: 'warning',
      read: false
    },
    {
      id: 3,
      title: 'Hash Operation Completed',
      description: 'SHA-256 hash of your file has been computed.',
      time: '2 hours ago',
      type: 'info',
      read: true
    }
  ]);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    toast({
      title: `${theme === 'dark' ? 'Light' : 'Dark'} mode activated`,
      description: `Switched to ${theme === 'dark' ? 'light' : 'dark'} theme`,
    });
  };
  
  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    toast({
      title: "Notifications cleared",
      description: "All notifications marked as read",
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  const getNotificationIcon = (type: 'info' | 'success' | 'warning') => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ShieldAlert className="h-5 w-5 text-amber-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
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
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="p-1 rounded-full text-slate-400 hover:text-slate-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {theme === 'dark' ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </Button>
          
          {/* Notification bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-6 w-6 text-slate-400 hover:text-slate-500 dark:hover:text-white" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute top-0 right-0 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.preventDefault();
                      markAllAsRead();
                    }}
                    className="h-auto py-1 px-2 text-xs"
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {notifications.length === 0 ? (
                <div className="py-4 px-2 text-center text-sm text-slate-500 dark:text-slate-400">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                <>
                  {notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.id} 
                      className={`flex flex-col items-start py-3 px-4 focus:bg-slate-50 dark:focus:bg-slate-800 cursor-pointer ${notification.read ? 'opacity-70' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex w-full">
                        <div className="flex-shrink-0 mr-3 mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 mr-3">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{notification.description}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center text-xs text-slate-400">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {notification.time}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="w-full flex justify-end mt-2">
                          <Badge variant="outline" className="text-xs">New</Badge>
                        </div>
                      )}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem className="flex items-center justify-center py-2 text-primary-600 dark:text-primary-400 text-sm">
                    View all notifications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar>
                  <AvatarImage src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Alice Smith</p>
                  <p className="text-xs leading-none text-slate-500 dark:text-slate-400">alice@cryptovault.example.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast({ title: "Profile", description: "Profile page not implemented yet" })}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
