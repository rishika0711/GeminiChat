import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, Country, User } from '../types';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      countries: [],
      selectedCountry: null,
      otpSent: false,
      
      setUser: (user: User | null) => {
        set({ user });
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      },
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      
      setCountries: (countries: Country[]) => set({ countries }),
      
      setSelectedCountry: (country: Country | null) => set({ selectedCountry: country }),
      
      setOtpSent: (sent: boolean) => set({ otpSent: sent }),
      
      logout: () => {
        set({ user: null, otpSent: false });
        localStorage.removeItem('user');
        localStorage.removeItem('chatrooms');
        localStorage.removeItem('messages');
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);