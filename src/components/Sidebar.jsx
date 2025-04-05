import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const Sidebar = ({ user, onLogout, activeTab, setActiveTab }) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar content */}
      <div className="p-4 border-b border-gray-200 flex items-center space-x-2">
        <img src="/logo.svg" alt="Malabar Eco" className="h-8" />
        <h1 className="text-xl font-bold">Malabar Eco</h1>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {/* Navigation items */}
        <div className="space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            ) },
            // Add other navigation items here
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (isMobile) setSidebarOpen(false);
              }}
              className={`w-full flex items-center rounded-lg transition-colors duration-200 px-3 py-2 ${activeTab === item.id ? 'bg-green-600 text-white' : 'text-gray-700 hover:text-green-600 hover:bg-gray-100'}`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="ml-3 font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        {/* User profile */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1">
              <div className="font-medium">{user?.name || 'User'}</div>
              <div className="text-xs text-gray-500">Admin</div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;