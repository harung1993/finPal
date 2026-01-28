import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ViewStyle,
  Platform,
} from 'react-native';
import { getColors, typography, spacing, shadows, blurIntensity } from '@theme';
import { BlurView } from 'expo-blur';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'small' | 'medium' | 'large' | 'full';
  style?: ViewStyle;
  isDark?: boolean;
}

/**
 * Modal Component - Updated for Liquid Glass design system
 * Backward compatible with existing usage
 */
export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  title,
  children,
  footer,
  size = 'medium',
  style,
  isDark = false,
}) => {
  const colors = getColors(isDark);

  const modalContent = (
    <View style={styles.overlay}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      {Platform.OS === 'ios' ? (
        <BlurView
          intensity={blurIntensity.strong}
          tint={isDark ? 'dark' : 'light'}
          style={[
            styles.modal,
            styles[size],
            {
              backgroundColor: colors.glass.background,
              borderColor: colors.glass.border,
            },
            style,
          ]}
        >
          {title && (
            <View style={[styles.header, { borderBottomColor: colors.border.default }]}>
              <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeButton, { backgroundColor: colors.glass.backgroundDark }]}
              >
                <Text style={[styles.closeText, { color: colors.text.secondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.content}>{children}</View>

          {footer && (
            <View style={[styles.footer, { borderTopColor: colors.border.default }]}>
              {footer}
            </View>
          )}
        </BlurView>
      ) : (
        <View
          style={[
            styles.modal,
            styles[size],
            {
              backgroundColor: colors.glass.backgroundDark,
              borderColor: colors.glass.border,
            },
            style,
          ]}
        >
          {title && (
            <View style={[styles.header, { borderBottomColor: colors.border.default }]}>
              <Text style={[styles.title, { color: colors.text.primary }]}>{title}</Text>
              <TouchableOpacity
                onPress={onClose}
                style={[styles.closeButton, { backgroundColor: colors.glass.background }]}
              >
                <Text style={[styles.closeText, { color: colors.text.secondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.content}>{children}</View>

          {footer && (
            <View style={[styles.footer, { borderTopColor: colors.border.default }]}>
              {footer}
            </View>
          )}
        </View>
      )}
    </View>
  );

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {modalContent}
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },

  modal: {
    borderRadius: spacing.radius.xl, // Updated to 24px for modals
    borderWidth: 1,
    overflow: 'hidden',
    ...shadows.modal,
  },

  small: {
    width: '80%',
    maxWidth: 400,
  },

  medium: {
    width: '90%',
    maxWidth: 600,
  },

  large: {
    width: '95%',
    maxWidth: 800,
  },

  full: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },

  title: {
    ...typography.styles.h3,
  },

  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.radius.sm,
  },

  closeText: {
    fontSize: typography.sizes.xl,
    lineHeight: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },

  content: {
    padding: spacing.lg,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.md,
    padding: spacing.lg,
    borderTopWidth: 1,
  },
});
