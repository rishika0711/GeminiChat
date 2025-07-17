import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UIState } from '../types';

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      darkMode: false,
      
      toggleDarkMode: () => {
        const { darkMode } = get();
        set({ darkMode: !darkMode });
        
        if (!darkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({ darkMode: state.darkMode }),
    }
  )
);