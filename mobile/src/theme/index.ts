/**
 * Design System - Central Theme Export
 * Aggregates all theme constants for easy import
 * iOS 26 Liquid Glass Design System
 */

import { colors, getColors, iconGradients } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows, blurIntensity } from './shadows';

export const theme = {
  colors,
  typography,
  spacing,
  shadows,
  blurIntensity,
  iconGradients,
} as const;

// Re-export individual modules for convenience
export { colors, getColors, iconGradients, typography, spacing, shadows, blurIntensity };

// Export types
export type Theme = typeof theme;
export type { Colors, ColorMode } from './colors';
export type { Typography } from './typography';
export type { Spacing } from './spacing';
export type { Shadows, BlurIntensity } from './shadows';
