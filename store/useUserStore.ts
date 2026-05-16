import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

interface UserState {
  selectedLanguageId: string | null;
  setLanguage: (id: string) => void;
  xp: number;
  addXP: (amount: number) => void;
  clearStorage: () => Promise<void>;
}

// Create a custom storage wrapper to handle different environments safely
const customStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return localStorage.getItem(name);
    }
    return await AsyncStorage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.setItem(name, value);
      return;
    }
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    if (Platform.OS === 'web') {
      localStorage.removeItem(name);
      return;
    }
    await AsyncStorage.removeItem(name);
  },
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      selectedLanguageId: null,
      setLanguage: (id) => set({ selectedLanguageId: id }),
      xp: 0,
      addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
      clearStorage: async () => {
        set({ selectedLanguageId: null, xp: 0 });
        if (Platform.OS === 'web') {
          localStorage.removeItem('user-storage');
        } else {
          await AsyncStorage.removeItem('user-storage');
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => customStorage),
    }
  )
);

