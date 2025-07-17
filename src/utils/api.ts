import { Country } from '../types';
import { generateAIResponse, clearConversationHistory } from './aiService';

export const fetchCountries = async (): Promise<Country[]> => {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all?fields=name,idd,flag,cca2');
    const data = await response.json();
    
    return data
      .filter((country: any) => country.idd?.root && country.idd?.suffixes)
      .map((country: any) => ({
        name: country.name,
        idd: country.idd,
        flag: country.flag,
        cca2: country.cca2,
      }))
      .sort((a: Country, b: Country) => a.name.common.localeCompare(b.name.common));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

export const sendOTP = async (phone: string, countryCode: string): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`OTP sent to ${countryCode}${phone}`);
      resolve(true);
    }, 1000);
  });
};

export const verifyOTP = async (phone: string, otp: string): Promise<boolean> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Accept any 6-digit OTP for demo
      resolve(otp.length === 6);
    }, 1000);
  });
};

// Export the AI response function from aiService
export { generateAIResponse, clearConversationHistory };