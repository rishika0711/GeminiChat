import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end space-x-3 mb-6 animate-fadeIn">
      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-bl-md px-5 py-3 shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Gemini is thinking</span>
          </div>
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};