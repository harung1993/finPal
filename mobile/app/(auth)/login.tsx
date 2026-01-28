import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, typography } from '@theme';
import { GlassButton, Input, GlassCard } from '@components';
import { useLogin } from '@hooks/useAuth';
import { useBiometric } from '@hooks/useBiometric';
import { useDarkMode } from '@hooks/useDarkMode';

export default function LoginScreen() {
  const { isDark, colors } = useDarkMode();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saveBiometric, setSaveBiometric] = useState(false);

  const { mutate: login, isPending, error } = useLogin();
  const {
    isBiometricSupported,
    isBiometricEnabled,
    biometricType,
    authenticateWithBiometric,
    enableBiometric,
  } = useBiometric();

  useEffect(() => {
    // Try to authenticate with biometrics on mount if enabled
    if (isBiometricEnabled) {
      handleBiometricLogin();
    }
  }, [isBiometricEnabled]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    // If user wants to save biometric credentials
    if (saveBiometric && isBiometricSupported) {
      const enabled = await enableBiometric({ email, password });
      if (enabled) {
        Alert.alert('Success', `${biometricType} enabled for future logins`);
      }
    }

    login({ email, password });
  };

  const handleBiometricLogin = async () => {
    try {
      const credentials = await authenticateWithBiometric();
      if (credentials) {
        setEmail(credentials.email);
        setPassword(credentials.password);
        login(credentials);
      }
    } catch (error) {
      console.error('Biometric login failed:', error);
    }
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
                <Text style={[styles.title, { color: colors.primary }]}>FinPal</Text>
                <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
                  Welcome back! Sign in to continue
                </Text>
              </View>

              {/* Login Form */}
              <GlassCard isDark={isDark} padding={24}>
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

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => {
                    // Navigate to forgot password screen
                    // TODO: Add navigation once ForgotPasswordScreen is added to routes
                    Alert.alert('Coming Soon', 'Forgot password feature will be available soon');
                  }}
                >
                  <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>

                {error && (
                  <Text style={[styles.error, { color: colors.error }]}>
                    {(error as any)?.response?.data?.message || 'Invalid email or password'}
                  </Text>
                )}

                {isBiometricSupported && !isBiometricEnabled && (
                  <TouchableOpacity
                    style={styles.biometricToggle}
                    onPress={() => setSaveBiometric(!saveBiometric)}
                  >
                    <MaterialCommunityIcons
                      name={saveBiometric ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={24}
                      color={saveBiometric ? colors.primary : colors.text.secondary}
                    />
                    <Text style={[styles.biometricToggleText, { color: colors.text.secondary }]}>
                      Enable {biometricType} for future logins
                    </Text>
                  </TouchableOpacity>
                )}

                <GlassButton
                  title={isPending ? 'Signing in...' : 'Sign In'}
                  onPress={handleLogin}
                  loading={isPending}
                  variant="primary"
                  size="medium"
                  isDark={isDark}
                  style={styles.button}
                />

                {isBiometricEnabled && (
                  <TouchableOpacity
                    style={[styles.biometricButton, {
                      backgroundColor: `${colors.primary}1A`,
                      borderColor: `${colors.primary}4D`
                    }]}
                    onPress={handleBiometricLogin}
                  >
                    <MaterialCommunityIcons
                      name={biometricType === 'Face ID' ? 'face-recognition' : 'fingerprint'}
                      size={32}
                      color={colors.primary}
                    />
                    <Text style={[styles.biometricButtonText, { color: colors.primary }]}>
                      Sign in with {biometricType}
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={styles.footer}>
                  <Text style={[styles.footerText, { color: colors.text.secondary }]}>
                    Don't have an account?{' '}
                  </Text>
                  <Link href="/(auth)/register" style={styles.link}>
                    <Text style={[styles.linkText, { color: colors.primary }]}>Sign Up</Text>
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

  biometricToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },

  biometricToggleText: {
    fontSize: 14,
    fontWeight: typography.weights.medium,
    marginLeft: spacing.sm,
  },

  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
  },

  biometricButtonText: {
    fontSize: 16,
    fontWeight: typography.weights.semibold,
    marginLeft: spacing.sm,
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: spacing.sm,
  },

  forgotPasswordText: {
    fontSize: 14,
    fontWeight: typography.weights.semibold,
  },
});
