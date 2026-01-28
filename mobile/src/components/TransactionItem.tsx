import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '@theme';

interface TransactionItemProps {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category?: {
    name: string;
    icon: string;
  };
  onPress?: () => void;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  description,
  amount,
  date,
  type,
  category,
  onPress,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatAmount = (value: number) => {
    return Math.abs(value).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{category?.icon || '💵'}</Text>
      </View>

      <View style={styles.details}>
        <Text style={styles.description} numberOfLines={1}>
          {description}
        </Text>
        <View style={styles.meta}>
          {category && <Text style={styles.category}>{category.name}</Text>}
          <Text style={styles.date}>{formatDate(date)}</Text>
        </View>
      </View>

      <Text
        style={[
          styles.amount,
          { color: type === 'income' ? colors.accent.green : colors.accent.red },
        ]}
      >
        {type === 'income' ? '+' : '-'}${formatAmount(amount)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.background.surface,
    borderRadius: spacing.radius.base,
    borderWidth: 1,
    borderColor: colors.border.default,
    marginBottom: spacing.sm,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: spacing.radius.base,
    backgroundColor: colors.background.surfaceHover,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  icon: {
    fontSize: 20,
  },

  details: {
    flex: 1,
    marginRight: spacing.md,
  },

  description: {
    color: colors.text.primary,
    ...typography.styles.body,
    marginBottom: spacing.xs,
  },

  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  category: {
    color: colors.text.tertiary,
    ...typography.styles.caption,
  },

  date: {
    color: colors.text.tertiary,
    ...typography.styles.caption,
  },

  amount: {
    ...typography.styles.body,
    fontWeight: typography.weights.semibold,
  },
});
