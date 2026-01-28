import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { getColors, typography, spacing } from '@theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  isDark?: boolean;
}

/**
 * Input Component - Updated for Liquid Glass design system
 * Backward compatible with existing usage
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  containerStyle,
  inputStyle,
  labelStyle,
  isDark = false,
  ...textInputProps
}) => {
  const colors = getColors(isDark);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.text.secondary }, labelStyle]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.glass.backgroundLight,
            borderColor: colors.border.default,
          },
          isFocused && {
            borderColor: colors.border.focus,
            backgroundColor: colors.glass.background,
          },
          error && { borderColor: colors.error },
        ]}
      >
        {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

        <TextInput
          style={[styles.input, { color: colors.text.primary }, inputStyle]}
          placeholderTextColor={colors.text.tertiary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...textInputProps}
        />

        {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
      </View>

      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
      {hint && !error && (
        <Text style={[styles.hint, { color: colors.text.tertiary }]}>{hint}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },

  label: {
    marginBottom: spacing.sm,
    ...typography.styles.bodySmall,
    fontWeight: typography.weights.semibold,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: spacing.radius.md, // Updated to 16px
    paddingHorizontal: spacing.base,
    minHeight: 48,
  },

  input: {
    flex: 1,
    ...typography.styles.body,
    paddingVertical: spacing.md,
  },

  iconLeft: {
    marginRight: spacing.sm,
  },

  iconRight: {
    marginLeft: spacing.sm,
  },

  error: {
    marginTop: spacing.xs,
    ...typography.styles.caption,
  },

  hint: {
    marginTop: spacing.xs,
    ...typography.styles.caption,
  },
});
