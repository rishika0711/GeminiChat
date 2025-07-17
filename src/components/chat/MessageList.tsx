import React, { useEffect, useRef, useState } from 'react';
import { ChevronUp, Bot, Sparkles, MessageCircle } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';

export const MessageList: React.FC = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    currentChatroom,
    messages,
    isTyping,
    loadMoreMessages,
  } = useChatStore();

  const currentMessages = messages.filter(msg => msg.chatroomId === currentChatroom?.id);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToBottomImmediate = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  // Auto scroll to bottom when new messages arrive or typing starts
  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [currentMessages.length, isTyping, isAtBottom]);

  // Scroll to bottom immediately when chatroom changes
  useEffect(() => {
    if (currentChatroom) {
      setTimeout(() => scrollToBottomImmediate(), 100);
      setIsAtBottom(true);
    }
  }, [currentChatroom?.id]);

  const handleLoadMore = async () => {
    if (!currentChatroom || isLoadingMore || !canLoadMore) return;

    setIsLoadingMore(true);
    try {
      const prevScrollHeight = containerRef.current?.scrollHeight || 0;
      
      await loadMoreMessages(currentChatroom.id);
      
      // Maintain scroll position after loading more messages
      setTimeout(() => {
        if (containerRef.current) {
          const newScrollHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newScrollHeight - prevScrollHeight;
        }
      }, 100);
      
      // Simulate reaching the end after a few loads
      if (currentMessages.length > 30) {
        setCanLoadMore(false);
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Check if user is at the bottom (within 100px threshold)
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setIsAtBottom(isNearBottom);
    
    // Load more messages when scrolled to top
    if (scrollTop === 0 && canLoadMore && !isLoadingMore) {
      handleLoadMore();
    }
  };

  if (!currentChatroom) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <MessageCircle className="w-10 h-10 text-blue-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Welcome to Gemini Chat
          </h3>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Select a conversation to start chatting with AI, or create a new one to begin your journey.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-purple-500">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">Powered by Advanced AI</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200/50 dark:border-gray-700/50 p-3 sm:p-4 lg:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {currentChatroom.title}
            </h2>
            <div className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-500" />
              <span>AI-powered conversation</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Messages Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 space-y-3 sm:space-y-4 min-h-0"
        style={{ scrollBehavior: 'smooth' }}
      >
        {isLoadingMore && (
          <div className="flex justify-center py-2 sm:py-4">
            <LoadingSkeleton variant="message" count={3} />
          </div>
        )}
        
        {!canLoadMore && currentMessages.length > 0 && (
          <div className="text-center py-2 sm:py-4">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 inline-block backdrop-blur-sm">
              Beginning of conversation
            </p>
          </div>
        )}
        
        {currentMessages.length === 0 && !isLoadingMore && (
          <div className="text-center py-8 sm:py-12">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3">
              Start a conversation
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-xs sm:max-w-sm mx-auto leading-relaxed text-sm sm:text-base px-4">
              Send a message to begin chatting with Gemini AI. Ask questions, get help, or just have a conversation!
            </p>
          </div>
        )}
        
        {currentMessages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        
        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {!isAtBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 sm:bottom-6 right-3 sm:right-6 p-2 sm:p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 z-10"
        >
          <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
        </button>
      )}
    </div>
  );
};