import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { authService } from '../../services/authService';

type VerifyEmailScreenRouteProp = RouteProp<
  { VerifyEmail: { token: string; email: string } },
  'VerifyEmail'
>;

export const VerifyEmailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<VerifyEmailScreenRouteProp>();
  const { token, email } = route.params || {};

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    if (!token) {
      setError('Invalid verification link');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.verifyEmail(token);

      if (response.success) {
        setVerified(true);
      } else {
        setError(response.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Verify email error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      Alert.alert('Error', 'Email address not found. Please try signing up again.');
      return;
    }

    setResendLoading(true);
    try {
      const response = await authService.resendVerification(email);

      if (response.success) {
        Alert.alert(
          'Email Sent',
          'A new verification email has been sent to your inbox.'
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to send verification email');
      }
    } catch (err) {
      console.error('Resend verification error:', err);
      Alert.alert('Error', 'An unexpected error occurred');
    } finally {
      setResendLoading(false);
    }
  };

  const handleContinue = () => {
    navigation.navigate('Login' as never);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Verifying your email...</Text>
        </View>
      </View>
    );
  }

  if (verified) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Email Verified!</Text>
          <Text style={styles.successMessage}>
            Your email has been successfully verified. You can now sign in to your account.
          </Text>

          <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.centerContent}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorIconText}>✕</Text>
        </View>
        <Text style={styles.errorTitle}>Verification Failed</Text>
        <Text style={styles.errorMessage}>
          {error || 'The verification link is invalid or has expired.'}
        </Text>

        {email && (
          <>
            <Text style={styles.resendPrompt}>
              Would you like us to send a new verification link?
            </Text>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendVerification}
              disabled={resendLoading}
            >
              {resendLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.resendButtonText}>Resend Verification Email</Text>
              )}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity style={styles.backButton} onPress={handleContinue}>
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94a3b8',
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 3,
    borderColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  successIconText: {
    fontSize: 48,
    color: '#10b981',
  },
  successTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 3,
    borderColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  errorIconText: {
    fontSize: 48,
    color: '#ef4444',
  },
  errorTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  resendPrompt: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  resendButton: {
    backgroundColor: '#10b981',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  resendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    padding: 16,
    alignItems: 'center',
    width: '100%',
  },
  backButtonText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
});
