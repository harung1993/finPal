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
import { colors, typography, spacing } from '@theme';
import { useDarkMode } from '@theme/useDarkMode';
import { GlassCard, GlassButton, AccountForm } from '@components';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@hooks/useAccounts';
import { Account, AccountFormData } from '@services/accountService';

export default function AccountsScreen() {
  const { isDark, colors } = useDarkMode();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // React Query hooks
  const { data: accounts, isLoading, isError, refetch } = useAccounts();
  const createMutation = useCreateAccount();
  const updateMutation = useUpdateAccount();
  const deleteMutation = useDeleteAccount();

  // Calculate summary
  const calculateSummary = () => {
    if (!accounts) return { totalAssets: 0, totalLiabilities: 0, netWorth: 0 };

    let totalAssets = 0;
    let totalLiabilities = 0;

    accounts.forEach((account) => {
      if (account.account_type === 'credit' || account.account_type === 'loan') {
        totalLiabilities += Math.abs(account.balance);
      } else {
        totalAssets += account.balance;
      }
    });

    const netWorth = totalAssets - totalLiabilities;

    return { totalAssets, totalLiabilities, netWorth };
  };

  const { totalAssets, totalLiabilities, netWorth } = calculateSummary();

  // Get account type badge color
  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'checking':
        return colors.info.default;
      case 'savings':
        return colors.success.default;
      case 'credit':
        return colors.error.default;
      case 'investment':
        return colors.warning.default;
      case 'loan':
        return colors.error.dark;
      default:
        return colors.text.secondary;
    }
  };

  // Get account type icon
  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'checking':
        return '💳';
      case 'savings':
        return '🏦';
      case 'credit':
        return '💳';
      case 'investment':
        return '📈';
      case 'loan':
        return '💰';
      default:
        return '📝';
    }
  };

  // Handle create account
  const handleCreate = async (data: AccountFormData) => {
    try {
      await createMutation.mutateAsync(data);
      setShowAddModal(false);
      Alert.alert('Success', 'Account created successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create account');
    }
  };

  // Handle update account
  const handleUpdate = async (data: AccountFormData) => {
    if (!editingAccount) return;

    try {
      await updateMutation.mutateAsync({ id: editingAccount.id, data });
      setEditingAccount(null);
      Alert.alert('Success', 'Account updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update account');
    }
  };

  // Handle delete account
  const handleDelete = (account: Account) => {
    Alert.alert(
      'Delete Account',
      `Are you sure you want to delete ${account.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(account.id);
              Alert.alert('Success', 'Account deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to delete account');
            }
          },
        },
      ]
    );
  };

  // Render loading state
  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
        <LinearGradient colors={colors.background.light} style={styles.container}>
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading accounts...</Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  // Render error state
  if (isError) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
        <LinearGradient colors={colors.background.light} style={styles.container}>
          <View style={styles.centerContainer}>
            <Text style={[styles.errorText, { color: colors.text.primary }]}>Failed to load accounts</Text>
            <GlassButton isDark={isDark} onPress={() => refetch()} title="Retry" />
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
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} tintColor={colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>Accounts</Text>
          <GlassButton isDark={isDark} onPress={() => setShowAddModal(true)} title="+ Add" />
        </View>

        {/* Summary Cards */}
        {accounts && accounts.length > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>SUMMARY</Text>
            {/* Total Assets */}
            <GlassCard isDark={isDark} style={styles.summaryCard}>
              <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Total Assets</Text>
              <Text style={[styles.summaryValue, { color: colors.text.primary }]}>${totalAssets.toFixed(2)}</Text>
            </GlassCard>

            {/* Total Liabilities */}
            <GlassCard isDark={isDark} style={styles.summaryCard}>
              <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Total Liabilities</Text>
              <Text style={[styles.summaryValue, { color: colors.text.primary }]}>${totalLiabilities.toFixed(2)}</Text>
            </GlassCard>

            {/* Net Worth */}
            <GlassCard isDark={isDark} style={styles.summaryCardWide}>
              <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>Net Worth</Text>
              <Text style={[styles.summaryValue, styles.summaryValueLarge, { color: colors.text.primary }]}>${netWorth.toFixed(2)}</Text>
            </GlassCard>
          </View>
        )}

        {/* Accounts List */}
        {accounts && accounts.length > 0 ? (
          <View style={styles.accountsList}>
            <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>YOUR ACCOUNTS</Text>
            {accounts.map((account) => (
              <TouchableOpacity key={account.id} onPress={() => setEditingAccount(account)} activeOpacity={0.7}>
                <GlassCard isDark={isDark} style={styles.accountCard}>
                  <View style={styles.accountHeader}>
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountIcon}>{getAccountTypeIcon(account.account_type)}</Text>
                      <View style={styles.accountDetails}>
                        <Text style={[styles.accountName, { color: colors.text.primary }]}>{account.name}</Text>
                        {account.institution && <Text style={[styles.accountInstitution, { color: colors.text.secondary }]}>{account.institution}</Text>}
                      </View>
                    </View>
                    <View
                      style={[styles.accountTypeBadge, { backgroundColor: getAccountTypeColor(account.account_type) + '30' }]}
                    >
                      <Text style={[styles.accountTypeText, { color: getAccountTypeColor(account.account_type) }]}>
                        {account.account_type}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.accountFooter}>
                    <View style={styles.balanceContainer}>
                      <Text style={[styles.balanceLabel, { color: colors.text.secondary }]}>Balance</Text>
                      <Text style={[styles.balanceValue, { color: colors.text.primary }, account.balance < 0 && styles.balanceNegative]}>
                        {account.currency_code} ${Math.abs(account.balance).toFixed(2)}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDelete(account);
                      }}
                    >
                      <Text style={styles.deleteButtonText}>🗑️</Text>
                    </TouchableOpacity>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🏦</Text>
            <Text style={[styles.emptyStateTitle, { color: colors.text.primary }]}>No accounts yet</Text>
            <Text style={[styles.emptyStateText, { color: colors.text.secondary }]}>Add your first account to start tracking your finances</Text>
            <GlassButton isDark={isDark} onPress={() => setShowAddModal(true)} title="Add Account" />
          </View>
        )}
      </ScrollView>

      {/* Add Account Modal */}
      <AccountForm
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit Account Modal */}
      <AccountForm
        visible={!!editingAccount}
        onClose={() => setEditingAccount(null)}
        onSubmit={handleUpdate}
        initialData={editingAccount}
        isLoading={updateMutation.isPending}
      />
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
    backgroundColor: colors.background.primary,
  },
  scrollView: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
  },
  loadingText: {
    ...typography.styles.body1,
    color: colors.text.secondary,
    marginTop: spacing.md,
  },
  errorText: {
    ...typography.styles.body1,
    color: colors.error.default,
    marginBottom: spacing.md,
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary.default,
    borderRadius: 8,
  },
  retryButtonText: {
    ...typography.styles.button,
    color: colors.text.inverse,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.styles.h1,
    color: colors.text.primary,
  },
  addButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.primary.default,
    borderRadius: 8,
  },
  addButtonText: {
    ...typography.styles.button,
    color: colors.text.inverse,
  },
  sectionTitle: {
    ...typography.styles.caption,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    width: '100%',
  },
  summaryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  summaryCardWide: {
    width: '100%',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  summaryLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    ...typography.styles.h2,
    color: colors.text.primary,
    fontWeight: '700',
  },
  summaryValueLarge: {
    ...typography.styles.h1,
  },
  accountsList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  accountCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  accountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountIcon: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  accountDetails: {
    flex: 1,
  },
  accountName: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: 2,
  },
  accountInstitution: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  accountTypeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  accountTypeText: {
    ...typography.styles.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  accountFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceContainer: {
    flex: 1,
  },
  balanceLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  balanceValue: {
    ...typography.styles.h3,
    color: colors.text.primary,
    fontWeight: '600',
  },
  balanceNegative: {
    color: colors.error.default,
  },
  deleteButton: {
    padding: spacing.sm,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    marginTop: spacing.xl * 2,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    ...typography.styles.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyStateButton: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary.default,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    ...typography.styles.button,
    color: colors.text.inverse,
  },
});
