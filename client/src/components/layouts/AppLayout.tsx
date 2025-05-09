import React, { useState, ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import AccessibilityPanel from '@/components/AccessibilityPanel';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />
        
        {/* Main scrollable content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 p-4 md:p-6">
          {children}
        </main>
      </div>
      
      {/* Accessibility Features */}
      <AccessibilityPanel onToggleSidebar={toggleSidebar} />
    </div>
  );
}
