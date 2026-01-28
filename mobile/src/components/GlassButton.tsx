import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { getColors, spacing, shadows, typography } from '@theme';

interface GlassButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'glass';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isDark?: boolean;
}

/**
 * GlassButton Component
 * Primary button component following Liquid Glass design system
 */
export const GlassButton: React.FC<GlassButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  isDark = false,
}) => {
  const colors = getColors(isDark);

  // Size configurations
  const sizeStyles = {
    small: {
      paddingVertical: 12,
      paddingHorizontal: 20,
      fontSize: typography.styles.buttonSmall.fontSize,
    },
    medium: {
      paddingVertical: 16,
      paddingHorizontal: 24,
      fontSize: typography.styles.button.fontSize,
    },
    large: {
      paddingVertical: 20,
      paddingHorizontal: 32,
      fontSize: typography.styles.button.fontSize,
    },
  };

  // Variant styles
  const variantStyles: { [key: string]: { button: ViewStyle; text: TextStyle } } = {
    primary: {
      button: {
        backgroundColor: colors.primary,
        ...shadows.primary,
      },
      text: {
        color: '#ffffff',
      },
    },
    secondary: {
      button: {
        backgroundColor: colors.glass.backgroundDark,
        borderWidth: 1,
        borderColor: colors.glass.border,
        ...shadows.medium,
      },
      text: {
        color: colors.text.primary,
      },
    },
    outline: {
      button: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
        ...shadows.none,
      },
      text: {
        color: colors.primary,
      },
    },
    glass: {
      button: {
        backgroundColor: colors.glass.background,
        borderWidth: 1,
        borderColor: colors.glass.border,
        ...shadows.card,
      },
      text: {
        color: colors.text.primary,
      },
    },
  };

  const buttonStyle: ViewStyle = [
    styles.base,
    {
      paddingVertical: sizeStyles[size].paddingVertical,
      paddingHorizontal: sizeStyles[size].paddingHorizontal,
    },
    variantStyles[variant].button,
    disabled && styles.disabled,
    style,
  ].reduce((acc, curr) => ({ ...acc, ...curr }), {});

  const textStyles: TextStyle = [
    styles.text,
    {
      fontSize: sizeStyles[size].fontSize,
      fontWeight: typography.weights.bold,
    },
    variantStyles[variant].text,
    disabled && styles.disabledText,
    textStyle,
  ].reduce((acc, curr) => ({ ...acc, ...curr }), {});

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#ffffff' : colors.primary}
        />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: spacing.radius.md, // 16px for buttons
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.6,
  },
});
