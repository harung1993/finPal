import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { getColors, spacing, shadows, blurIntensity } from '@theme';
import { BlurView } from 'expo-blur';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'glass' | 'solid' | 'outline';
  padding?: keyof typeof spacing;
  isDark?: boolean;
  onPress?: () => void;
}

/**
 * Card Component - Updated for Liquid Glass design system
 * Backward compatible with existing usage
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'glass',
  padding = 'base',
  isDark = false,
}) => {
  const colors = getColors(isDark);

  const cardStyles: ViewStyle[] = [
    styles.base,
    { padding: typeof padding === 'number' ? padding : spacing[padding] },
    style,
  ];

  // Glass variant - uses BlurView on iOS, transparent background on Android
  if (variant === 'glass') {
    if (Platform.OS === 'ios') {
      return (
        <BlurView
          intensity={blurIntensity.medium}
          tint={isDark ? 'dark' : 'light'}
          style={[
            cardStyles,
            {
              backgroundColor: colors.glass.background,
              borderWidth: 1,
              borderColor: colors.glass.border,
              borderRadius: spacing.radius.lg, // Updated to 20px
              overflow: 'hidden',
              ...shadows.card,
            },
          ]}
        >
          {children}
        </BlurView>
      );
    }

    return (
      <View
        style={[
          cardStyles,
          {
            backgroundColor: colors.glass.background,
            borderWidth: 1,
            borderColor: colors.glass.border,
            borderRadius: spacing.radius.lg,
            ...shadows.card,
          },
        ]}
      >
        {children}
      </View>
    );
  }

  // Solid variant
  if (variant === 'solid') {
    return (
      <View
        style={[
          cardStyles,
          {
            backgroundColor: colors.surface.primary,
            borderWidth: 1,
            borderColor: colors.border.default,
            borderRadius: spacing.radius.lg,
            ...shadows.card,
          },
        ]}
      >
        {children}
      </View>
    );
  }

  // Outline variant
  return (
    <View
      style={[
        cardStyles,
        {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.border.default,
          borderRadius: spacing.radius.lg,
        },
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
