import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { getColors, spacing, shadows, blurIntensity } from '@theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: keyof typeof blurIntensity;
  borderColor?: string;
  padding?: number;
  shadowStyle?: keyof typeof shadows;
  isDark?: boolean;
}

/**
 * GlassCard Component
 * Primary container with glassmorphism effect
 * Uses BlurView on iOS, semi-transparent background on Android
 */
export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  intensity = 'medium',
  borderColor,
  padding = 16,
  shadowStyle = 'medium',
  isDark = false,
}) => {
  const colors = getColors(isDark);
  const blurValue = blurIntensity[intensity];
  const shadowValue = shadows[shadowStyle];

  const containerStyle: ViewStyle = {
    borderRadius: spacing.radius.lg, // 20px - primary card radius
    borderWidth: 1,
    borderColor: borderColor || colors.glass.border,
    padding,
    overflow: 'hidden',
    ...shadowValue,
  };

  // iOS: Use BlurView for true glassmorphism
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={blurValue}
        tint={isDark ? 'dark' : 'light'}
        style={[containerStyle, style]}
      >
        <View style={styles.innerContainer}>
          {children}
        </View>
      </BlurView>
    );
  }

  // Android: Use semi-transparent background (BlurView doesn't work well)
  return (
    <View
      style={[
        containerStyle,
        {
          backgroundColor: colors.glass.background,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
  },
});
