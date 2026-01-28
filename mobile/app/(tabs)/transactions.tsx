import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography, spacing } from '@theme';
import { useDarkMode } from '@hooks/useDarkMode';
import { Button, Input, TransactionItem, Card, GlassCard, GlassButton } from '@components';
import { TransactionForm, TransactionFormData } from '@components/TransactionForm';
import {
  useTransactions,
  useCreateTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@hooks/useTransactions';
import { useCategories } from '@hooks/useCategories';
import { useAccounts } from '@hooks/useAccounts';

export default function TransactionsScreen() {
  const { isDark, colors } = useDarkMode();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [page, setPage] = useState(1);

  const { data: transactionsData, isLoading, error, refetch } = useTransactions({
    page,
    per_page: 20,
    search: searchQuery || undefined,
    type: filterType === 'all' ? undefined : filterType,
    category_id: selectedCategory || undefined,
  });

  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();

  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();
  const deleteMutation = useDeleteTransaction();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleAddTransaction = async (data: TransactionFormData) => {
    try {
      await createMutation.mutateAsync({
        description: data.description,
        amount: parseFloat(data.amount),
        date: data.date,
        type: data.type,
        category_id: data.category_id,
        account_id: data.account_id,
        notes: data.notes,
      });
      setShowAddModal(false);
      Alert.alert('Success', 'Transaction added successfully');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to add transaction');
    }
  };

  const handleEditTransaction = async (data: TransactionFormData) => {
    if (!editingTransaction) return;

    try {
      await updateMutation.mutateAsync({
        id: editingTransaction.id,
        data: {
          description: data.description,
          amount: parseFloat(data.amount),
          date: data.date,
          type: data.type,
          category_id: data.category_id,
          account_id: data.account_id,
          notes: data.notes,
        },
      });
      setEditingTransaction(null);
      Alert.alert('Success', 'Transaction updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error?.response?.data?.message || 'Failed to update transaction');
    }
  };

  const handleDeleteTransaction = (id: number) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(id);
              Alert.alert('Success', 'Transaction deleted');
            } catch (error: any) {
              Alert.alert('Error', 'Failed to delete transaction');
            }
          },
        },
      ]
    );
  };

  const handleTransactionPress = (transaction: any) => {
    setEditingTransaction(transaction);
  };

  if (isLoading && !transactionsData) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
        <LinearGradient colors={colors.background.light} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading transactions...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
      <LinearGradient colors={colors.background.light} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>TRANSACTIONS</Text>
          <GlassButton
            title="+ Add"
            onPress={() => setShowAddModal(true)}
            size="small"
            isDark={isDark}
          />
        </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />

        {/* Type Filter */}
        <View style={styles.typeFilters}>
          <GlassButton
            title="All"
            onPress={() => setFilterType('all')}
            variant={filterType === 'all' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
            isDark={isDark}
          />
          <GlassButton
            title="Income"
            onPress={() => setFilterType('income')}
            variant={filterType === 'income' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
            isDark={isDark}
          />
          <GlassButton
            title="Expenses"
            onPress={() => setFilterType('expense')}
            variant={filterType === 'expense' ? 'primary' : 'outline'}
            size="small"
            style={styles.filterButton}
            isDark={isDark}
          />
        </View>

        {/* Category Filter */}
        {categories && categories.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryFilters}>
              <GlassButton
                title="All Categories"
                onPress={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? 'primary' : 'outline'}
                size="small"
                style={styles.categoryFilterButton}
                isDark={isDark}
              />
              {categories.map((category) => (
                <GlassButton
                  key={category.id}
                  title={`${category.icon} ${category.name}`}
                  onPress={() => setSelectedCategory(category.id)}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  size="small"
                  style={styles.categoryFilterButton}
                  isDark={isDark}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      {/* Transactions List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {error ? (
          <GlassCard isDark={isDark} style={styles.errorCard}>
            <Text style={[styles.errorTitle, { color: colors.text.primary }]}>Error loading transactions</Text>
            <Text style={[styles.errorText, { color: colors.text.secondary }]}>
              {(error as any)?.response?.data?.message || 'Please try again'}
            </Text>
            <GlassButton title="Retry" onPress={() => refetch()} style={styles.retryButton} isDark={isDark} />
          </GlassCard>
        ) : transactionsData && transactionsData.transactions.length > 0 ? (
          <>
            <View style={styles.transactionsList}>
              {transactionsData.transactions.map((transaction) => (
                <View key={transaction.id} style={styles.transactionItemContainer}>
                  <View style={styles.transactionItemContent}>
                    <TransactionItem
                      id={transaction.id}
                      description={transaction.description}
                      amount={transaction.amount}
                      date={transaction.date}
                      type={transaction.type}
                      category={transaction.category}
                      onPress={() => handleTransactionPress(transaction)}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteTransaction(transaction.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Pagination */}
            {transactionsData.pagination && transactionsData.pagination.total_pages > 1 && (
              <View style={styles.pagination}>
                <GlassButton
                  title="Previous"
                  onPress={() => setPage(page - 1)}
                  disabled={page === 1}
                  variant="outline"
                  size="small"
                  isDark={isDark}
                />
                <Text style={[styles.pageInfo, { color: colors.text.secondary }]}>
                  Page {page} of {transactionsData.pagination.total_pages}
                </Text>
                <GlassButton
                  title="Next"
                  onPress={() => setPage(page + 1)}
                  disabled={page === transactionsData.pagination.total_pages}
                  variant="outline"
                  size="small"
                  isDark={isDark}
                />
              </View>
            )}
          </>
        ) : (
          <Card variant="glass" style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>💸</Text>
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptyText}>
              {searchQuery || filterType !== 'all' || selectedCategory
                ? 'Try adjusting your filters'
                : 'Add your first transaction to get started'}
            </Text>
            {!searchQuery && filterType === 'all' && !selectedCategory && (
              <Button
                title="Add Transaction"
                onPress={() => setShowAddModal(true)}
                style={styles.emptyButton}
              />
            )}
          </Card>
        )}
      </ScrollView>

      {/* Add Transaction Modal */}
      <TransactionForm
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTransaction}
        isLoading={createMutation.isPending}
      />

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <TransactionForm
          visible={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSubmit={handleEditTransaction}
          initialData={{
            description: editingTransaction.description,
            amount: editingTransaction.amount.toString(),
            date: editingTransaction.date.split('T')[0],
            type: editingTransaction.type,
            category_id: editingTransaction.category?.id,
            account_id: editingTransaction.account_id,
            notes: editingTransaction.notes,
          }}
          isLoading={updateMutation.isPending}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background.primary,
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
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },

  title: {
    color: colors.text.primary,
    ...typography.styles.h1,
  },

  filtersContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },

  searchInput: {
    marginBottom: spacing.md,
  },

  typeFilters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  filterButton: {
    flex: 1,
  },

  categoryFilters: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  categoryFilterButton: {
    marginRight: spacing.sm,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: spacing.lg,
    paddingTop: 0,
  },

  transactionsList: {
    gap: spacing.sm,
  },

  transactionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  transactionItemContent: {
    flex: 1,
  },

  deleteButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.surface,
    borderRadius: spacing.radius.base,
    borderWidth: 1,
    borderColor: colors.border.default,
  },

  deleteIcon: {
    fontSize: 20,
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },

  pageInfo: {
    color: colors.text.secondary,
    ...typography.styles.body,
  },

  errorCard: {
    padding: spacing.xl,
    alignItems: 'center',
  },

  errorTitle: {
    color: colors.text.primary,
    ...typography.styles.h3,
    marginBottom: spacing.sm,
  },

  errorText: {
    color: colors.text.secondary,
    ...typography.styles.body,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  retryButton: {
    marginTop: spacing.md,
  },

  emptyCard: {
    padding: spacing['3xl'],
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },

  emptyTitle: {
    color: colors.text.primary,
    ...typography.styles.h4,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  emptyText: {
    color: colors.text.secondary,
    ...typography.styles.body,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },

  emptyButton: {
    marginTop: spacing.md,
  },
});
