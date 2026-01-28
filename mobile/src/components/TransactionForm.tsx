import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Modal, Input, Button, Card } from '@components';
import { colors, typography, spacing } from '@theme';
import { useCategories } from '@hooks/useCategories';
import { useAccounts } from '@hooks/useAccounts';

interface TransactionFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => void;
  initialData?: TransactionFormData;
  isLoading?: boolean;
}

export interface TransactionFormData {
  description: string;
  amount: string;
  date: string;
  type: 'income' | 'expense';
  category_id?: number;
  account_id: number;
  notes?: string;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const { data: categories } = useCategories();
  const { data: accounts } = useAccounts();

  const [formData, setFormData] = useState<TransactionFormData>({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'expense',
    account_id: 0,
    notes: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        account_id: accounts?.[0]?.id || 0,
        notes: '',
      });
    }
  }, [initialData, visible, accounts]);

  const handleSubmit = () => {
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!formData.account_id) {
      Alert.alert('Error', 'Please select an account');
      return;
    }

    onSubmit(formData);
  };

  const filteredCategories = categories?.filter((cat) => cat.type === formData.type);

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Add Transaction'}
      size="large"
      footer={
        <>
          <Button title="Cancel" onPress={onClose} variant="ghost" />
          <Button
            title={initialData ? 'Update' : 'Add'}
            onPress={handleSubmit}
            loading={isLoading}
          />
        </>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Type Toggle */}
        <View style={styles.typeContainer}>
          <Button
            title="Expense"
            onPress={() => setFormData({ ...formData, type: 'expense' })}
            variant={formData.type === 'expense' ? 'primary' : 'outline'}
            style={styles.typeButton}
          />
          <Button
            title="Income"
            onPress={() => setFormData({ ...formData, type: 'income' })}
            variant={formData.type === 'income' ? 'primary' : 'outline'}
            style={styles.typeButton}
          />
        </View>

        <Input
          label="Description *"
          placeholder="e.g., Grocery shopping"
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
        />

        <Input
          label="Amount *"
          placeholder="0.00"
          value={formData.amount}
          onChangeText={(text) => setFormData({ ...formData, amount: text })}
          keyboardType="decimal-pad"
          leftIcon={<Text style={styles.dollarSign}>$</Text>}
        />

        <Input
          label="Date *"
          placeholder="YYYY-MM-DD"
          value={formData.date}
          onChangeText={(text) => setFormData({ ...formData, date: text })}
        />

        {/* Category Picker */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {filteredCategories?.map((category) => (
              <Button
                key={category.id}
                title={`${category.icon} ${category.name}`}
                onPress={() => setFormData({ ...formData, category_id: category.id })}
                variant={formData.category_id === category.id ? 'primary' : 'outline'}
                size="small"
                style={styles.categoryButton}
              />
            ))}
          </View>
        </View>

        {/* Account Picker */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Account *</Text>
          <View style={styles.accountGrid}>
            {accounts?.map((account) => (
              <Button
                key={account.id}
                title={account.name}
                onPress={() => setFormData({ ...formData, account_id: account.id })}
                variant={formData.account_id === account.id ? 'primary' : 'outline'}
                size="small"
                style={styles.accountButton}
              />
            ))}
          </View>
        </View>

        <Input
          label="Notes"
          placeholder="Additional notes (optional)"
          value={formData.notes}
          onChangeText={(text) => setFormData({ ...formData, notes: text })}
          multiline
        />
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },

  typeButton: {
    flex: 1,
  },

  dollarSign: {
    color: colors.text.secondary,
    ...typography.styles.body,
  },

  fieldContainer: {
    marginBottom: spacing.base,
  },

  label: {
    color: colors.text.secondary,
    marginBottom: spacing.sm,
    ...typography.styles.bodySmall,
    fontWeight: typography.weights.medium,
  },

  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  categoryButton: {
    flexGrow: 0,
  },

  accountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  accountButton: {
    flexGrow: 0,
  },
});
