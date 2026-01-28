import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getColors } from '@theme';

const DARK_MODE_KEY = 'darkMode';

/**
 * Hook for managing dark mode state across the app
 * @returns Object containing isDark state, colors, and toggle function
 */
export const useDarkMode = () => {
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load dark mode preference on mount
  useEffect(() => {
    const loadDarkMode = async () => {
      try {
        const darkMode = await AsyncStorage.getItem(DARK_MODE_KEY);
        setIsDark(darkMode === 'true');
      } catch (error) {
        console.error('Failed to load dark mode preference:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDarkMode();
  }, []);

  // Listen for dark mode changes (for cross-screen sync)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const darkMode = await AsyncStorage.getItem(DARK_MODE_KEY);
        setIsDark(darkMode === 'true');
      } catch (error) {
        console.error('Failed to sync dark mode:', error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = async () => {
    try {
      const newValue = !isDark;
      setIsDark(newValue);
      await AsyncStorage.setItem(DARK_MODE_KEY, newValue.toString());
    } catch (error) {
      console.error('Failed to save dark mode preference:', error);
    }
  };

  // Get theme-aware colors
  const colors = getColors(isDark);

  return {
    isDark,
    isLoading,
    colors,
    toggleDarkMode,
  };
};
