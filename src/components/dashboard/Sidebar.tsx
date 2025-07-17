import React, { useState } from 'react';
import { SearchBar } from './SearchBar';
import { ChatroomList } from './ChatroomList';
import { CreateChatroomModal } from './CreateChatroomModal';

export const Sidebar: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <aside className="w-full h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
          <SearchBar />
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <div className="p-3 sm:p-4">
            <ChatroomList />
          </div>
        </div>
      </aside>
      
      <CreateChatroomModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </>
  );
};