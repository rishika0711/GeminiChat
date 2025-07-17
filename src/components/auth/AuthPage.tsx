import React, { useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { LoginForm } from './LoginForm';
import { OTPForm } from './OTPForm';
import { Moon, Sun, MessageCircle, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { otpSent } = useAuthStore();
  const { darkMode, toggleDarkMode } = useUIStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center p-3 sm:p-4 lg:p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 h-40 sm:w-80 sm:h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 h-40 sm:w-80 sm:h-80 bg-yellow-300 dark:bg-yellow-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-20 sm:top-40 left-20 sm:left-40 w-40 h-40 sm:w-80 sm:h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute top-3 right-3 sm:top-6 sm:right-6">
        <button
          onClick={toggleDarkMode}
          className="p-2 sm:p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          )}
        </button>
      </div>
      
      <div className="w-full max-w-sm sm:max-w-md relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20 dark:border-gray-700/20">
          {/* Logo and branding */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 shadow-lg">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-2">
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Gemini Chat
              </h1>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 animate-pulse" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
              Experience the future of AI conversation
            </p>
          </div>

          {otpSent ? <OTPForm /> : <LoginForm />}
        </div>
      </div>
    </div>
  );
};