import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Modal, Button, Input } from '@components';
import { colors, typography, spacing } from '@theme';
import { Group, GroupFormData } from '@services/groupService';

interface GroupFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: GroupFormData) => void;
  initialData?: Group | null;
  isLoading?: boolean;
}

const SPLIT_METHODS = [
  { value: 'equal', label: 'Equal', icon: '⚖️', description: 'Split evenly' },
  { value: 'percentage', label: 'Percentage', icon: '%', description: 'By percentage' },
  { value: 'custom', label: 'Custom', icon: '✏️', description: 'Specify amounts' },
  { value: 'shares', label: 'Shares', icon: '📊', description: 'By shares/units' },
] as const;

export const GroupForm: React.FC<GroupFormProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<GroupFormData>({
    name: '',
    description: '',
    default_split_method: 'equal',
    auto_include_all: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        default_split_method: initialData.default_split_method,
        auto_include_all: initialData.auto_include_all,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        default_split_method: 'equal',
        auto_include_all: true,
      });
    }
    setErrors({});
  }, [initialData, visible]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Group name is required';
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
      description: '',
      default_split_method: 'equal',
      auto_include_all: true,
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title={initialData ? 'Edit Group' : 'Create Group'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Group Name */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Group Name *</Text>
          <Input
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="e.g., Roommates, Trip to Paris"
            error={errors.name}
          />
        </View>

        {/* Description */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
            placeholder="Add details about this group..."
            multiline
            numberOfLines={3}
            style={styles.textArea}
            placeholderTextColor={colors.text.tertiary}
          />
        </View>

        {/* Default Split Method */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Default Split Method *</Text>
          <Text style={styles.description}>
            How should expenses be split by default?
          </Text>
          <View style={styles.splitMethodGrid}>
            {SPLIT_METHODS.map((method) => (
              <TouchableOpacity
                key={method.value}
                style={[
                  styles.splitMethodButton,
                  formData.default_split_method === method.value &&
                    styles.splitMethodButtonActive,
                ]}
                onPress={() =>
                  setFormData({ ...formData, default_split_method: method.value })
                }
              >
                <Text style={styles.splitMethodIcon}>{method.icon}</Text>
                <Text
                  style={[
                    styles.splitMethodLabel,
                    formData.default_split_method === method.value &&
                      styles.splitMethodLabelActive,
                  ]}
                >
                  {method.label}
                </Text>
                <Text style={styles.splitMethodDescription}>
                  {method.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Auto-include All Members */}
        <View style={styles.fieldContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() =>
              setFormData({ ...formData, auto_include_all: !formData.auto_include_all })
            }
          >
            <View
              style={[
                styles.checkbox,
                formData.auto_include_all && styles.checkboxChecked,
              ]}
            >
              {formData.auto_include_all && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.checkboxTextContainer}>
              <Text style={styles.checkboxLabel}>Auto-include all members</Text>
              <Text style={styles.checkboxDescription}>
                Automatically include all group members when creating an expense
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
              <Text style={styles.buttonText}>
                {initialData ? 'Update' : 'Create'}
              </Text>
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
  description: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    marginBottom: spacing.sm,
  },
  textArea: {
    ...typography.styles.body1,
    backgroundColor: colors.surface.secondary,
    borderRadius: 12,
    padding: spacing.md,
    color: colors.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  splitMethodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  splitMethodButton: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.surface.secondary,
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  splitMethodButtonActive: {
    borderColor: colors.primary.default,
    backgroundColor: colors.primary.default + '20',
  },
  splitMethodIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  splitMethodLabel: {
    ...typography.styles.body2,
    color: colors.text.secondary,
    fontWeight: '600',
    marginBottom: spacing.xxs,
  },
  splitMethodLabelActive: {
    color: colors.primary.default,
  },
  splitMethodDescription: {
    ...typography.styles.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
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
