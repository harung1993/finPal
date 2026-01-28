import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Modal, Button, Input } from '@components';
import { colors, typography, spacing } from '@theme';
import { Account, AccountFormData } from '@services/accountService';

interface AccountFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: AccountFormData) => void;
  initialData?: Account | null;
  isLoading?: boolean;
}

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Checking', icon: '💳' },
  { value: 'savings', label: 'Savings', icon: '🏦' },
  { value: 'credit', label: 'Credit Card', icon: '💳' },
  { value: 'investment', label: 'Investment', icon: '📈' },
  { value: 'loan', label: 'Loan', icon: '💰' },
  { value: 'other', label: 'Other', icon: '📝' },
] as const;

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
];

export const AccountForm: React.FC<AccountFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<AccountFormData>({
    name: '',
    account_type: 'checking',
    balance: 0,
    currency_code: 'USD',
    institution: '',
    account_number: '',
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        account_type: initialData.account_type as any,
        balance: initialData.balance,
        currency_code: initialData.currency_code,
        institution: initialData.institution || '',
        account_number: initialData.account_number || '',
        is_active: initialData.is_active,
      });
    } else {
      setFormData({
        name: '',
        account_type: 'checking',
        balance: 0,
        currency_code: 'USD',
        institution: '',
        account_number: '',
        is_active: true,
      });
    }
    setErrors({});
  }, [initialData, visible]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required';
    }

    if (formData.balance === undefined || formData.balance === null) {
      newErrors.balance = 'Balance is required';
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
      account_type: 'checking',
      balance: 0,
      currency_code: 'USD',
      institution: '',
      account_number: '',
      is_active: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleClose} title={initialData ? 'Edit Account' : 'Add Account'}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Account Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Account Name *</Text>
          <Input
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="e.g., Chase Checking"
            error={errors.name}
          />
        </View>

        {/* Account Type */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Account Type *</Text>
          <View style={styles.typeGrid}>
            {ACCOUNT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  formData.account_type === type.value && styles.typeButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, account_type: type.value })}
              >
                <Text style={styles.typeIcon}>{type.icon}</Text>
                <Text
                  style={[
                    styles.typeLabel,
                    formData.account_type === type.value && styles.typeLabelActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Balance */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Current Balance *</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>
              {CURRENCIES.find((c) => c.code === formData.currency_code)?.symbol || '$'}
            </Text>
            <Input
              value={formData.balance.toString()}
              onChangeText={(text) => {
                const numericValue = parseFloat(text) || 0;
                setFormData({ ...formData, balance: numericValue });
              }}
              placeholder="0.00"
              keyboardType="numeric"
              error={errors.balance}
              style={styles.amountInput}
            />
          </View>
        </View>

        {/* Currency */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Currency</Text>
          <View style={styles.currencyGrid}>
            {CURRENCIES.map((currency) => (
              <TouchableOpacity
                key={currency.code}
                style={[
                  styles.currencyButton,
                  formData.currency_code === currency.code && styles.currencyButtonActive,
                ]}
                onPress={() => setFormData({ ...formData, currency_code: currency.code })}
              >
                <Text style={styles.currencySymbolLarge}>{currency.symbol}</Text>
                <Text
                  style={[
                    styles.currencyCode,
                    formData.currency_code === currency.code && styles.currencyCodeActive,
                  ]}
                >
                  {currency.code}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Institution */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Financial Institution (Optional)</Text>
          <Input
            value={formData.institution}
            onChangeText={(text) => setFormData({ ...formData, institution: text })}
            placeholder="e.g., Chase Bank"
          />
        </View>

        {/* Account Number */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Account Number (Optional)</Text>
          <Input
            value={formData.account_number}
            onChangeText={(text) => setFormData({ ...formData, account_number: text })}
            placeholder="Last 4 digits"
            maxLength={4}
            keyboardType="numeric"
          />
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.surface.secondary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonActive: {
    borderColor: colors.primary.default,
    backgroundColor: colors.primary.default + '20',
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  typeLabel: {
    ...typography.styles.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  typeLabelActive: {
    color: colors.primary.default,
    fontWeight: '600',
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
  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  currencyButton: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: colors.surface.secondary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  currencyButtonActive: {
    borderColor: colors.primary.default,
    backgroundColor: colors.primary.default + '20',
  },
  currencySymbolLarge: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  currencyCode: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  currencyCodeActive: {
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
});
