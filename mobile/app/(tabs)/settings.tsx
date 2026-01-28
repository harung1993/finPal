import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { spacing, typography, iconGradients } from '@theme';
import { GlassCard } from '@components';
import { useAuth } from '@hooks/useAuth';
import { useFeatureStore } from '@store/featureStore';
import { useBiometric } from '@hooks/useBiometric';
import { useConfigStore } from '@store/configStore';
import { useDarkMode } from '@hooks/useDarkMode';

export default function SettingsScreen() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { features, toggleFeature } = useFeatureStore();
  const { isDark, colors, toggleDarkMode } = useDarkMode();
  const [notifications, setNotifications] = useState(true);
  const {
    isBiometricSupported,
    isBiometricEnabled,
    biometricType,
    disableBiometric,
  } = useBiometric();
  const { backendUrl, clearConfig } = useConfigStore();

  // Settings sections
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => logout(),
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature coming soon!');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Account deletion feature coming soon!');
          },
        },
      ]
    );
  };

  const handleToggleBiometric = async () => {
    if (isBiometricEnabled) {
      Alert.alert(
        'Disable Biometric Login',
        `Are you sure you want to disable ${biometricType}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Disable',
            style: 'destructive',
            onPress: async () => {
              await disableBiometric();
              Alert.alert('Success', `${biometricType} has been disabled`);
            },
          },
        ]
      );
    } else {
      Alert.alert(
        'Enable Biometric Login',
        'Please login again to enable biometric authentication. You can enable it from the login screen.'
      );
    }
  };

  const handleChangeBackend = () => {
    Alert.alert(
      'Change Backend Server',
      'This will log you out and clear all local data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Change Backend',
          style: 'destructive',
          onPress: () => {
            logout();
            clearConfig();
            router.replace('/welcome');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
      <LinearGradient colors={colors.background.light} style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primary }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
              Manage your account and preferences
            </Text>
          </View>

          {/* Profile Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              PROFILE
            </Text>
            <GlassCard isDark={isDark} padding={0}>
              <View style={styles.profileCard}>
                <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                  <Text style={styles.avatarText}>{user?.email?.[0]?.toUpperCase() || 'U'}</Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={[styles.profileEmail, { color: colors.text.primary }]}>
                    {user?.email || 'user@example.com'}
                  </Text>
                  <Text style={[styles.profileLabel, { color: colors.text.secondary }]}>
                    Account Active
                  </Text>
                </View>
              </View>
            </GlassCard>
          </View>

          {/* Preferences Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              PREFERENCES
            </Text>

            <GlassCard isDark={isDark} padding={0}>
              {/* Dark Mode Toggle */}
              <TouchableOpacity
                style={styles.settingItem}
                onPress={toggleDarkMode}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.purple}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>{isDark ? '🌙' : '☀️'}</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      {isDark ? 'Dark Mode' : 'Light Mode'}
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      {isDark ? 'Using dark theme' : 'Using light theme'}
                    </Text>
                  </View>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: colors.glass.backgroundDark, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              {/* Notifications */}
              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.blue}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>🔔</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Push Notifications
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Budget alerts and reminders
                    </Text>
                  </View>
                </View>
                <Switch
                  value={notifications}
                  onValueChange={setNotifications}
                  trackColor={{ false: colors.glass.backgroundDark, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              {/* Currency */}
              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.orange}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>💱</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Default Currency
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      USD ($)
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>

          {/* Features Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              FEATURES
            </Text>
            <Text style={[styles.sectionDescription, { color: colors.text.secondary }]}>
              Enable or disable optional features
            </Text>

            <GlassCard isDark={isDark} padding={0}>
              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.green}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>📁</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Categories
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Manage custom categories
                    </Text>
                  </View>
                </View>
                <Switch
                  value={features.categories}
                  onValueChange={() => toggleFeature('categories')}
                  trackColor={{ false: colors.glass.backgroundDark, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.blue}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>👥</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Group Expenses
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Split with friends (Coming Soon)
                    </Text>
                  </View>
                </View>
                <Switch
                  value={features.groups}
                  onValueChange={() => toggleFeature('groups')}
                  trackColor={{ false: colors.glass.backgroundDark, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.orange}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>🔄</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Recurring Transactions
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Auto-create bills (Coming Soon)
                    </Text>
                  </View>
                </View>
                <Switch
                  value={features.recurring}
                  onValueChange={() => toggleFeature('recurring')}
                  trackColor={{ false: colors.glass.backgroundDark, true: colors.primary }}
                  thumbColor="#ffffff"
                />
              </TouchableOpacity>
            </GlassCard>
          </View>

          {/* Security Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              SECURITY
            </Text>

            <GlassCard isDark={isDark} padding={0}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleChangePassword}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.purple}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>🔒</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Change Password
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Update your password
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </TouchableOpacity>

              {isBiometricSupported && (
                <>
                  <View style={[styles.divider, { backgroundColor: colors.border.light }]} />
                  <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                    <View style={styles.settingLeft}>
                      <View style={styles.settingIcon}>
                        <LinearGradient
                          colors={iconGradients.green}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.settingIconGradient}
                        >
                          <Text style={styles.settingIconEmoji}>🔐</Text>
                        </LinearGradient>
                      </View>
                      <View style={styles.settingText}>
                        <Text style={[styles.settingName, { color: colors.text.primary }]}>
                          Biometric Login
                        </Text>
                        <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                          Use {biometricType || 'biometric'}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={isBiometricEnabled}
                      onValueChange={handleToggleBiometric}
                      trackColor={{ false: colors.glass.backgroundDark, true: colors.primary }}
                      thumbColor="#ffffff"
                    />
                  </TouchableOpacity>
                </>
              )}
            </GlassCard>
          </View>

          {/* Backend Configuration */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              BACKEND SERVER
            </Text>

            <GlassCard isDark={isDark} padding={0}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.blue}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>🌐</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Backend URL
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      {backendUrl || 'Not configured'}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleChangeBackend}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.orange}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>🔄</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Change Backend
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Connect to different server
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>

          {/* Data & Privacy */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              DATA & PRIVACY
            </Text>

            <GlassCard isDark={isDark} padding={0}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => router.push('/import/csv')}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.green}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>📥</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Import from CSV
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Import bank transactions
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.blue}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>📊</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Export Data
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Download all your data
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.gray}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>🗑️</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Clear Cache
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Free up storage space
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              ABOUT
            </Text>

            <GlassCard isDark={isDark} padding={0}>
              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.purple}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>ℹ️</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      App Version
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      1.0.0
                    </Text>
                  </View>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.blue}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>📜</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Terms & Conditions
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <TouchableOpacity style={styles.settingItem} activeOpacity={0.7}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.green}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>🔒</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Privacy Policy
                    </Text>
                  </View>
                </View>
                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>

          {/* Danger Zone */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              DANGER ZONE
            </Text>

            <GlassCard isDark={isDark} padding={0}>
              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.red}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>🚪</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.error }]}>
                      Logout
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              <TouchableOpacity
                style={styles.settingItem}
                onPress={handleDeleteAccount}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <View style={styles.settingIcon}>
                    <LinearGradient
                      colors={iconGradients.red}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.settingIconGradient}
                    >
                      <Text style={styles.settingIconEmoji}>⚠️</Text>
                    </LinearGradient>
                  </View>
                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.error }]}>
                      Delete Account
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Permanently delete all data
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </GlassCard>
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
              FinPal - Your Financial Companion
            </Text>
            <Text style={[styles.footerText, { color: colors.text.tertiary }]}>
              Made with 💛
            </Text>
          </View>
        </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    fontSize: 13,
    fontWeight: typography.weights.medium,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.base,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: typography.weights.bold,
    color: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  profileEmail: {
    fontSize: 16,
    fontWeight: typography.weights.bold,
    marginBottom: 4,
  },
  profileLabel: {
    fontSize: 13,
    fontWeight: typography.weights.semibold,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingIconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingIconEmoji: {
    fontSize: 20,
  },
  settingText: {
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: typography.weights.bold,
  },
  settingDescription: {
    fontSize: 13,
    fontWeight: typography.weights.semibold,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    fontWeight: typography.weights.regular,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  footer: {
    alignItems: 'center',
    padding: spacing.xl,
    marginTop: spacing.lg,
    paddingBottom: 100, // Extra padding for tab bar
  },
  footerText: {
    fontSize: 11,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },
});
