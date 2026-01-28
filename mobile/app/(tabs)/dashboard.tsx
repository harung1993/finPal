import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { spacing, typography, iconGradients } from '@theme';
import { SummaryCard, Card, TransactionItem, BudgetProgressBar, GlassCard } from '@components';
import { useDashboard, useBudgetProgress } from '@hooks/useAnalytics';
import { useDarkMode } from '@hooks/useDarkMode';

export default function DashboardScreen() {
  const router = useRouter();
  const { isDark, colors } = useDarkMode();
  const { data: dashboardData, isLoading, error, refetch } = useDashboard();
  const { data: budgetData, isLoading: budgetsLoading } = useBudgetProgress();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
        <LinearGradient colors={colors.background.light} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading dashboard...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
        <LinearGradient colors={colors.background.light} style={styles.errorContainer}>
          <Text style={[styles.errorTitle, { color: colors.text.primary }]}>Unable to load dashboard</Text>
          <Text style={[styles.errorText, { color: colors.text.secondary }]}>
            {(error as any)?.response?.data?.message || 'Please try again later'}
          </Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
      <LinearGradient colors={colors.background.light} style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.greeting, { color: colors.text.secondary }]}>Welcome back!</Text>
              <Text style={[styles.title, { color: colors.primary }]}>Dashboard</Text>
            </View>
          </View>

      {/* Summary Cards */}
      <View style={styles.summarySection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.summaryCards}>
            <SummaryCard
              title="Total Balance"
              amount={dashboardData?.summary.net_balance || 0}
              variant="balance"
              icon={<Text style={styles.cardIcon}>💰</Text>}
            />
            <SummaryCard
              title="Total Income"
              amount={dashboardData?.summary.total_income || 0}
              variant="income"
              icon={<Text style={styles.cardIcon}>📈</Text>}
            />
            <SummaryCard
              title="Total Expenses"
              amount={dashboardData?.summary.total_expenses || 0}
              variant="expense"
              icon={<Text style={styles.cardIcon}>📉</Text>}
            />
            <SummaryCard
              title="Transactions"
              amount={dashboardData?.summary.transaction_count || 0}
              icon={<Text style={styles.cardIcon}>💵</Text>}
            />
          </View>
        </ScrollView>
      </View>

          {/* Budget Progress */}
          {!budgetsLoading && budgetData && budgetData.budgets.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                BUDGET PROGRESS
              </Text>
              <GlassCard isDark={isDark} padding={20}>
                {budgetData.budgets.slice(0, 3).map((budget) => (
                  <BudgetProgressBar
                    key={budget.id}
                    name={budget.name}
                    categoryName={budget.category_name}
                    amount={budget.amount}
                    spent={budget.spent}
                    percentage={budget.percentage}
                  />
                ))}
              </GlassCard>
            </View>
          )}

          {/* Recent Transactions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                RECENT TRANSACTIONS
              </Text>
              {dashboardData && dashboardData.recent_transactions.length > 0 && (
                <Text
                  style={[styles.sectionLink, { color: colors.primary }]}
                  onPress={() => router.push('/(tabs)/transactions')}
                >
                  View All
                </Text>
              )}
            </View>

            {dashboardData && dashboardData.recent_transactions.length > 0 ? (
              <View style={styles.transactionsList}>
                {dashboardData.recent_transactions.slice(0, 5).map((transaction) => (
                  <TransactionItem
                    key={transaction.id}
                    id={transaction.id}
                    description={transaction.description}
                    amount={transaction.amount}
                    date={transaction.date}
                    type={transaction.type}
                    category={transaction.category}
                    onPress={() => {
                      // Will add transaction detail view later
                    }}
                  />
                ))}
              </View>
            ) : (
              <GlassCard isDark={isDark} padding={40}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={[styles.emptyTitle, { color: colors.text.primary }]}>No transactions yet</Text>
                <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
                  Start tracking your expenses by adding your first transaction
                </Text>
              </GlassCard>
            )}
          </View>

          {/* Spending by Category */}
          {dashboardData && dashboardData.spending_by_category.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>
                SPENDING BY CATEGORY
              </Text>
              <GlassCard isDark={isDark} padding={20}>
                {dashboardData.spending_by_category.slice(0, 5).map((item, index) => (
                  <View key={index} style={styles.categoryItem}>
                    <View style={styles.categoryInfo}>
                      <Text style={[styles.categoryName, { color: colors.text.primary }]}>{item.category}</Text>
                      <Text style={[styles.categoryAmount, { color: colors.text.primary }]}>
                        ${item.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                    <View style={[styles.categoryBarContainer, { backgroundColor: colors.glass.backgroundDark }]}>
                      <View
                        style={[
                          styles.categoryBar,
                          { width: `${item.percentage}%`, backgroundColor: colors.primary },
                        ]}
                      />
                    </View>
                    <Text style={[styles.categoryPercentage, { color: colors.text.tertiary }]}>{item.percentage.toFixed(1)}%</Text>
                  </View>
                ))}
              </GlassCard>
            </View>
          )}
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

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
    marginTop: spacing.md,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  errorTitle: {
    fontSize: 24,
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.md,
    textAlign: 'center',
  },

  errorText: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },

  header: {
    marginBottom: spacing.xl,
  },

  greeting: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
    marginBottom: spacing.xs,
  },

  title: {
    fontSize: 32,
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.tight,
  },

  summarySection: {
    marginBottom: spacing.xl,
  },

  summaryCards: {
    flexDirection: 'row',
    gap: spacing.md,
  },

  cardIcon: {
    fontSize: 20,
  },

  section: {
    marginBottom: 24,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: typography.letterSpacing.wide,
    marginBottom: spacing.sm,
  },

  sectionLink: {
    fontSize: 14,
    fontWeight: typography.weights.semibold,
  },

  transactionsList: {
    gap: spacing.sm,
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
    textAlign: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: typography.weights.black,
    letterSpacing: typography.letterSpacing.tight,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
    textAlign: 'center',
  },

  categoryItem: {
    marginBottom: spacing.md,
  },

  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },

  categoryName: {
    fontSize: 16,
    fontWeight: typography.weights.medium,
  },

  categoryAmount: {
    fontSize: 16,
    fontWeight: typography.weights.semibold,
  },

  categoryBarContainer: {
    height: 6,
    borderRadius: spacing.radius.full,
    marginBottom: spacing.xs,
  },

  categoryBar: {
    height: '100%',
    borderRadius: spacing.radius.full,
  },

  categoryPercentage: {
    fontSize: 12,
    fontWeight: typography.weights.medium,
    textAlign: 'right',
  },
});
