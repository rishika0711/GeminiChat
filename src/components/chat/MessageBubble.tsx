import React, { useState } from 'react';
import { Copy, Check, User, Bot, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Message } from '../../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  const [showCopyButton, setShowCopyButton] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success('Message copied to clipboard');
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy message');
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const isUser = message.sender === 'user';

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 sm:mb-6 animate-fadeIn`}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
    >
      <div className={`flex items-end space-x-2 sm:space-x-3 max-w-[90%] sm:max-w-[85%] md:max-w-md lg:max-w-lg xl:max-w-xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
            : 'bg-gradient-to-r from-purple-500 to-purple-600'
        }`}>
          {isUser ? <User className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" /> : <Bot className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />}
        </div>
        
        <div className="relative group flex-1 min-w-0">
          <div className={`px-3 py-2 sm:px-4 sm:py-3 lg:px-5 lg:py-3 rounded-xl sm:rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl break-words ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-700'
          }`}>
            {message.image && (
              <img
                src={message.image}
                alt="Shared image"
                className="max-w-full h-auto rounded-lg sm:rounded-xl mb-2 sm:mb-3 shadow-md"
              />
            )}
            <p className="whitespace-pre-wrap break-words leading-relaxed word-break text-sm sm:text-base">{message.content}</p>
            
            <div className={`flex items-center justify-between mt-1.5 sm:mt-2 text-xs opacity-70 ${
              isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span className="text-xs">{formatTime(message.timestamp)}</span>
              {!isUser && (
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-400" />
                  <span className="text-purple-400 font-medium text-xs">Gemini</span>
                </div>
              )}
            </div>
          </div>
          
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={`absolute top-1.5 sm:top-2 ${
                isUser ? 'left-1.5 sm:left-2' : 'right-1.5 sm:right-2'
              } p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-gray-800/80 hover:bg-gray-700/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm z-10`}
              title="Copy message"
            >
              {copied ? <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};