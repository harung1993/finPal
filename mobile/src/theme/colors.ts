/**
 * Design System - Colors
 * iOS 26 Liquid Glass Design with Amber accent
 * Supports both light and dark modes
 */

// Light mode color palette
const lightColors = {
  // Primary colors
  primary: '#fbbf24',        // Amber - Main accent color
  primaryDark: '#f97316',    // Orange - Hover/pressed states
  primaryLight: '#fde68a',   // Light amber - Backgrounds

  // Glass effects
  glass: {
    background: 'rgba(255, 255, 255, 0.5)',      // Main glass background
    backgroundLight: 'rgba(255, 255, 255, 0.4)', // Lighter variant
    backgroundDark: 'rgba(255, 255, 255, 0.6)',  // Darker variant
    border: 'rgba(255, 255, 255, 0.3)',          // Glass borders
    shadow: 'rgba(0, 0, 0, 0.1)',                // Glass shadows
  },

  // Background gradients
  background: {
    light: ['#fef3c7', '#fffbeb', '#fef9c3'],  // Main app gradient
    amber: ['#fef3c7', '#fbbf24'],             // Amber accent gradient
    purple: ['#faf5ff', '#e9d5ff'],            // Purple accent gradient
  },

  // Border colors
  border: {
    light: 'rgba(0, 0, 0, 0.08)',
    default: 'rgba(0, 0, 0, 0.1)',
    hover: 'rgba(0, 0, 0, 0.15)',
    focus: 'rgba(251, 191, 36, 0.5)',
  },

  // Semantic colors
  success: '#34c759',  // Green - Success states
  warning: '#ff9500',  // Orange - Warning states
  error: '#ff3b30',    // Red - Error states
  info: '#007aff',     // Blue - Info states

  // Text colors
  text: {
    primary: '#1f2937',    // Dark gray - Main text
    secondary: '#6b7280',  // Medium gray - Secondary text
    tertiary: '#9ca3af',   // Light gray - Tertiary text
    white: '#ffffff',      // White - On dark backgrounds
    onGlass: '#1f2937',    // Readable on glass backgrounds
  },

  // Surface colors (for compatibility)
  surface: {
    primary: 'rgba(255, 255, 255, 0.5)',
    secondary: 'rgba(255, 255, 255, 0.4)',
    tertiary: 'rgba(255, 255, 255, 0.3)',
  },
} as const;

// Dark mode color palette
const darkColors = {
  // Primary colors
  primary: '#d97706',        // Muted amber
  primaryDark: '#b45309',    // Darker amber
  primaryLight: '#f59e0b',   // Brighter amber

  // Glass effects
  glass: {
    background: 'rgba(30, 30, 30, 0.7)',
    backgroundLight: 'rgba(40, 40, 40, 0.6)',
    backgroundDark: 'rgba(20, 20, 20, 0.8)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },

  // Background gradients
  background: {
    light: ['#1a1a1a', '#2d2d2d', '#1f1f1f'],  // Dark gradient
    amber: ['#2d2416', '#3d3016'],             // Dark amber
    purple: ['#1f1a24', '#2d2436'],            // Dark purple
  },

  // Border colors
  border: {
    light: 'rgba(255, 255, 255, 0.05)',
    default: 'rgba(255, 255, 255, 0.08)',
    hover: 'rgba(255, 255, 255, 0.12)',
    focus: 'rgba(217, 119, 6, 0.5)',
  },

  // Semantic colors
  success: '#34c759',  // Green
  warning: '#ff9500',  // Orange
  error: '#ff3b30',    // Red
  info: '#007aff',     // Blue

  // Text colors
  text: {
    primary: '#f9fafb',    // Light text
    secondary: '#d1d5db',  // Medium light
    tertiary: '#9ca3af',   // Muted light
    white: '#ffffff',
    onGlass: '#f9fafb',
  },

  // Surface colors (for compatibility)
  surface: {
    primary: 'rgba(30, 30, 30, 0.7)',
    secondary: 'rgba(40, 40, 40, 0.6)',
    tertiary: 'rgba(20, 20, 20, 0.8)',
  },
} as const;

// Icon gradient patterns (work in both light and dark modes)
export const iconGradients = {
  blue: ['rgba(59, 130, 246, 0.2)', 'rgba(96, 165, 250, 0.2)'],
  purple: ['rgba(168, 85, 247, 0.2)', 'rgba(192, 132, 252, 0.2)'],
  green: ['rgba(52, 199, 89, 0.2)', 'rgba(134, 239, 172, 0.2)'],
  orange: ['rgba(249, 115, 22, 0.2)', 'rgba(251, 191, 36, 0.2)'],
  red: ['rgba(239, 68, 68, 0.2)', 'rgba(252, 165, 165, 0.2)'],
  gray: ['rgba(107, 114, 128, 0.2)', 'rgba(156, 163, 175, 0.2)'],
} as const;

/**
 * Get colors for the current theme mode
 * @param isDark - Whether dark mode is enabled
 * @returns Color palette for the current theme
 */
export const getColors = (isDark: boolean = false) => {
  return isDark ? darkColors : lightColors;
};

// Export default light colors for backward compatibility
export const colors = lightColors;

export type Colors = typeof lightColors;
export type ColorMode = 'light' | 'dark';
