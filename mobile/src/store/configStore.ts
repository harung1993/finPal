import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ConfigState {
  backendUrl: string | null;
  isConfigured: boolean;

  // Actions
  setBackendUrl: (url: string) => void;
  clearConfig: () => void;
  getApiBaseUrl: () => string;
}

const DEFAULT_BACKEND_URL = __DEV__
  ? 'http://localhost'
  : 'https://api.dollardollar.app';

export const useConfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      backendUrl: null,
      isConfigured: false,

      setBackendUrl: (url: string) => {
        // Remove trailing slash if present
        const cleanUrl = url.replace(/\/$/, '');
        set({
          backendUrl: cleanUrl,
          isConfigured: true,
        });
      },

      clearConfig: () =>
        set({
          backendUrl: null,
          isConfigured: false,
        }),

      getApiBaseUrl: () => {
        const { backendUrl } = get();
        return backendUrl || DEFAULT_BACKEND_URL;
      },
    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
