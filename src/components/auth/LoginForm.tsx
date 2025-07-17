import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, ChevronDown } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { phoneSchema } from '../../utils/validation';
import { fetchCountries, sendOTP } from '../../utils/api';
import { useAuthStore } from '../../stores/authStore';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Country } from '../../types';

interface LoginFormData {
  phone: string;
}

export const LoginForm: React.FC = () => {
  const [showCountrySelect, setShowCountrySelect] = useState(false);
  const {
    user,
    isLoading,
    countries,
    selectedCountry,
    setUser,
    setLoading,
    setCountries,
    setSelectedCountry,
    setOtpSent,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(phoneSchema),
  });

  useEffect(() => {
    const loadCountries = async () => {
      const countryData = await fetchCountries();
      setCountries(countryData);
      
      // Set default country (US)
      const defaultCountry = countryData.find(c => c.cca2 === 'US');
      if (defaultCountry) {
        setSelectedCountry(defaultCountry);
      }
    };
    
    loadCountries();
  }, [setCountries, setSelectedCountry]);

  const onSubmit = async (data: LoginFormData) => {
    if (!selectedCountry) {
      toast.error('Please select a country');
      return;
    }

    setLoading(true);
    
    try {
      const countryCode = selectedCountry.idd.root + selectedCountry.idd.suffixes[0];
      const success = await sendOTP(data.phone, countryCode);
      
      if (success) {
        setOtpSent(true);
        toast.success('OTP sent successfully!');
      } else {
        toast.error('Failed to send OTP');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setShowCountrySelect(false);
  };

  const getCountryCode = (country: Country) => {
    return country.idd.root + country.idd.suffixes[0];
  };

  return (
    <div className="w-full max-w-md">
      <div className="space-y-4 sm:space-y-6">
        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
            Welcome to Gemini Chat
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">
            Enter your phone number to get started
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs">
            Enter Any 6 digit OTP to login
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
              Phone Number
            </label>
            <div className="flex">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowCountrySelect(!showCountrySelect)}
                  className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors min-w-0"
                >
                  <span className="text-sm sm:text-base">{selectedCountry?.flag}</span>
                  <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                    {selectedCountry ? getCountryCode(selectedCountry) : '+1'}
                  </span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                </button>
                
                {showCountrySelect && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-48 sm:max-h-60 overflow-y-auto min-w-[200px]">
                    {countries.map((country) => (
                      <button
                        key={country.cca2}
                        type="button"
                        onClick={() => handleCountrySelect(country)}
                        className="w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <span className="text-sm sm:text-base">{country.flag}</span>
                        <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                          {getCountryCode(country)}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 truncate">
                          {country.name.common}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <input
                type="tel"
                placeholder="Enter your phone number"
                {...register('phone')}
                className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-l-0 rounded-l-none text-sm sm:text-base min-w-0"
              />
            </div>
            {errors.phone && (
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            loading={isLoading}
            className="w-full text-sm sm:text-base py-2.5 sm:py-3"
            size="lg"
          >
            Send OTP
          </Button>
        </form>
      </div>
    </div>
  );
};