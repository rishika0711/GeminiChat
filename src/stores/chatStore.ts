import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatState, Chatroom, Message } from '../types';

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroom: null,
      messages: [],
      isTyping: false,
      searchQuery: '',
      
      setChatrooms: (chatrooms: Chatroom[]) => set({ chatrooms }),
      
      setCurrentChatroom: (chatroom: Chatroom | null) => set({ currentChatroom: chatroom }),
      
      setMessages: (messages: Message[]) => set({ messages }),
      
      addMessage: (message: Message) => {
        const { messages, chatrooms, currentChatroom } = get();
        const newMessages = [...messages, message];
        set({ messages: newMessages });
        
        // Update chatroom's last message
        if (currentChatroom) {
          const updatedChatrooms = chatrooms.map(room => 
            room.id === currentChatroom.id 
              ? { ...room, lastMessage: message, updatedAt: new Date() }
              : room
          );
          set({ chatrooms: updatedChatrooms });
        }
      },
      
      setIsTyping: (typing: boolean) => set({ isTyping: typing }),
      
      setSearchQuery: (query: string) => set({ searchQuery: query }),
      
      addChatroom: (chatroom: Chatroom) => {
        const { chatrooms } = get();
        set({ chatrooms: [chatroom, ...chatrooms] });
      },
      
      deleteChatroom: (chatroomId: string) => {
        const { chatrooms, currentChatroom } = get();
        const newChatrooms = chatrooms.filter(room => room.id !== chatroomId);
        set({ chatrooms: newChatrooms });
        
        if (currentChatroom?.id === chatroomId) {
          set({ currentChatroom: null, messages: [] });
        }
        
        // Remove messages for this chatroom
        const { messages } = get();
        const newMessages = messages.filter(msg => msg.chatroomId !== chatroomId);
        set({ messages: newMessages });
      },
      
      loadMoreMessages: async (chatroomId: string) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { messages } = get();
        const existingMessages = messages.filter(msg => msg.chatroomId === chatroomId);
        
        // Generate dummy older messages
        const olderMessages: Message[] = Array.from({ length: 10 }, (_, i) => ({
          id: `${chatroomId}-old-${Date.now()}-${i}`,
          content: `This is an older message ${i + 1}`,
          sender: i % 2 === 0 ? 'user' : 'ai',
          timestamp: new Date(Date.now() - (existingMessages.length + i + 1) * 60000),
          chatroomId,
        }));
        
        const allMessages = messages.filter(msg => msg.chatroomId !== chatroomId);
        set({ messages: [...allMessages, ...olderMessages, ...existingMessages] });
      },
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ 
        chatrooms: state.chatrooms,
        messages: state.messages,
      }),
    }
  )
);