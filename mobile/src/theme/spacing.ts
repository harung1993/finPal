/**
 * Design System - Spacing
 * Consistent spacing scale for margins and padding
 */

export const spacing = {
  // Base spacing unit (4px)
  unit: 4,

  // Spacing scale
  xs: 4,    // 4px
  sm: 8,    // 8px
  md: 12,   // 12px
  base: 16, // 16px
  lg: 20,   // 20px
  xl: 24,   // 24px
  '2xl': 32, // 32px
  '3xl': 40, // 40px
  '4xl': 48, // 48px
  '5xl': 64, // 64px
  '6xl': 80, // 80px

  // Common spacing patterns
  card: {
    padding: 16,
    gap: 12,
  },

  section: {
    marginVertical: 24,
    padding: 16,
  },

  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },

  list: {
    gap: 8,
    itemPadding: 12,
  },

  // Border radius - updated for Liquid Glass design (more rounded)
  radius: {
    none: 0,
    sm: 12,      // Small elements
    md: 16,      // Buttons, inputs
    lg: 20,      // Cards (PRIMARY)
    xl: 24,      // Large cards
    full: 9999,  // Pills, circular elements
  },
} as const;

export type Spacing = typeof spacing;
