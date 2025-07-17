import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-hot-toast';
import { otpSchema } from '../../utils/validation';
import { verifyOTP } from '../../utils/api';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { User } from '../../types';

interface OTPFormData {
  otp: string;
}

export const OTPForm: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const {
    isLoading,
    selectedCountry,
    setUser,
    setLoading,
    setOtpSent,
  } = useAuthStore();

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
  });

  const watchedOtp = watch('otp');

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    const otpString = newOtp.join('');
    setValue('otp', otpString);
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setOtp(newOtp);
    setValue('otp', pastedData);
    
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const onSubmit = async (data: OTPFormData) => {
    if (!data.otp || data.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await verifyOTP('phone-placeholder', data.otp);
      
      if (success) {
        const user: User = {
          id: `user-${Date.now()}`,
          phone: 'phone-placeholder',
          country: selectedCountry?.name.common || 'Unknown',
          isAuthenticated: true,
        };
        
        setUser(user);
        setOtpSent(false);
        toast.success('Login successful!');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtpSent(false);
    toast.success('Redirecting to phone number entry...');
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
          Enter OTP
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
          We've sent a 6-digit code to your phone
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
        <div>
          <div className="flex justify-center space-x-1.5 sm:space-x-2 mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all duration-200"
              />
            ))}
          </div>
          {errors.otp && (
            <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          loading={isLoading}
          className="w-full text-sm sm:text-base py-2.5 sm:py-3"
          size="lg"
        >
          Verify OTP
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            className="text-blue-600 hover:text-blue-500 text-xs sm:text-sm font-medium transition-colors duration-200"
          >
            Didn't receive code? Go back
          </button>
        </div>
      </form>
    </div>
  );
};