import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuthStore } from '@store/authStore';
import { useConfigStore } from '@store/configStore';

export default function Index() {
  const { isAuthenticated, accessToken } = useAuthStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    accessToken: state.accessToken,
  }));

  const { isConfigured } = useConfigStore((state) => ({
    isConfigured: state.isConfigured,
  }));

  // Check if backend is configured
  if (!isConfigured) {
    return <Redirect href="/welcome" />;
  }

  // Only consider authenticated if we have both flag and token
  const isActuallyAuthenticated = isAuthenticated && accessToken;

  if (isActuallyAuthenticated) {
    return <Redirect href="/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/login" />;
}
