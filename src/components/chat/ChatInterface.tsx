import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const ChatInterface: React.FC = () => {
  return (
    <div className="h-full flex flex-col">
      <MessageList />
      <MessageInput />
    </div>
  );
};