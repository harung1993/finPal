import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const CREDENTIALS_KEY = 'biometric_credentials';

export interface BiometricCredentials {
  email: string;
  password: string;
}

export interface BiometricCapabilities {
  isAvailable: boolean;
  isEnrolled: boolean;
  supportedTypes: LocalAuthentication.AuthenticationType[];
  biometricName: string;
}

/**
 * Check if biometric authentication is available and enrolled on the device
 */
export const checkBiometricAvailability = async (): Promise<BiometricCapabilities> => {
  try {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

    // Get friendly name for biometric type
    let biometricName = 'Biometric';
    if (Platform.OS === 'ios') {
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometricName = 'Face ID';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometricName = 'Touch ID';
      }
    } else {
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometricName = 'Face Unlock';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometricName = 'Fingerprint';
      }
    }

    return {
      isAvailable: hasHardware && isEnrolled,
      isEnrolled,
      supportedTypes,
      biometricName,
    };
  } catch (error) {
    console.error('Error checking biometric availability:', error);
    return {
      isAvailable: false,
      isEnrolled: false,
      supportedTypes: [],
      biometricName: 'Biometric',
    };
  }
};

/**
 * Authenticate user with biometrics
 */
export const authenticateWithBiometrics = async (
  promptMessage?: string
): Promise<boolean> => {
  try {
    const capabilities = await checkBiometricAvailability();

    if (!capabilities.isAvailable) {
      throw new Error('Biometric authentication is not available');
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: promptMessage || `Unlock with ${capabilities.biometricName}`,
      fallbackLabel: 'Use passcode',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    return result.success;
  } catch (error) {
    console.error('Biometric authentication error:', error);
    return false;
  }
};

/**
 * Check if biometric login is enabled
 */
export const isBiometricLoginEnabled = async (): Promise<boolean> => {
  try {
    const enabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
    return enabled === 'true';
  } catch (error) {
    console.error('Error checking biometric enabled status:', error);
    return false;
  }
};

/**
 * Enable biometric login and store encrypted credentials
 */
export const enableBiometricLogin = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    // First verify biometrics work
    const authenticated = await authenticateWithBiometrics(
      'Authenticate to enable biometric login'
    );

    if (!authenticated) {
      throw new Error('Biometric authentication failed');
    }

    // Store credentials securely
    const credentials: BiometricCredentials = { email, password };
    await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });

    // Mark biometric as enabled
    await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
  } catch (error) {
    console.error('Error enabling biometric login:', error);
    throw error;
  }
};

/**
 * Disable biometric login and remove stored credentials
 */
export const disableBiometricLogin = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(CREDENTIALS_KEY);
    await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
  } catch (error) {
    console.error('Error disabling biometric login:', error);
    throw error;
  }
};

/**
 * Get stored credentials after successful biometric authentication
 */
export const getBiometricCredentials = async (): Promise<BiometricCredentials | null> => {
  try {
    // Check if biometric is enabled
    const enabled = await isBiometricLoginEnabled();
    if (!enabled) {
      return null;
    }

    // Authenticate with biometrics
    const authenticated = await authenticateWithBiometrics('Sign in to FinPal');
    if (!authenticated) {
      return null;
    }

    // Retrieve stored credentials
    const credentialsJson = await SecureStore.getItemAsync(CREDENTIALS_KEY);
    if (!credentialsJson) {
      return null;
    }

    const credentials: BiometricCredentials = JSON.parse(credentialsJson);
    return credentials;
  } catch (error) {
    console.error('Error getting biometric credentials:', error);
    return null;
  }
};

/**
 * Update stored credentials (after password change)
 */
export const updateBiometricCredentials = async (
  email: string,
  newPassword: string
): Promise<void> => {
  try {
    const enabled = await isBiometricLoginEnabled();
    if (!enabled) {
      return;
    }

    // Update credentials
    const credentials: BiometricCredentials = { email, password: newPassword };
    await SecureStore.setItemAsync(CREDENTIALS_KEY, JSON.stringify(credentials), {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  } catch (error) {
    console.error('Error updating biometric credentials:', error);
    throw error;
  }
};
