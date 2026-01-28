import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { typography, spacing } from '@theme';
import { GlassCard, GlassButton } from '@components';
import { useDarkMode } from '@hooks/useDarkMode';
import { usePortfolios, useHoldings } from '@hooks/useInvestments';
import { Portfolio, Investment } from '@services/investmentService';

export default function InvestmentsScreen() {
  const { isDark, colors } = useDarkMode();
  const router = useRouter();
  const [selectedPortfolio, setSelectedPortfolio] = useState<number | null>(null);

  // React Query hooks
  const { data: portfolios, isLoading: portfoliosLoading, refetch: refetchPortfolios } = usePortfolios();
  const { data: holdings, isLoading: holdingsLoading, refetch: refetchHoldings } = useHoldings(
    selectedPortfolio || undefined
  );

  const isLoading = portfoliosLoading || holdingsLoading;

  // Calculate total portfolio value
  const calculateTotalValue = () => {
    if (!portfolios) return 0;
    return portfolios.reduce((sum, portfolio) => sum + (portfolio.total_value || 0), 0);
  };

  const calculateTotalGainLoss = () => {
    if (!portfolios) return 0;
    return portfolios.reduce((sum, portfolio) => sum + (portfolio.gain_loss || 0), 0);
  };

  const totalValue = calculateTotalValue();
  const totalGainLoss = calculateTotalGainLoss();
  const totalCost = totalValue - totalGainLoss;
  const totalGainLossPercentage = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (percentage: number) => {
    const sign = percentage >= 0 ? '+' : '';
    return `${sign}${percentage.toFixed(2)}%`;
  };

  // Get gain/loss color
  const getGainLossColor = (value: number) => {
    if (value > 0) return colors.success;
    if (value < 0) return colors.error;
    return colors.text.secondary;
  };

  // Refresh function
  const handleRefresh = () => {
    refetchPortfolios();
    refetchHoldings();
  };

  if (isLoading && !portfolios && !holdings) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
        <LinearGradient colors={colors.background.light} style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading investments...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
      <LinearGradient colors={colors.background.light} style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={colors.primary} />
          }
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Investments</Text>
          <GlassButton
            title="+ Portfolio"
            onPress={() => Alert.alert('Coming soon', 'Add portfolio')}
            isDark={isDark}
            variant="primary"
          />
        </View>

        {/* Total Summary Card */}
        <GlassCard isDark={isDark} style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>TOTAL PORTFOLIO VALUE</Text>
          </View>
          <Text style={[styles.summaryValue, { color: colors.text.primary }]}>{formatCurrency(totalValue)}</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryItemLabel, { color: colors.text.tertiary }]}>TOTAL COST</Text>
              <Text style={[styles.summaryItemValue, { color: colors.text.primary }]}>{formatCurrency(totalCost)}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={[styles.summaryItemLabel, { color: colors.text.tertiary }]}>GAIN/LOSS</Text>
              <Text style={[styles.summaryItemValue, { color: getGainLossColor(totalGainLoss) }]}>
                {formatCurrency(totalGainLoss)}
              </Text>
              <Text style={[styles.summaryItemPercentage, { color: getGainLossColor(totalGainLoss) }]}>
                {formatPercentage(totalGainLossPercentage)}
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Portfolio Filter */}
        {portfolios && portfolios.length > 0 && (
          <View style={styles.filterSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <GlassButton
                title="All Portfolios"
                onPress={() => setSelectedPortfolio(null)}
                isDark={isDark}
                variant={selectedPortfolio === null ? "primary" : "secondary"}
                style={styles.filterChip}
              />

              {portfolios.map((portfolio) => (
                <GlassButton
                  key={portfolio.id}
                  title={`${portfolio.name}\n${formatCurrency(portfolio.total_value || 0)}`}
                  onPress={() => setSelectedPortfolio(portfolio.id)}
                  isDark={isDark}
                  variant={selectedPortfolio === portfolio.id ? "primary" : "secondary"}
                  style={styles.filterChip}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Holdings List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>HOLDINGS</Text>
            <TouchableOpacity onPress={() => Alert.alert('Coming soon', 'Add holding')}>
              <Text style={[styles.sectionAction, { color: colors.primary }]}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {holdings && holdings.length > 0 ? (
            holdings.map((holding) => (
              <TouchableOpacity
                key={holding.id}
                onPress={() => router.push(`/investments/${holding.id}`)}
              >
                <Card variant="glass" style={styles.holdingCard}>
                  <View style={styles.holdingHeader}>
                    <View style={styles.holdingInfo}>
                      <Text style={styles.holdingSymbol}>{holding.symbol}</Text>
                      <Text style={styles.holdingName} numberOfLines={1}>
                        {holding.name || 'Unknown'}
                      </Text>
                    </View>
                    <View style={styles.holdingValue}>
                      <Text style={styles.holdingPrice}>
                        {formatCurrency(holding.current_price || 0)}
                      </Text>
                      <Text style={[styles.holdingChange, { color: getGainLossColor(holding.gain_loss || 0) }]}>
                        {formatCurrency(holding.gain_loss || 0)} ({formatPercentage(holding.gain_loss_percentage || 0)})
                      </Text>
                    </View>
                  </View>

                  <View style={styles.holdingDetails}>
                    <View style={styles.holdingDetailItem}>
                      <Text style={styles.holdingDetailLabel}>Shares</Text>
                      <Text style={styles.holdingDetailValue}>{holding.shares.toFixed(2)}</Text>
                    </View>
                    <View style={styles.holdingDetailItem}>
                      <Text style={styles.holdingDetailLabel}>Avg Cost</Text>
                      <Text style={styles.holdingDetailValue}>
                        {formatCurrency(holding.purchase_price)}
                      </Text>
                    </View>
                    <View style={styles.holdingDetailItem}>
                      <Text style={styles.holdingDetailLabel}>Total Value</Text>
                      <Text style={styles.holdingDetailValue}>
                        {formatCurrency(holding.current_value || 0)}
                      </Text>
                    </View>
                  </View>

                  {holding.sector && (
                    <View style={styles.holdingSector}>
                      <Text style={styles.holdingSectorText}>{holding.sector}</Text>
                      {holding.industry && (
                        <>
                          <Text style={styles.holdingSectorDivider}>•</Text>
                          <Text style={styles.holdingSectorText}>{holding.industry}</Text>
                        </>
                      )}
                    </View>
                  )}
                </Card>
              </TouchableOpacity>
            ))
          ) : (
            <Card variant="glass" style={styles.emptyCard}>
              <Text style={styles.emptyIcon}>📊</Text>
              <Text style={styles.emptyTitle}>No Holdings Yet</Text>
              <Text style={styles.emptyText}>
                {selectedPortfolio
                  ? 'Add your first stock or ETF to this portfolio'
                  : 'Create a portfolio and start tracking your investments'}
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => Alert.alert('Coming soon', 'Add holding')}
              >
                <Text style={styles.emptyButtonText}>Add Holding</Text>
              </TouchableOpacity>
            </Card>
          )}
        </View>

        {/* Portfolios Section */}
        {portfolios && portfolios.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Portfolios</Text>
            {portfolios.map((portfolio) => (
              <Card key={portfolio.id} variant="glass" style={styles.portfolioCard}>
                <View style={styles.portfolioHeader}>
                  <View>
                    <Text style={styles.portfolioName}>{portfolio.name}</Text>
                    {portfolio.description && (
                      <Text style={styles.portfolioDescription}>{portfolio.description}</Text>
                    )}
                  </View>
                  <Text style={styles.portfolioValue}>{formatCurrency(portfolio.total_value || 0)}</Text>
                </View>

                <View style={styles.portfolioStats}>
                  <View style={styles.portfolioStat}>
                    <Text style={styles.portfolioStatLabel}>Cost</Text>
                    <Text style={styles.portfolioStatValue}>{formatCurrency(portfolio.total_cost || 0)}</Text>
                  </View>
                  <View style={styles.portfolioStat}>
                    <Text style={styles.portfolioStatLabel}>Gain/Loss</Text>
                    <Text style={[styles.portfolioStatValue, { color: getGainLossColor(portfolio.gain_loss || 0) }]}>
                      {formatCurrency(portfolio.gain_loss || 0)}
                    </Text>
                  </View>
                  <View style={styles.portfolioStat}>
                    <Text style={styles.portfolioStatLabel}>Return</Text>
                    <Text
                      style={[
                        styles.portfolioStatValue,
                        { color: getGainLossColor(portfolio.gain_loss_percentage || 0) },
                      ]}
                    >
                      {formatPercentage(portfolio.gain_loss_percentage || 0)}
                    </Text>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}

        <View style={{ height: spacing['3xl'] }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.text.secondary,
    ...typography.styles.body,
    marginTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    color: colors.text.primary,
    ...typography.styles.h1,
  },
  addButton: {
    backgroundColor: colors.primary.green,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#000',
    ...typography.styles.bodySmall,
    fontWeight: typography.weights.semibold,
  },
  summaryCard: {
    marginBottom: spacing.lg,
    padding: spacing.xl,
  },
  summaryHeader: {
    marginBottom: spacing.xs,
  },
  summaryLabel: {
    color: colors.text.secondary,
    ...typography.styles.bodySmall,
  },
  summaryValue: {
    color: colors.text.primary,
    fontSize: 36,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
  },
  summaryItemLabel: {
    color: colors.text.tertiary,
    ...typography.styles.bodySmall,
    marginBottom: spacing.xs,
  },
  summaryItemValue: {
    color: colors.text.primary,
    ...typography.styles.h3,
  },
  summaryItemPercentage: {
    ...typography.styles.bodySmall,
    marginTop: spacing.xs,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: spacing.lg,
  },
  filterSection: {
    marginBottom: spacing.lg,
  },
  filterChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterChipActive: {
    backgroundColor: colors.primary.green,
    borderColor: colors.primary.green,
  },
  filterChipText: {
    color: colors.text.secondary,
    ...typography.styles.bodySmall,
    fontWeight: typography.weights.semibold,
  },
  filterChipTextActive: {
    color: '#000',
  },
  filterChipSubtext: {
    color: colors.text.tertiary,
    fontSize: 10,
    marginTop: 2,
  },
  filterChipSubtextActive: {
    color: 'rgba(0, 0, 0, 0.7)',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text.primary,
    ...typography.styles.h2,
  },
  sectionAction: {
    color: colors.primary.green,
    ...typography.styles.body,
    fontWeight: typography.weights.semibold,
  },
  holdingCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  holdingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  holdingInfo: {
    flex: 1,
  },
  holdingSymbol: {
    color: colors.text.primary,
    ...typography.styles.h3,
    marginBottom: spacing.xs,
  },
  holdingName: {
    color: colors.text.secondary,
    ...typography.styles.bodySmall,
  },
  holdingValue: {
    alignItems: 'flex-end',
  },
  holdingPrice: {
    color: colors.text.primary,
    ...typography.styles.h3,
    marginBottom: spacing.xs,
  },
  holdingChange: {
    ...typography.styles.bodySmall,
    fontWeight: typography.weights.semibold,
  },
  holdingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  holdingDetailItem: {
    alignItems: 'center',
  },
  holdingDetailLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    marginBottom: spacing.xs,
  },
  holdingDetailValue: {
    color: colors.text.secondary,
    ...typography.styles.bodySmall,
  },
  holdingSector: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  holdingSectorText: {
    color: colors.text.tertiary,
    fontSize: 10,
  },
  holdingSectorDivider: {
    color: colors.text.tertiary,
    fontSize: 10,
    marginHorizontal: spacing.xs,
  },
  emptyCard: {
    padding: spacing['2xl'],
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    color: colors.text.primary,
    ...typography.styles.h3,
    marginBottom: spacing.sm,
  },
  emptyText: {
    color: colors.text.secondary,
    ...typography.styles.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    backgroundColor: colors.primary.green,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#000',
    ...typography.styles.body,
    fontWeight: typography.weights.semibold,
  },
  portfolioCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  portfolioName: {
    color: colors.text.primary,
    ...typography.styles.h3,
    marginBottom: spacing.xs,
  },
  portfolioDescription: {
    color: colors.text.secondary,
    ...typography.styles.bodySmall,
  },
  portfolioValue: {
    color: colors.text.primary,
    ...typography.styles.h3,
  },
  portfolioStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  portfolioStat: {
    alignItems: 'center',
  },
  portfolioStatLabel: {
    color: colors.text.tertiary,
    fontSize: 10,
    marginBottom: spacing.xs,
  },
  portfolioStatValue: {
    color: colors.text.secondary,
    ...typography.styles.bodySmall,
    fontWeight: typography.weights.semibold,
  },
});
