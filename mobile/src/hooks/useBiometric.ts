import { useState, useEffect } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials';

export interface BiometricCredentials {
  email: string;
  password: string;
}

export const useBiometric = () => {
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState<string>('');

  useEffect(() => {
    checkBiometricSupport();
    checkBiometricEnabled();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricSupported(compatible);

      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        if (enrolled) {
          const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
          if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
            setBiometricType('Face ID');
          } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
            setBiometricType('Touch ID');
          } else {
            setBiometricType('Biometric');
          }
        }
      }
    } catch (error) {
      console.error('Error checking biometric support:', error);
    }
  };

  const checkBiometricEnabled = async () => {
    try {
      const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      setIsBiometricEnabled(enabled === 'true');
    } catch (error) {
      console.error('Error checking biometric enabled:', error);
    }
  };

  const authenticate = async (): Promise<boolean> => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to access your account',
        fallbackLabel: 'Use passcode',
        cancelLabel: 'Cancel',
      });

      return result.success;
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return false;
    }
  };

  const enableBiometric = async (credentials: BiometricCredentials): Promise<boolean> => {
    try {
      // First authenticate with biometrics
      const authResult = await authenticate();
      if (!authResult) {
        return false;
      }

      // Store credentials securely
      await SecureStore.setItemAsync(
        BIOMETRIC_CREDENTIALS_KEY,
        JSON.stringify(credentials)
      );
      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
      setIsBiometricEnabled(true);
      return true;
    } catch (error) {
      console.error('Error enabling biometric:', error);
      return false;
    }
  };

  const disableBiometric = async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(BIOMETRIC_CREDENTIALS_KEY);
      await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
      setIsBiometricEnabled(false);
    } catch (error) {
      console.error('Error disabling biometric:', error);
    }
  };

  const getBiometricCredentials = async (): Promise<BiometricCredentials | null> => {
    try {
      const credentials = await SecureStore.getItemAsync(BIOMETRIC_CREDENTIALS_KEY);
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error('Error getting biometric credentials:', error);
      return null;
    }
  };

  const authenticateWithBiometric = async (): Promise<BiometricCredentials | null> => {
    try {
      const authResult = await authenticate();
      if (!authResult) {
        return null;
      }

      return await getBiometricCredentials();
    } catch (error) {
      console.error('Error authenticating with biometric:', error);
      return null;
    }
  };

  return {
    isBiometricSupported,
    isBiometricEnabled,
    biometricType,
    authenticate,
    enableBiometric,
    disableBiometric,
    getBiometricCredentials,
    authenticateWithBiometric,
  };
};
