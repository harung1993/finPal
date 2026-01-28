import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '@theme';

interface BudgetProgressBarProps {
  name: string;
  categoryName: string;
  amount: number;
  spent: number;
  percentage: number;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  name,
  categoryName,
  amount,
  spent,
  percentage,
}) => {
  const getProgressColor = () => {
    if (percentage >= 100) return colors.accent.red;
    if (percentage >= 80) return colors.accent.orange;
    return colors.primary.green;
  };

  const formatAmount = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.category}>{categoryName}</Text>
        </View>
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      </View>

      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getProgressColor(),
            },
          ]}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.spent}>${formatAmount(spent)} spent</Text>
        <Text style={styles.total}>of ${formatAmount(amount)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.background.surface,
    borderRadius: spacing.radius.base,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.sm,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },

  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },

  name: {
    color: colors.text.primary,
    ...typography.styles.body,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },

  category: {
    color: colors.text.tertiary,
    ...typography.styles.caption,
  },

  percentage: {
    color: colors.text.primary,
    ...typography.styles.body,
    fontWeight: typography.weights.bold,
  },

  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background.surfaceHover,
    borderRadius: spacing.radius.full,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },

  progressBar: {
    height: '100%',
    borderRadius: spacing.radius.full,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  spent: {
    color: colors.text.secondary,
    ...typography.styles.caption,
  },

  total: {
    color: colors.text.tertiary,
    ...typography.styles.caption,
  },
});
