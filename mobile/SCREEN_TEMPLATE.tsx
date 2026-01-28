/**
 * LIQUID GLASS SCREEN TEMPLATE
 * Copy this template when creating or updating screens
 *
 * Features:
 * - Full light/dark mode support
 * - Gradient background
 * - Glass card components
 * - Proper typography
 * - Theme-aware colors
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { GlassCard, GlassButton } from '@components';
import { spacing, typography, iconGradients } from '@theme';
import { useDarkMode } from '@hooks/useDarkMode';

export default function TemplateScreen() {
  const router = useRouter();
  const { isDark, colors } = useDarkMode();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    // Fetch data here
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
      <LinearGradient colors={colors.background.light} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backText, { color: colors.text.primary }]}>
              ← Back
            </Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text.primary }]}>
            Screen Title
          </Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Content */}
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* Page Title */}
          <Text style={[styles.pageTitle, { color: colors.primary }]}>
            Welcome to FinPal
          </Text>
          <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
            Your financial companion
          </Text>

          {/* Section with Glass Cards */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              QUICK ACTIONS
            </Text>

            <GlassCard isDark={isDark} padding={0} style={styles.card}>
              {/* Setting Item Pattern */}
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => console.log('Item pressed')}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  {/* Icon with gradient */}
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
                      View Analytics
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      See your financial insights
                    </Text>
                  </View>
                </View>

                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={[styles.divider, { backgroundColor: colors.border.light }]} />

              {/* Another Item */}
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => console.log('Item pressed')}
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
                      <Text style={styles.settingIconEmoji}>💰</Text>
                    </LinearGradient>
                  </View>

                  <View style={styles.settingText}>
                    <Text style={[styles.settingName, { color: colors.text.primary }]}>
                      Add Transaction
                    </Text>
                    <Text style={[styles.settingDescription, { color: colors.text.secondary }]}>
                      Record income or expense
                    </Text>
                  </View>
                </View>

                <Text style={[styles.chevron, { color: colors.text.tertiary }]}>›</Text>
              </TouchableOpacity>
            </GlassCard>
          </View>

          {/* Another Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
              INFORMATION
            </Text>

            <GlassCard isDark={isDark} padding={20}>
              <Text style={[styles.bodyText, { color: colors.text.primary }]}>
                This is a template screen showing the Liquid Glass design system.
                Use this as a reference when updating or creating new screens.
              </Text>

              {/* Badge Example */}
              <View style={styles.badgeContainer}>
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.badgeText}>NEW</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.success }]}>
                  <Text style={styles.badgeText}>ACTIVE</Text>
                </View>
              </View>
            </GlassCard>
          </View>

          {/* Button Examples */}
          <View style={styles.section}>
            <GlassButton
              title="Primary Action"
              onPress={() => console.log('Primary')}
              variant="primary"
              size="medium"
              isDark={isDark}
            />

            <GlassButton
              title="Secondary Action"
              onPress={() => console.log('Secondary')}
              variant="secondary"
              size="medium"
              isDark={isDark}
              style={{ marginTop: spacing.md }}
            />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backText: {
    fontSize: 16,
    fontWeight: typography.weights.semibold,
    width: 60,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.tight,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xl,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing.sm,
  },
  card: {
    marginBottom: 0,
  },
  bodyText: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
    lineHeight: 24,
    marginBottom: spacing.base,
  },

  // Setting Item Styles
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

  // Badge Styles
  badgeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: typography.weights.heavy,
    color: '#1f2937',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
