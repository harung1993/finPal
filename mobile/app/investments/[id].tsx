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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors, typography, spacing } from '@theme';
import { Card } from '@components';
import {
  useHolding,
  useInvestmentTransactions,
  useStockQuote,
  useStockHistory,
} from '@hooks/useInvestments';

export default function InvestmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const investmentId = parseInt(id, 10);

  const [selectedPeriod, setSelectedPeriod] = useState('1mo');

  // React Query hooks
  const { data: holding, isLoading: holdingLoading, refetch: refetchHolding } = useHolding(investmentId);
  const { data: transactions, isLoading: transactionsLoading, refetch: refetchTransactions } =
    useInvestmentTransactions(investmentId);
  const { data: quote, isLoading: quoteLoading } = useStockQuote(holding?.symbol);
  const { data: history, isLoading: historyLoading } = useStockHistory(holding?.symbol, 'US', selectedPeriod);

  const isLoading = holdingLoading || transactionsLoading;

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

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get gain/loss color
  const getGainLossColor = (value: number) => {
    if (value > 0) return colors.success.default;
    if (value < 0) return colors.error.default;
    return colors.text.secondary;
  };

  // Get transaction type badge color
  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'buy':
        return colors.success.default;
      case 'sell':
        return colors.error.default;
      case 'dividend':
        return colors.info.default;
      case 'split':
        return colors.warning.default;
      default:
        return colors.text.secondary;
    }
  };

  // Refresh function
  const handleRefresh = () => {
    refetchHolding();
    refetchTransactions();
  };

  if (isLoading && !holding) {
    return (
      <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={styles.gradient}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary.green} />
          <Text style={styles.loadingText}>Loading investment details...</Text>
        </View>
      </LinearGradient>
    );
  }

  if (!holding) {
    return (
      <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={styles.gradient}>
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Investment not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#0f172a', '#1e293b', '#0f172a']} style={styles.gradient}>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} tintColor={colors.primary.green} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButtonSmall}>
            <Text style={styles.backButtonSmallText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.symbol}>{holding.symbol}</Text>
        </View>

        {/* Stock Info Card */}
        <Card variant="glass" style={styles.infoCard}>
          <Text style={styles.stockName}>{holding.name || 'Unknown'}</Text>

          <View style={styles.priceSection}>
            <Text style={styles.currentPrice}>{formatCurrency(holding.current_price || 0)}</Text>
            <View style={styles.changeContainer}>
              <Text style={[styles.changeText, { color: getGainLossColor(holding.gain_loss || 0) }]}>
                {formatCurrency(holding.gain_loss || 0)}
              </Text>
              <Text style={[styles.changePercent, { color: getGainLossColor(holding.gain_loss || 0) }]}>
                {formatPercentage(holding.gain_loss_percentage || 0)}
              </Text>
            </View>
          </View>

          {holding.sector && (
            <View style={styles.sectorInfo}>
              <Text style={styles.sectorText}>{holding.sector}</Text>
              {holding.industry && (
                <>
                  <Text style={styles.sectorDivider}>•</Text>
                  <Text style={styles.sectorText}>{holding.industry}</Text>
                </>
              )}
            </View>
          )}
        </Card>

        {/* Holdings Summary */}
        <Card variant="glass" style={styles.summaryCard}>
          <Text style={styles.cardTitle}>Your Position</Text>

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Shares</Text>
              <Text style={styles.summaryValue}>{holding.shares.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Avg Cost</Text>
              <Text style={styles.summaryValue}>{formatCurrency(holding.purchase_price)}</Text>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Cost</Text>
              <Text style={styles.summaryValue}>{formatCurrency(holding.cost_basis || 0)}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Market Value</Text>
              <Text style={styles.summaryValue}>{formatCurrency(holding.current_value || 0)}</Text>
            </View>
          </View>

          {holding.purchase_date && (
            <View style={styles.purchaseDate}>
              <Text style={styles.purchaseDateLabel}>Purchase Date:</Text>
              <Text style={styles.purchaseDateValue}>{formatDate(holding.purchase_date)}</Text>
            </View>
          )}

          {holding.notes && (
            <View style={styles.notes}>
              <Text style={styles.notesLabel}>Notes:</Text>
              <Text style={styles.notesText}>{holding.notes}</Text>
            </View>
          )}
        </Card>

        {/* Chart Period Selector */}
        <View style={styles.periodSelector}>
          {['1d', '1mo', '3mo', '1y', '5y'].map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.periodButton, selectedPeriod === period && styles.periodButtonActive]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[styles.periodButtonText, selectedPeriod === period && styles.periodButtonTextActive]}>
                {period.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Placeholder */}
        <Card variant="glass" style={styles.chartCard}>
          {historyLoading ? (
            <View style={styles.chartLoading}>
              <ActivityIndicator size="small" color={colors.primary.green} />
              <Text style={styles.chartLoadingText}>Loading chart...</Text>
            </View>
          ) : history && history.length > 0 ? (
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>📈 Chart</Text>
              <Text style={styles.chartPlaceholderSubtext}>
                {history.length} data points ({selectedPeriod})
              </Text>
              <Text style={styles.chartPlaceholderNote}>
                Price range: {formatCurrency(Math.min(...history.map(h => h.low)))} - {formatCurrency(Math.max(...history.map(h => h.high)))}
              </Text>
            </View>
          ) : (
            <View style={styles.chartPlaceholder}>
              <Text style={styles.chartPlaceholderText}>No chart data available</Text>
            </View>
          )}
        </Card>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert('Coming soon', 'Buy more shares')}>
            <Text style={styles.actionButtonIcon}>📈</Text>
            <Text style={styles.actionButtonText}>Buy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => Alert.alert('Coming soon', 'Sell shares')}
          >
            <Text style={styles.actionButtonIcon}>📉</Text>
            <Text style={styles.actionButtonText}>Sell</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonSecondary]}
            onPress={() => Alert.alert('Coming soon', 'Add dividend')}
          >
            <Text style={styles.actionButtonIcon}>💰</Text>
            <Text style={styles.actionButtonText}>Dividend</Text>
          </TouchableOpacity>
        </View>

        {/* Transaction History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>

          {transactions && transactions.length > 0 ? (
            transactions.map((transaction) => (
              <Card key={transaction.id} variant="glass" style={styles.transactionCard}>
                <View style={styles.transactionHeader}>
                  <View>
                    <View style={styles.transactionType}>
                      <View
                        style={[
                          styles.transactionTypeBadge,
                          { backgroundColor: getTransactionTypeColor(transaction.transaction_type) },
                        ]}
                      />
                      <Text style={styles.transactionTypeText}>
                        {transaction.transaction_type.toUpperCase()}
                      </Text>
                    </View>
                    <Text style={styles.transactionDate}>{formatDate(transaction.date)}</Text>
                  </View>
                  <View style={styles.transactionValue}>
                    <Text style={styles.transactionShares}>{transaction.shares} shares</Text>
                    <Text style={styles.transactionPrice}>@ {formatCurrency(transaction.price)}</Text>
                  </View>
                </View>

                <View style={styles.transactionFooter}>
                  <Text style={styles.transactionTotal}>
                    Total: {formatCurrency(transaction.transaction_value || 0)}
                  </Text>
                  {transaction.fees && transaction.fees > 0 && (
                    <Text style={styles.transactionFees}>Fees: {formatCurrency(transaction.fees)}</Text>
                  )}
                </View>

                {transaction.notes && (
                  <Text style={styles.transactionNotes}>{transaction.notes}</Text>
                )}
              </Card>
            ))
          ) : (
            <Card variant="glass" style={styles.emptyCard}>
              <Text style={styles.emptyText}>No transaction history</Text>
            </Card>
          )}
        </View>

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
    padding: spacing.xl,
  },
  loadingText: {
    color: colors.text.secondary,
    ...typography.styles.body,
    marginTop: spacing.md,
  },
  errorText: {
    color: colors.error.default,
    ...typography.styles.h3,
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  backButtonSmall: {
    marginBottom: spacing.sm,
  },
  backButtonSmallText: {
    color: colors.primary.green,
    ...typography.styles.body,
  },
  symbol: {
    color: colors.text.primary,
    fontSize: 32,
    fontWeight: typography.weights.bold,
  },
  infoCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  stockName: {
    color: colors.text.secondary,
    ...typography.styles.body,
    marginBottom: spacing.md,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  currentPrice: {
    color: colors.text.primary,
    fontSize: 36,
    fontWeight: typography.weights.bold,
  },
  changeContainer: {
    alignItems: 'flex-end',
  },
  changeText: {
    fontSize: 18,
    fontWeight: typography.weights.semibold,
  },
  changePercent: {
    fontSize: 14,
    marginTop: spacing.xs,
  },
  sectorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectorText: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  sectorDivider: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginHorizontal: spacing.xs,
  },
  summaryCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  cardTitle: {
    color: colors.text.primary,
    ...typography.styles.h3,
    marginBottom: spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    color: colors.text.primary,
    ...typography.styles.h3,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: spacing.md,
  },
  purchaseDate: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  purchaseDateLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginRight: spacing.xs,
  },
  purchaseDateValue: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  notes: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 8,
  },
  notesLabel: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginBottom: spacing.xs,
  },
  notesText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  periodButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    marginHorizontal: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.primary.green,
  },
  periodButtonText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: typography.weights.semibold,
  },
  periodButtonTextActive: {
    color: '#000',
  },
  chartCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
    minHeight: 200,
  },
  chartLoading: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  chartLoadingText: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: spacing.sm,
  },
  chartPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  chartPlaceholderText: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  chartPlaceholderSubtext: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  chartPlaceholderNote: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.primary.green,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionButtonIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  actionButtonText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: typography.weights.semibold,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.text.primary,
    ...typography.styles.h2,
    marginBottom: spacing.md,
  },
  transactionCard: {
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  transactionType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  transactionTypeBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: spacing.xs,
  },
  transactionTypeText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: typography.weights.semibold,
  },
  transactionDate: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  transactionValue: {
    alignItems: 'flex-end',
  },
  transactionShares: {
    color: colors.text.primary,
    fontSize: 14,
  },
  transactionPrice: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  transactionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  transactionTotal: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: typography.weights.semibold,
  },
  transactionFees: {
    color: colors.text.tertiary,
    fontSize: 12,
  },
  transactionNotes: {
    color: colors.text.tertiary,
    fontSize: 12,
    marginTop: spacing.sm,
    fontStyle: 'italic',
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.text.tertiary,
    ...typography.styles.body,
  },
  backButton: {
    backgroundColor: colors.primary.green,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 8,
    marginTop: spacing.lg,
  },
  backButtonText: {
    color: '#000',
    ...typography.styles.body,
    fontWeight: typography.weights.semibold,
  },
});
