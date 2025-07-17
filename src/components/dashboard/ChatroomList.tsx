import React, { useMemo } from 'react';
import { MessageCircle, Trash2, Clock, Bot, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useChatStore } from '../../stores/chatStore';
import { useDebounce } from '../../hooks/useDebounce';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import { clearConversationHistory } from '../../utils/aiService';
import { Chatroom } from '../../types';

interface ChatroomListProps {
  loading?: boolean;
}

export const ChatroomList: React.FC<ChatroomListProps> = ({ loading = false }) => {
  const {
    chatrooms,
    currentChatroom,
    searchQuery,
    setCurrentChatroom,
    deleteChatroom,
    setMessages,
  } = useChatStore();
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredChatrooms = useMemo(() => {
    if (!debouncedSearchQuery) return chatrooms;
    
    return chatrooms.filter(chatroom =>
      chatroom.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [chatrooms, debouncedSearchQuery]);

  const handleChatroomClick = (chatroom: Chatroom) => {
    setCurrentChatroom(chatroom);
    
    // Clear conversation history when switching chatrooms for fresh context
    clearConversationHistory();
    
    // Load messages for this chatroom
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      const allMessages = JSON.parse(savedMessages);
      const chatroomMessages = allMessages.filter((msg: any) => msg.chatroomId === chatroom.id);
      setMessages(chatroomMessages);
    }
  };

  const handleDeleteChatroom = (e: React.MouseEvent, chatroomId: string) => {
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this conversation?')) {
      deleteChatroom(chatroomId);
      toast.success('Conversation deleted successfully');
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return <LoadingSkeleton variant="chatroom" count={5} />;
  }

  if (filteredChatrooms.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {searchQuery ? 'No conversations found' : 'Start your first conversation'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm px-4">
          {searchQuery ? 'Try a different search term' : 'Create a new chat to begin talking with Gemini AI'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 sm:space-y-2">
      {filteredChatrooms.map((chatroom) => (
        <div
          key={chatroom.id}
          onClick={() => handleChatroomClick(chatroom)}
          className={`group relative p-3 sm:p-4 rounded-xl sm:rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md ${
            currentChatroom?.id === chatroom.id
              ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-l-3 sm:border-l-4 border-blue-500 shadow-lg'
              : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                  {chatroom.title}
                </h3>
                <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{formatTime(chatroom.updatedAt)}</span>
                </div>
                {chatroom.lastMessage && (
                  <div className="flex items-center space-x-1.5 sm:space-x-2 mt-1.5 sm:mt-2">
                    {chatroom.lastMessage.sender === 'ai' ? (
                      <Bot className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-500 flex-shrink-0" />
                    ) : (
                      <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-500 flex-shrink-0" />
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                      {chatroom.lastMessage.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={(e) => handleDeleteChatroom(e, chatroom.id)}
              className="opacity-0 group-hover:opacity-100 p-1.5 sm:p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-500 hover:text-red-600 transform hover:scale-110"
              title="Delete conversation"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};