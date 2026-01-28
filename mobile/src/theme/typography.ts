/**
 * Design System - Typography
 * iOS 26 Liquid Glass Design System
 * Bold typography with heavy weights for modern iOS feel
 */

export const typography = {
  // Font families
  fonts: {
    regular: 'System',  // San Francisco on iOS, Roboto on Android
    medium: 'System',
    bold: 'System',
    mono: 'Courier',
  },

  // Font sizes
  sizes: {
    xs: 11,      // Small labels, captions
    sm: 13,      // Secondary text
    base: 16,    // Body text
    lg: 18,      // Large body, subheadings
    xl: 22,      // Section headers
    '2xl': 28,   // Page headers
    '3xl': 32,   // Large headers
    '4xl': 40,   // Hero text
  },

  // Font weights - including heavy weights for bold iOS aesthetic
  weights: {
    regular: '400' as const,   // Body text
    medium: '500' as const,    // Emphasis
    semibold: '600' as const,  // Subheadings
    bold: '700' as const,      // Headings
    heavy: '800' as const,     // Strong emphasis
    black: '900' as const,     // Hero text, page titles
  },

  // Letter spacing
  letterSpacing: {
    tight: -0.5,   // Large headers (makes them feel more premium)
    normal: 0,     // Body text
    wide: 0.5,     // Small caps, labels
  },

  // Line heights
  lineHeights: {
    tight: 1.2,     // Headers
    normal: 1.5,    // Body text
    relaxed: 1.75,  // Long-form content
  },

  // Text styles (combined font size, weight, and line height)
  styles: {
    // Page titles
    pageTitle: {
      fontSize: 28,
      fontWeight: '900' as const,
      letterSpacing: -0.5,
      lineHeight: 1.2,
    },
    // Section headers
    sectionHeader: {
      fontSize: 18,
      fontWeight: '900' as const,
      letterSpacing: -0.5,
      lineHeight: 1.2,
    },
    // Group titles (all caps)
    groupTitle: {
      fontSize: 12,
      fontWeight: '700' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
      lineHeight: 1.2,
    },
    // Standard headers
    h1: {
      fontSize: 32,
      fontWeight: '900' as const,
      letterSpacing: -0.5,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: 28,
      fontWeight: '900' as const,
      letterSpacing: -0.5,
      lineHeight: 1.2,
    },
    h3: {
      fontSize: 22,
      fontWeight: '700' as const,
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 18,
      fontWeight: '700' as const,
      lineHeight: 1.3,
    },
    // Body text
    body: {
      fontSize: 16,
      fontWeight: '500' as const,
      lineHeight: 1.5,
    },
    bodySmall: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 1.4,
    },
    // Captions
    caption: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 1.4,
    },
    captionSmall: {
      fontSize: 11,
      fontWeight: '600' as const,
      lineHeight: 1.3,
    },
    // Buttons
    button: {
      fontSize: 16,
      fontWeight: '700' as const,
      lineHeight: 1.5,
    },
    buttonSmall: {
      fontSize: 14,
      fontWeight: '700' as const,
      lineHeight: 1.4,
    },
    // Setting items
    settingName: {
      fontSize: 16,
      fontWeight: '700' as const,
      lineHeight: 1.4,
    },
    settingDescription: {
      fontSize: 13,
      fontWeight: '600' as const,
      lineHeight: 1.3,
    },
    // Badge text
    badge: {
      fontSize: 11,
      fontWeight: '800' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
    },
  },
} as const;

export type Typography = typeof typography;
