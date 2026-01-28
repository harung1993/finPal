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
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '@theme';
import { Button, Input, Card } from '@components';
import { useConfigStore } from '@store/configStore';

export default function WelcomeScreen() {
  const router = useRouter();
  const { backendUrl, isConfigured, setBackendUrl } = useConfigStore();
  const [url, setUrl] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  useEffect(() => {
    // If already configured, skip to login
    if (isConfigured && backendUrl) {
      router.replace('/(auth)/login');
    }
  }, [isConfigured, backendUrl]);

  const handleUseDefault = () => {
    const defaultUrl = __DEV__ ? 'http://localhost' : 'https://api.dollardollar.app';
    setBackendUrl(defaultUrl);
    router.replace('/(auth)/login');
  };

  const handleUseCustom = () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a valid backend URL');
      return;
    }

    // Validate URL format
    try {
      const urlObj = new URL(url);
      if (!urlObj.protocol.startsWith('http')) {
        throw new Error('Invalid protocol');
      }
      setBackendUrl(url);
      Alert.alert('Success', 'Backend URL configured successfully!', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Please enter a valid URL (e.g., https://api.example.com)');
    }
  };

  const handleTestConnection = async () => {
    if (!url) {
      Alert.alert('Error', 'Please enter a URL first');
      return;
    }

    try {
      const testUrl = url.endsWith('/') ? url.slice(0, -1) : url;
      const response = await fetch(`${testUrl}/api/v1/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        Alert.alert('Success', 'Connection successful! Backend is reachable.');
      } else {
        Alert.alert('Warning', `Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to backend. Please check the URL and try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e293b', '#0f172a']}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Logo/Title Section */}
            <View style={styles.header}>
              <Text style={styles.logo}>💰</Text>
              <Text style={styles.title}>DollarDollar</Text>
              <Text style={styles.subtitle}>
                Your Personal Finance Companion
              </Text>
            </View>

            {/* Feature Highlights */}
            <View style={styles.features}>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📊</Text>
                <Text style={styles.featureText}>Track expenses & budgets</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>🔐</Text>
                <Text style={styles.featureText}>Biometric authentication</Text>
              </View>
              <View style={styles.featureItem}>
                <Text style={styles.featureIcon}>📱</Text>
                <Text style={styles.featureText}>Sync across devices</Text>
              </View>
            </View>

            {/* Configuration Section */}
            {!isCustomMode ? (
              <Card variant="glass" style={styles.card}>
                <Text style={styles.cardTitle}>Get Started</Text>
                <Text style={styles.cardDescription}>
                  Choose how you'd like to connect to your DollarDollar backend
                </Text>

                <Button
                  title="Use Default Backend"
                  onPress={handleUseDefault}
                  fullWidth
                  style={styles.primaryButton}
                />

                <TouchableOpacity
                  style={styles.customButton}
                  onPress={() => setIsCustomMode(true)}
                >
                  <Text style={styles.customButtonText}>
                    Use Custom Backend URL
                  </Text>
                </TouchableOpacity>

                <Text style={styles.helpText}>
                  Don't have an account? You'll be able to sign up on the next screen.
                </Text>
              </Card>
            ) : (
              <Card variant="glass" style={styles.card}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => setIsCustomMode(false)}
                >
                  <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                <Text style={styles.cardTitle}>Custom Backend</Text>
                <Text style={styles.cardDescription}>
                  Enter your self-hosted DollarDollar backend URL
                </Text>

                <Input
                  label="Backend URL"
                  placeholder="https://api.yourdomain.com"
                  value={url}
                  onChangeText={setUrl}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="url"
                />

                <View style={styles.buttonGroup}>
                  <Button
                    title="Test Connection"
                    onPress={handleTestConnection}
                    variant="outline"
                    style={styles.testButton}
                  />
                  <Button
                    title="Continue"
                    onPress={handleUseCustom}
                    style={styles.continueButton}
                  />
                </View>

                <View style={styles.exampleBox}>
                  <Text style={styles.exampleTitle}>Examples:</Text>
                  <Text style={styles.exampleText}>• http://localhost</Text>
                  <Text style={styles.exampleText}>• http://192.168.1.100</Text>
                  <Text style={styles.exampleText}>• https://api.mydomain.com</Text>
                </View>
              </Card>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },

  container: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.lg,
  },

  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },

  logo: {
    fontSize: 80,
    marginBottom: spacing.md,
  },

  title: {
    color: colors.text.primary,
    fontSize: 36,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.sm,
    background: 'linear-gradient(to right, #86efac, #fbbf24)',
    textAlign: 'center',
  },

  subtitle: {
    color: colors.text.secondary,
    ...typography.styles.body,
    textAlign: 'center',
  },

  features: {
    marginBottom: spacing['2xl'],
    gap: spacing.md,
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  featureIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },

  featureText: {
    color: colors.text.primary,
    ...typography.styles.body,
    flex: 1,
  },

  card: {
    padding: spacing.xl,
  },

  cardTitle: {
    color: colors.text.primary,
    ...typography.styles.h2,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  cardDescription: {
    color: colors.text.secondary,
    ...typography.styles.body,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },

  primaryButton: {
    marginBottom: spacing.md,
  },

  customButton: {
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.primary.green,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  customButtonText: {
    color: colors.primary.green,
    ...typography.styles.body,
    fontWeight: typography.weights.semibold,
  },

  helpText: {
    color: colors.text.tertiary,
    ...typography.styles.bodySmall,
    textAlign: 'center',
  },

  backButton: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },

  backButtonText: {
    color: colors.primary.green,
    ...typography.styles.body,
    fontWeight: typography.weights.semibold,
  },

  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },

  testButton: {
    flex: 1,
  },

  continueButton: {
    flex: 1,
  },

  exampleBox: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },

  exampleTitle: {
    color: '#3b82f6',
    ...typography.styles.bodySmall,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },

  exampleText: {
    color: colors.text.secondary,
    ...typography.styles.bodySmall,
    marginBottom: spacing.xs,
  },
});
