import { z } from 'zod';

export const phoneSchema = z.object({
  phone: z
    .string()
    .nonempty('Phone number is required')
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .regex(/^\d+$/, 'Phone number must contain only digits'),
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
});

export const chatroomSchema = z.object({
  title: z
    .string()
    .min(1, 'Chatroom title is required')
    .max(50, 'Chatroom title cannot exceed 50 characters'),
});

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(1000, 'Message cannot exceed 1000 characters'),
});