import React, { useState, useEffect } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useChatStore } from '../../stores/chatStore';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { ChatInterface } from '../chat/ChatInterface';
import { CreateChatroomModal } from './CreateChatroomModal';
import { Menu, X } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useUIStore();
  const { chatrooms, setChatrooms, setMessages } = useChatStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedChatrooms = localStorage.getItem('chatrooms');
    const savedMessages = localStorage.getItem('messages');
    
    if (savedChatrooms) {
      setChatrooms(JSON.parse(savedChatrooms));
    }
    
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, [setChatrooms, setMessages]);

  const handleCreateChatroom = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header onCreateChatroom={handleCreateChatroom} />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-50 w-80 transition-transform duration-300 ease-in-out lg:z-0`}>
          <Sidebar />
        </div>
        
        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg lg:hidden"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          ) : (
            <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          )}
        </button>
        
        {/* Main content */}
        <div className="flex-1 lg:ml-0">
          <ChatInterface />
        </div>
      </div>
      
      <CreateChatroomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};