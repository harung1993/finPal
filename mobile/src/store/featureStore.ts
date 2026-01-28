import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FeatureFlags {
  categories: boolean;
  groups: boolean;
  recurring: boolean;
  analytics: boolean;
}

interface FeatureStore {
  features: FeatureFlags;
  toggleFeature: (feature: keyof FeatureFlags) => void;
  enableFeature: (feature: keyof FeatureFlags) => void;
  disableFeature: (feature: keyof FeatureFlags) => void;
  resetFeatures: () => void;
}

const defaultFeatures: FeatureFlags = {
  categories: false, // Hidden by default, managed in forms
  groups: false, // Advanced feature
  recurring: false, // Advanced feature
  analytics: false, // Advanced feature
};

export const useFeatureStore = create<FeatureStore>()(
  persist(
    (set) => ({
      features: defaultFeatures,

      toggleFeature: (feature) =>
        set((state) => ({
          features: {
            ...state.features,
            [feature]: !state.features[feature],
          },
        })),

      enableFeature: (feature) =>
        set((state) => ({
          features: {
            ...state.features,
            [feature]: true,
          },
        })),

      disableFeature: (feature) =>
        set((state) => ({
          features: {
            ...state.features,
            [feature]: false,
          },
        })),

      resetFeatures: () =>
        set({
          features: defaultFeatures,
        }),
    }),
    {
      name: 'feature-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
