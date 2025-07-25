import React from 'react';
import { LogOut, Moon, Sun, Plus, MessageCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { Button } from '../ui/Button';

interface HeaderProps {
  onCreateChatroom: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onCreateChatroom }) => {
  const { user, logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gemini Chat
              </h1>
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500 animate-pulse" />
            </div>
          </div>
          
          <Button
            onClick={onCreateChatroom}
            size="sm"
            className="hidden md:flex text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            New Chat
          </Button>
        </div>
        
        <div className="flex items-center space-x-1.5 sm:space-x-2 lg:space-x-3">
          <Button
            onClick={onCreateChatroom}
            size="sm"
            className="md:hidden p-2"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <button
            onClick={toggleDarkMode}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110"
            title="Toggle theme"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
          
          <button
            onClick={handleLogout}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-600 hover:text-red-700 transform hover:scale-110"
            title="Logout"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};