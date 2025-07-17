import React, { useState, useRef } from 'react';
import { Send, Image, X, Paperclip } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { messageSchema } from '../../utils/validation';
import { useChatStore } from '../../stores/chatStore';
import { generateAIResponse } from '../../utils/aiService';
import { Button } from '../ui/Button';
import { Message } from '../../types';

interface MessageInputFormData {
  content: string;
}

export const MessageInput: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { currentChatroom, addMessage, setIsTyping } = useChatStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<MessageInputFormData>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = watch('content');

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: MessageInputFormData) => {
    if (!currentChatroom) return;
    
    setIsSubmitting(true);
    
    try {
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        content: data.content,
        sender: 'user',
        timestamp: new Date(),
        chatroomId: currentChatroom.id,
        image: selectedImage || undefined,
      };

      addMessage(userMessage);
      reset();
      setSelectedImage(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Textarea will reset automatically with form reset

      // Show typing indicator
      setIsTyping(true);
      
      // Generate AI response
      const aiResponse = await generateAIResponse(data.content, currentChatroom.id);
      
      const aiMessage: Message = {
        id: `msg-${Date.now()}-ai`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
        chatroomId: currentChatroom.id,
      };

      addMessage(aiMessage);
      setIsTyping(false);
      
    } catch (error) {
      toast.error('Failed to send message');
      setIsTyping(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  // Removed adjustTextareaHeight function for simplicity

  if (!currentChatroom) return null;

  return (
    <div className="flex-shrink-0 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl">
      <div className="p-2">
        {selectedImage && (
          <div className="mb-2 flex justify-start">
            <div className="relative inline-block">
              <img
                src={selectedImage}
                alt="Selected"
                className="w-8 h-8 rounded-xl object-cover shadow-lg"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
              >
                <X className="w-2 h-2" />
              </button>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-end space-x-3">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <textarea
                {...register('content')}
                placeholder="Type your message..."
                onKeyDown={handleKeyDown}
                className="w-full p-4 pr-12 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg"
                rows={1}
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute right-3 bottom-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 transform hover:scale-110"
                title="Attach image"
              >
                <Paperclip className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            {errors.content && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2 animate-pulse">
                {errors.content.message}
              </p>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          
          <div className="flex-shrink-0 mb-2">
            <Button
              type="submit"
              disabled={!messageContent?.trim() || isSubmitting}
              loading={isSubmitting}
              className="p-4 rounded-2xl shadow-lg min-w-[56px] h-14"
              title="Send message"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};