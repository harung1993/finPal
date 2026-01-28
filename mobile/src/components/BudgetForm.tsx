import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Modal, Button, Input } from '@components';
import { colors, typography, spacing } from '@theme';
import { Budget, BudgetFormData } from '@services/budgetService';
import { useCategories } from '@hooks/useCategories';

interface BudgetFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => void;
  initialData?: Budget | null;
  isLoading?: boolean;
}

const PERIODS = [
  { value: 'weekly', label: 'Weekly', icon: '📅' },
  { value: 'monthly', label: 'Monthly', icon: '📆' },
  { value: 'yearly', label: 'Yearly', icon: '🗓️' },
] as const;

export const BudgetForm: React.FC<BudgetFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { data: categories } = useCategories();

  const [formData, setFormData] = useState<BudgetFormData>({
    name: '',
    amount: 0,
    period: 'monthly',
    category_id: 0,
    start_date: new Date().toISOString().split('T')[0],
    is_active: true,
    rollover: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        amount: initialData.amount,
        period: initialData.period,
        category_id: initialData.category_id,
        start_date: initialData.start_date,
        end_date: initialData.end_date,
        is_active: initialData.is_active,
        rollover: initialData.rollover || false,
      });
    } else {
      setFormData({
        name: '',
        amount: 0,
        period: 'monthly',
        category_id: 0,
        start_date: new Date().toISOString().split('T')[0],
        is_active: true,
        rollover: false,
      });
    }
    setErrors({});
  }, [initialData, visible]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Budget name is required';
    }

    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.category_id) {
      newErrors.category_id = 'Please select a category';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      amount: 0,
      period: 'monthly',
      category_id: 0,
      start_date: new Date().toISOString().split('T')[0],
      is_active: true,
      rollover: false,
    });
    setErrors({});
    onClose();
  };

  // Filter expense categories only
  const expenseCategories = categories?.filter(cat => cat.type === 'expense') || [];

  return (
    <Modal visible={visible} onClose={handleClose} title={initialData ? 'Edit Budget' : 'Add Budget'}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Budget Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Budget Name *</Text>
          <Input
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="e.g., Monthly Groceries"
            error={errors.name}
          />
        </View>

        {/* Amount */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Budget Amount *</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <Input
              value={formData.amount.toString()}
              onChangeText={(text) => {
                const numericValue = parseFloat(text) || 0;
                setFormData({ ...formData, amount: numericValue });
              }}
              placeholder="0.00"
              keyboardType="numeric"
              error={errors.amount}
              style={styles.amountInput}
            />
          </View>
        </View>

        {/* Period */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Budget Period *</Text>
          <View style={styles.periodGrid}>
            {PERIODS.map((period) => (
              <TouchableOpacity
                key={period.value}
                style={[
                  styles.periodButton,
                  formData.period === period.value && styles.periodButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, period: period.value })}
              >
                <Text style={styles.periodIcon}>{period.icon}</Text>
                <Text
                  style={[
                    styles.periodLabel,
                    formData.period === period.value && styles.periodLabelActive,
                  ]}
                >
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Category */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category *</Text>
          {errors.category_id && <Text style={styles.errorText}>{errors.category_id}</Text>}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
          >
            {expenseCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryButton,
                  formData.category_id === category.id && styles.categoryButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, category_id: category.id })}
              >
                <Text style={styles.categoryIcon}>{category.icon || '📁'}</Text>
                <Text
                  style={[
                    styles.categoryLabel,
                    formData.category_id === category.id && styles.categoryLabelActive,
                  ]}
                  numberOfLines={1}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Start Date */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Start Date *</Text>
          <Input
            value={formData.start_date}
            onChangeText={(text) => setFormData({ ...formData, start_date: text })}
            placeholder="YYYY-MM-DD"
          />
        </View>

        {/* Rollover Option */}
        <View style={styles.fieldContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setFormData({ ...formData, rollover: !formData.rollover })}
          >
            <View style={[styles.checkbox, formData.rollover && styles.checkboxChecked]}>
              {formData.rollover && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxLabel}>Rollover unused budget</Text>
              <Text style={styles.checkboxDescription}>
                Carry over unspent budget to the next period
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button variant="secondary" onPress={handleClose} style={styles.button}>
            Cancel
          </Button>
          <Button onPress={handleSubmit} disabled={isLoading} style={styles.button}>
            {isLoading ? (
              <ActivityIndicator size="small" color={colors.text.inverse} />
            ) : (
              <Text style={styles.buttonText}>{initialData ? 'Update' : 'Add'}</Text>
            )}
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.styles.body2,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  errorText: {
    ...typography.styles.caption,
    color: colors.error.default,
    marginTop: spacing.xs,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
  },
  periodGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  periodButton: {
    flex: 1,
    backgroundColor: colors.surface.secondary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  periodButtonActive: {
    borderColor: colors.primary.default,
    backgroundColor: colors.primary.default + '20',
  },
  periodIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  periodLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  periodLabelActive: {
    color: colors.primary.default,
    fontWeight: '600',
  },
  categoryScroll: {
    marginTop: spacing.xs,
  },
  categoryButton: {
    backgroundColor: colors.surface.secondary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: spacing.sm,
    minWidth: 80,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  categoryButtonActive: {
    borderColor: colors.primary.default,
    backgroundColor: colors.primary.default + '20',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  categoryLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  categoryLabelActive: {
    color: colors.primary.default,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  button: {
    flex: 1,
  },
  buttonText: {
    color: colors.text.inverse,
    ...typography.styles.button,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.text.secondary,
    backgroundColor: colors.surface.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: colors.primary.default,
    backgroundColor: colors.primary.default,
  },
  checkmark: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '700',
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxLabel: {
    ...typography.styles.body2,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  checkboxDescription: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
});
