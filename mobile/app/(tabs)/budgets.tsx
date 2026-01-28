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
import { Card, BudgetForm, BudgetProgressBar, GlassCard, GlassButton } from '@components';
import { useBudgets, useCreateBudget, useUpdateBudget, useDeleteBudget } from '@hooks/useBudgets';
import { useCategories } from '@hooks/useCategories';
import { Budget, BudgetFormData } from '@services/budgetService';
import { useDarkMode } from '@hooks/useDarkMode';

export default function BudgetsScreen() {
  const { isDark, colors } = useDarkMode();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);

  // React Query hooks
  const { data: budgets, isLoading, isError, refetch } = useBudgets();
  const { data: categories } = useCategories();
  const createMutation = useCreateBudget();
  const updateMutation = useUpdateBudget();
  const deleteMutation = useDeleteBudget();

  // Calculate total budget and spent
  const calculateTotals = () => {
    if (!budgets) return { totalBudget: 0, totalSpent: 0 };

    const totalBudget = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    const totalSpent = budgets.reduce((sum, budget) => sum + (budget.spent || 0), 0);

    return { totalBudget, totalSpent };
  };

  const { totalBudget, totalSpent } = calculateTotals();

  // Get category name
  const getCategoryName = (categoryId: number) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  // Get category icon
  const getCategoryIcon = (categoryId: number) => {
    const category = categories?.find((cat) => cat.id === categoryId);
    return category?.icon || '📁';
  };

  // Get budget status color
  const getBudgetStatusColor = (spent: number, amount: number) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) return colors.error.default;
    if (percentage >= 80) return colors.warning.default;
    return colors.success.default;
  };

  // Handle create budget
  const handleCreate = async (data: BudgetFormData) => {
    try {
      await createMutation.mutateAsync(data);
      setShowAddModal(false);
      Alert.alert('Success', 'Budget created successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create budget');
    }
  };

  // Handle update budget
  const handleUpdate = async (data: BudgetFormData) => {
    if (!editingBudget) return;

    try {
      await updateMutation.mutateAsync({ id: editingBudget.id, data });
      setEditingBudget(null);
      Alert.alert('Success', 'Budget updated successfully');
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to update budget');
    }
  };

  // Handle delete budget
  const handleDelete = (budget: Budget) => {
    Alert.alert(
      'Delete Budget',
      `Are you sure you want to delete ${budget.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMutation.mutateAsync(budget.id);
              Alert.alert('Success', 'Budget deleted successfully');
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to delete budget');
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
            <Text style={[styles.loadingText, { color: colors.text.secondary }]}>Loading budgets...</Text>
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
            <Text style={[styles.errorText, { color: colors.text.primary }]}>Failed to load budgets</Text>
            <GlassButton isDark={isDark} onPress={() => refetch()}>
              <Text style={[styles.retryButtonText, { color: colors.text.primary }]}>Retry</Text>
            </GlassButton>
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
          <Text style={[styles.title, { color: colors.text.primary }]}>BUDGETS</Text>
          <GlassButton isDark={isDark} onPress={() => setShowAddModal(true)}>
            <Text style={[styles.addButtonText, { color: colors.text.primary }]}>+ Add</Text>
          </GlassButton>
        </View>

        {/* Summary Cards */}
        {budgets && budgets.length > 0 && (
          <View style={styles.summaryContainer}>
            <GlassCard isDark={isDark} style={styles.summaryCardWide}>
              <Text style={[styles.summaryLabel, { color: colors.text.secondary }]}>TOTAL BUDGET</Text>
              <Text style={[styles.summaryValue, { color: colors.text.primary }]}>${totalBudget.toFixed(2)}</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressInfo}>
                  <Text style={[styles.progressLabel, { color: colors.text.secondary }]}>Spent: ${totalSpent.toFixed(2)}</Text>
                  <Text style={[styles.progressLabel, { color: colors.text.secondary }]}>
                    Remaining: ${(totalBudget - totalSpent).toFixed(2)}
                  </Text>
                </View>
                <BudgetProgressBar spent={totalSpent} budget={totalBudget} />
              </View>
            </GlassCard>
          </View>
        )}

        {/* Budgets List */}
        {budgets && budgets.length > 0 ? (
          <View style={styles.budgetsList}>
            {budgets.map((budget) => {
              const spent = budget.spent || 0;
              const percentage = (spent / budget.amount) * 100;
              const statusColor = getBudgetStatusColor(spent, budget.amount);

              return (
                <TouchableOpacity key={budget.id} onPress={() => setEditingBudget(budget)} activeOpacity={0.7}>
                  <GlassCard isDark={isDark} style={styles.budgetCard}>
                    <View style={styles.budgetHeader}>
                      <View style={styles.budgetInfo}>
                        <Text style={styles.budgetIcon}>{getCategoryIcon(budget.category_id)}</Text>
                        <View style={styles.budgetDetails}>
                          <Text style={[styles.budgetName, { color: colors.text.primary }]}>{budget.name}</Text>
                          <Text style={[styles.budgetCategory, { color: colors.text.secondary }]}>{getCategoryName(budget.category_id)}</Text>
                        </View>
                      </View>
                      <View style={[styles.periodBadge, { backgroundColor: colors.primary + '30' }]}>
                        <Text style={[styles.periodText, { color: colors.primary }]}>
                          {budget.period}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.budgetBody}>
                      <View style={styles.amountsRow}>
                        <View style={styles.amountItem}>
                          <Text style={[styles.amountLabel, { color: colors.text.secondary }]}>Budget</Text>
                          <Text style={[styles.amountValue, { color: colors.text.primary }]}>${budget.amount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.amountItem}>
                          <Text style={[styles.amountLabel, { color: colors.text.secondary }]}>Spent</Text>
                          <Text style={[styles.amountValue, { color: statusColor }]}>
                            ${spent.toFixed(2)}
                          </Text>
                        </View>
                        <View style={styles.amountItem}>
                          <Text style={[styles.amountLabel, { color: colors.text.secondary }]}>Left</Text>
                          <Text style={[styles.amountValue, { color: statusColor }]}>
                            ${(budget.amount - spent).toFixed(2)}
                          </Text>
                        </View>
                      </View>

                      <BudgetProgressBar spent={spent} budget={budget.amount} />
                      <Text style={[styles.percentageText, { color: statusColor }]}>
                        {percentage.toFixed(1)}% used
                      </Text>
                    </View>

                    <GlassButton
                      isDark={isDark}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDelete(budget);
                      }}
                      style={styles.deleteButton}
                    >
                      <Text style={[styles.deleteButtonText, { color: colors.text.primary }]}>🗑️ Delete</Text>
                    </GlassButton>
                  </GlassCard>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>💰</Text>
            <Text style={styles.emptyStateTitle}>No budgets yet</Text>
            <Text style={styles.emptyStateText}>Create budgets to track your spending limits</Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={() => setShowAddModal(true)}>
              <Text style={styles.emptyStateButtonText}>Create Budget</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Add Budget Modal */}
      <BudgetForm
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending}
      />

      {/* Edit Budget Modal */}
      <BudgetForm
        visible={!!editingBudget}
        onClose={() => setEditingBudget(null)}
        onSubmit={handleUpdate}
        initialData={editingBudget}
        isLoading={updateMutation.isPending}
      />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  summaryContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  summaryCardWide: {
    width: '100%',
    padding: spacing.lg,
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
    ...typography.styles.h1,
    color: colors.text.primary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  progressContainer: {
    marginTop: spacing.sm,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  budgetsList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  budgetCard: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  budgetIcon: {
    fontSize: 32,
    marginRight: spacing.sm,
  },
  budgetDetails: {
    flex: 1,
  },
  budgetName: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: 2,
  },
  budgetCategory: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  periodBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  periodText: {
    ...typography.styles.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  budgetBody: {
    marginBottom: spacing.md,
  },
  amountsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  amountItem: {
    alignItems: 'center',
  },
  amountLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  amountValue: {
    ...typography.styles.body1,
    color: colors.text.primary,
    fontWeight: '600',
  },
  percentageText: {
    ...typography.styles.caption,
    textAlign: 'center',
    marginTop: spacing.xs,
    fontWeight: '600',
  },
  deleteButton: {
    padding: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.error.default + '20',
    borderRadius: 8,
  },
  deleteButtonText: {
    ...typography.styles.button,
    color: colors.error.default,
    fontSize: 14,
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
