import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, typography } from '@theme';
import { GlassButton, Input, GlassCard } from '@components';
import { useRegister } from '@hooks/useAuth';
import { useDarkMode } from '@hooks/useDarkMode';

export default function RegisterScreen() {
  const { isDark, colors } = useDarkMode();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { mutate: register, isPending, error } = useRegister();

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    register({ username: name, email, password });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
      <LinearGradient colors={colors.background.light} style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {/* Logo/Title Section */}
              <View style={styles.header}>
                <Text style={styles.logo}>💰</Text>
                <Text style={[styles.title, { color: colors.primary }]}>Create Account</Text>
                <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                  Start tracking your expenses today
                </Text>
              </View>

              {/* Register Form */}
              <GlassCard isDark={isDark} padding={24}>
                <Input
                  label="Name"
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  isDark={isDark}
                />

                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  isDark={isDark}
                />

                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  isDark={isDark}
                />

                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  isDark={isDark}
                />

                {error && (
                  <Text style={[styles.error, { color: colors.error }]}>
                    {(error as any)?.response?.data?.message || 'Registration failed'}
                  </Text>
                )}

                <GlassButton
                  title={isPending ? 'Creating Account...' : 'Sign Up'}
                  onPress={handleRegister}
                  loading={isPending}
                  variant="primary"
                  size="medium"
                  isDark={isDark}
                  style={styles.button}
                />

                <View style={styles.footer}>
                  <Text style={[styles.footerText, { color: colors.text.secondary }]}>
                    Already have an account?{' '}
                  </Text>
                  <Link href="/(auth)/login" style={styles.link}>
                    <Text style={[styles.linkText, { color: colors.primary }]}>Sign In</Text>
                  </Link>
                </View>
              </GlassCard>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },

  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: 40,
  },

  logo: {
    fontSize: 64,
    marginBottom: spacing.md,
  },

  title: {
    fontSize: 32,
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },

  button: {
    marginTop: spacing.md,
  },

  error: {
    fontSize: 14,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.md,
    textAlign: 'center',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },

  footerText: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
  },

  link: {
    textDecorationLine: 'none',
  },

  linkText: {
    fontSize: 16,
    fontWeight: typography.weights.semibold,
  },
});
