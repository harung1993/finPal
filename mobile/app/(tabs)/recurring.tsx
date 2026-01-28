import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '@theme';
import { GlassCard, GlassButton } from '@components';
import { useDarkMode } from '@hooks';

export default function RecurringScreen() {
  const { isDark, colors } = useDarkMode();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
      <LinearGradient colors={colors.background.light} style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.primary }]}>Recurring Transactions</Text>
          </View>

          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonIcon}>🔄</Text>
            <Text style={[styles.comingSoonTitle, { color: colors.text.primary }]}>Automated Transactions</Text>
            <Text style={[styles.comingSoonText, { color: colors.text.secondary }]}>
              Set up recurring income and expenses that happen automatically on schedule.
            </Text>
            <Text style={[styles.comingSoonBadge, { color: colors.primary, backgroundColor: colors.primary + '20' }]}>Coming Soon</Text>
          </View>

          <GlassCard isDark={isDark} style={styles.featureCard}>
            <Text style={[styles.featureTitle, { color: colors.text.secondary }]}>PLANNED FEATURES:</Text>
            <View style={styles.featureList}>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Set up recurring transactions</Text>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Daily, weekly, monthly, yearly schedules</Text>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Auto-create transactions on schedule</Text>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Skip or modify specific occurrences</Text>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Track subscription costs</Text>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Reminders for upcoming bills</Text>
            </View>
          </GlassCard>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  header: { padding: spacing.lg },
  title: { fontSize: 32, fontWeight: typography.weights.black as any },
  comingSoon: { alignItems: 'center', padding: spacing.xl, marginTop: spacing.xl },
  comingSoonIcon: { fontSize: 64, marginBottom: spacing.md },
  comingSoonTitle: { ...typography.styles.h2, marginBottom: spacing.sm },
  comingSoonText: { ...typography.styles.body1, textAlign: 'center', marginBottom: spacing.lg },
  comingSoonBadge: { ...typography.styles.button, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 20 },
  featureCard: { margin: spacing.lg, padding: spacing.lg },
  featureTitle: { ...typography.styles.h3, marginBottom: spacing.md },
  featureList: { gap: spacing.sm },
  featureItem: { ...typography.styles.body1 },
});
