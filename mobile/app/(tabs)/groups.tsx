import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '@theme';
import { useDarkMode } from '@hooks';
import { GlassCard, GlassButton } from '@components';

export default function GroupsScreen() {
  const { isDark, colors } = useDarkMode();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
      <LinearGradient colors={colors.background.light} style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text.secondary }]}>GROUPS</Text>
          </View>

          <View style={styles.comingSoon}>
            <Text style={styles.comingSoonIcon}>👥</Text>
            <Text style={[styles.comingSoonTitle, { color: colors.text.primary }]}>Group Expenses</Text>
            <Text style={[styles.comingSoonText, { color: colors.text.secondary }]}>
              Split expenses with friends and family. Track who owes what and settle debts easily.
            </Text>
            <Text style={[styles.comingSoonBadge, { color: colors.primary, backgroundColor: colors.primary + '20' }]}>Coming Soon</Text>
          </View>

          <GlassCard isDark={isDark} style={styles.featureCard}>
            <Text style={[styles.featureTitle, { color: colors.text.secondary }]}>PLANNED FEATURES:</Text>
            <View style={styles.featureList}>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Create expense sharing groups</Text>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Split bills equally or by percentage</Text>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Track who paid and who owes</Text>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Settle up with group members</Text>
              <Text style={[styles.featureItem, { color: colors.text.secondary }]}>• Group expense history</Text>
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
  title: { fontSize: 32, fontWeight: typography.weights.black },
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
