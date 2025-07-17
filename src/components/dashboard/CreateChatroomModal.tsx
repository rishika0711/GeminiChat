import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { useChatStore } from '../../stores/chatStore';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Chatroom } from '../../types';
import { MessageCircle, Sparkles } from 'lucide-react';

const chatroomSchema = z.object({
  title: z
    .string()
    .min(1, 'Conversation title is required')
    .max(50, 'Title cannot exceed 50 characters'),
});

interface CreateChatroomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CreateChatroomFormData {
  title: string;
}

export const CreateChatroomModal: React.FC<CreateChatroomModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addChatroom } = useChatStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateChatroomFormData>({
    resolver: zodResolver(chatroomSchema),
  });

  const onSubmit = (data: CreateChatroomFormData) => {
    const newChatroom: Chatroom = {
      id: `chatroom-${Date.now()}`,
      title: data.title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    addChatroom(newChatroom);
    toast.success('New conversation created!');
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Start New Conversation">
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageCircle className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Give your conversation a memorable name to get started
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Conversation Title"
            placeholder="e.g., Help with JavaScript, Recipe Ideas, Travel Planning..."
            {...register('title')}
            error={errors.title?.message}
            autoFocus
          />
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Create Conversation</span>
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};