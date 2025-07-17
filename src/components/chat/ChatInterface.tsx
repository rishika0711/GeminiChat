import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const ChatInterface: React.FC = () => {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <MessageList />
      <MessageInput />
    </div>
  );
};