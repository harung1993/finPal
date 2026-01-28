/**
 * Design System - Shadows & Elevation
 * iOS 26 Liquid Glass Design System
 * Lighter shadows for glass aesthetic
 */

export const shadows = {
  // Small shadow - for subtle elevation
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2, // Android
  },

  // Medium shadow - standard for most cards
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4, // Android
  },

  // Large shadow - for floating elements
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 32,
    elevation: 8, // Android
  },

  // Primary shadow - amber glow for emphasis
  primary: {
    shadowColor: '#fbbf24', // Amber shadow for emphasis
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 8, // Android
  },

  // Card shadow - optimized for glass cards
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3, // Android
  },

  // Modal shadow - for overlays
  modal: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 8, // Android
  },

  // Floating shadow - for FAB and floating buttons
  floating: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4, // Android
  },

  // No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0, // Android
  },
} as const;

/**
 * Blur intensities for iOS BlurView
 * Used with expo-blur BlurView component
 */
export const blurIntensity = {
  light: 20,    // Subtle blur
  medium: 30,   // Standard (most common)
  strong: 40,   // Heavy blur (tab bar)
} as const;

export type Shadows = typeof shadows;
export type BlurIntensity = typeof blurIntensity;
