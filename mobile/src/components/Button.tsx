import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { getColors, typography, spacing, shadows } from '@theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  isDark?: boolean;
}

/**
 * Button Component - Updated for Liquid Glass design system
 * Backward compatible with existing usage
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  isDark = false,
}) => {
  const colors = getColors(isDark);
  const isDisabled = disabled || loading;

  // Generate dynamic variant styles based on theme
  const variantStyles = {
    primaryBase: {
      backgroundColor: colors.primary,
      ...shadows.primary,
    },
    secondaryBase: {
      backgroundColor: colors.glass.backgroundDark,
      borderWidth: 1,
      borderColor: colors.glass.border,
      ...shadows.medium,
    },
    outlineBase: {
      backgroundColor: 'transparent',
      borderWidth: 2,
      borderColor: colors.primary,
      ...shadows.none,
    },
    ghostBase: {
      backgroundColor: 'transparent',
    },
    primaryText: {
      color: '#ffffff', // Always white on primary buttons
    },
    secondaryText: {
      color: colors.text.primary,
    },
    outlineText: {
      color: colors.primary,
    },
    ghostText: {
      color: colors.primary,
    },
  };

  const buttonStyles: ViewStyle[] = [
    styles.base,
    variantStyles[`${variant}Base`],
    styles[`${size}Size`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles: TextStyle[] = [
    styles.text,
    variantStyles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : colors.primary}
          size="small"
        />
      ) : (
        <>
          {icon}
          <Text style={textStyles}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Base styles
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: spacing.radius.md, // Updated to 16px for buttons
    gap: spacing.sm,
  },

  fullWidth: {
    width: '100%',
  },

  disabled: {
    opacity: 0.5,
  },

  // Size styles
  smallSize: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 40,
  },

  mediumSize: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.base,
    minHeight: 48,
  },

  largeSize: {
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.lg,
    minHeight: 56,
  },

  // Text styles
  text: {
    textAlign: 'center',
    fontWeight: typography.weights.bold,
  },

  smallText: {
    ...typography.styles.buttonSmall,
  },

  mediumText: {
    ...typography.styles.button,
  },

  largeText: {
    ...typography.styles.button,
    fontSize: typography.sizes.lg,
  },

  disabledText: {
    opacity: 0.6,
  },
});
