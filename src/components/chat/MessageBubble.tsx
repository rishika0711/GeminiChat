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
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fadeIn`}
      onMouseEnter={() => setShowCopyButton(true)}
      onMouseLeave={() => setShowCopyButton(false)}
    >
      <div className={`flex items-end space-x-3 max-w-[85%] sm:max-w-md lg:max-w-lg xl:max-w-xl ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
          isUser 
            ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
            : 'bg-gradient-to-r from-purple-500 to-purple-600'
        }`}>
          {isUser ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
        </div>
        
        <div className="relative group flex-1 min-w-0">
          <div className={`px-5 py-3 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl break-words ${
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md border border-gray-200 dark:border-gray-700'
          }`}>
            {message.image && (
              <img
                src={message.image}
                alt="Shared image"
                className="max-w-full h-auto rounded-xl mb-3 shadow-md"
              />
            )}
            <p className="whitespace-pre-wrap break-words leading-relaxed word-break">{message.content}</p>
            
            <div className={`flex items-center justify-between mt-2 text-xs opacity-70 ${
              isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              <span>{formatTime(message.timestamp)}</span>
              {!isUser && (
                <div className="flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span className="text-purple-400 font-medium">Gemini</span>
                </div>
              )}
            </div>
          </div>
          
          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={`absolute top-2 ${
                isUser ? 'left-2' : 'right-2'
              } p-2 rounded-xl bg-gray-800/80 hover:bg-gray-700/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm z-10`}
              title="Copy message"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};