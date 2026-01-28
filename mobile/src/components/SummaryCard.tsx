import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './Card';
import { colors, typography, spacing } from '@theme';

interface SummaryCardProps {
  title: string;
  amount: number;
  currency?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'income' | 'expense' | 'balance' | 'default';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  amount,
  currency = 'USD',
  trend,
  icon,
  variant = 'default',
}) => {
  const getAmountColor = () => {
    if (variant === 'income') return colors.accent.green;
    if (variant === 'expense') return colors.accent.red;
    if (variant === 'balance') return amount >= 0 ? colors.accent.green : colors.accent.red;
    return colors.text.primary;
  };

  const formatAmount = (value: number) => {
    const formatted = Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return value < 0 ? `-$${formatted}` : `$${formatted}`;
  };

  return (
    <Card variant="glass" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          {icon && <View style={styles.icon}>{icon}</View>}
          <Text style={styles.title}>{title}</Text>
        </View>
        {trend && (
          <View style={styles.trendContainer}>
            <Text
              style={[
                styles.trendText,
                { color: trend.isPositive ? colors.accent.green : colors.accent.red },
              ]}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </Text>
          </View>
        )}
      </View>

      <Text style={[styles.amount, { color: getAmountColor() }]}>
        {formatAmount(amount)}
      </Text>

      {currency !== 'USD' && <Text style={styles.currency}>{currency}</Text>}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.lg,
    minWidth: 200,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  icon: {
    width: 24,
    height: 24,
  },

  title: {
    color: colors.text.secondary,
    ...typography.styles.bodySmall,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  trendContainer: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radius.sm,
    backgroundColor: colors.background.surfaceHover,
  },

  trendText: {
    ...typography.styles.captionSmall,
    fontWeight: typography.weights.semibold,
  },

  amount: {
    ...typography.styles.h1,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xs,
  },

  currency: {
    color: colors.text.tertiary,
    ...typography.styles.caption,
  },
});
