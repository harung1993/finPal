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
  TextInput,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { typography, spacing } from '@theme';
import { useDarkMode } from '@hooks/useDarkMode';
import { GlassCard, GlassButton, Modal, Input } from '@components';
import { useCategories } from '@hooks/useCategories';
import { Category } from '@services/categoryService';
import api from '@services/api';

export default function CategoriesScreen() {
  const { isDark, colors } = useDarkMode();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', type: 'expense' as 'income' | 'expense', icon: '📁' });

  const { data: categories, isLoading, isError, refetch } = useCategories();

  const handleSubmit = async () => {
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        Alert.alert('Success', 'Category updated');
      } else {
        await api.post('/categories', formData);
        Alert.alert('Success', 'Category created');
      }
      setShowAddModal(false);
      setEditingCategory(null);
      setFormData({ name: '', type: 'expense', icon: '📁' });
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, type: category.type, icon: category.icon || '📁' });
    setShowAddModal(true);
  };

  const handleDelete = (category: Category) => {
    Alert.alert('Delete Category', `Delete "${category.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/categories/${category.id}`);
            Alert.alert('Success', 'Category deleted');
            refetch();
          } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to delete');
          }
        },
      },
    ]);
  };

  const handleCreateDefaults = async () => {
    try {
      await api.post('/categories/defaults');
      Alert.alert('Success', 'Default categories created');
      refetch();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create defaults');
    }
  };

  const expenseCategories = categories?.filter((c) => c.type === 'expense') || [];
  const incomeCategories = categories?.filter((c) => c.type === 'income') || [];

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
        <LinearGradient colors={colors.background.light} style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background.light[0] }]}>
      <LinearGradient colors={colors.background.light} style={styles.container}>
        <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text.primary }]}>CATEGORIES</Text>
          <View style={styles.headerButtons}>
            <GlassButton isDark={isDark} variant="secondary" onPress={handleCreateDefaults}>
              + Defaults
            </GlassButton>
            <GlassButton isDark={isDark} onPress={() => setShowAddModal(true)}>
              + Add
            </GlassButton>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>EXPENSE CATEGORIES ({expenseCategories.length})</Text>
          {expenseCategories.map((cat) => (
            <GlassCard key={cat.id} isDark={isDark} style={styles.categoryCard}>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryName, { color: colors.text.primary }]}>{cat.name}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleEdit(cat)} style={styles.actionButton}>
                    <Text>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(cat)} style={styles.actionButton}>
                    <Text>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text.secondary }]}>INCOME CATEGORIES ({incomeCategories.length})</Text>
          {incomeCategories.map((cat) => (
            <GlassCard key={cat.id} isDark={isDark} style={styles.categoryCard}>
              <View style={styles.categoryRow}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[styles.categoryName, { color: colors.text.primary }]}>{cat.name}</Text>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleEdit(cat)} style={styles.actionButton}>
                    <Text>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(cat)} style={styles.actionButton}>
                    <Text>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          ))}
        </View>
      </ScrollView>

      <Modal visible={showAddModal} onClose={() => {
        setShowAddModal(false);
        setEditingCategory(null);
        setFormData({ name: '', type: 'expense', icon: '📁' });
      }} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <View style={styles.formContainer}>
          <Input
            label="Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
            placeholder="e.g., Groceries"
          />

          <Text style={[styles.label, { color: colors.text.secondary }]}>Type</Text>
          <View style={styles.typeButtons}>
            <TouchableOpacity
              style={[styles.typeButton, formData.type === 'expense' && styles.typeButtonActive]}
              onPress={() => setFormData({ ...formData, type: 'expense' })}
            >
              <Text style={[styles.typeButtonText, { color: colors.text.secondary }, formData.type === 'expense' && { color: colors.primary }]}>Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, formData.type === 'income' && styles.typeButtonActive]}
              onPress={() => setFormData({ ...formData, type: 'income' })}
            >
              <Text style={[styles.typeButtonText, { color: colors.text.secondary }, formData.type === 'income' && { color: colors.primary }]}>Income</Text>
            </TouchableOpacity>
          </View>

          <Input
            label="Icon (Emoji)"
            value={formData.icon}
            onChangeText={(text) => setFormData({ ...formData, icon: text })}
            placeholder="📁"
            maxLength={2}
          />

          <View style={styles.modalButtons}>
            <GlassButton isDark={isDark} variant="secondary" onPress={() => setShowAddModal(false)} style={styles.modalButton}>
              Cancel
            </GlassButton>
            <GlassButton isDark={isDark} onPress={handleSubmit} style={styles.modalButton}>
              {editingCategory ? 'Update' : 'Create'}
            </GlassButton>
          </View>
        </View>
      </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: spacing.lg, alignItems: 'center' },
  headerButtons: { flexDirection: 'row', gap: spacing.sm },
  title: { fontSize: 32, fontWeight: typography.weights.black, textTransform: 'uppercase' },
  section: { marginBottom: spacing.lg, paddingHorizontal: spacing.lg },
  sectionTitle: { ...typography.styles.h3, marginBottom: spacing.sm, textTransform: 'uppercase' },
  categoryCard: { padding: spacing.md, marginBottom: spacing.sm },
  categoryRow: { flexDirection: 'row', alignItems: 'center' },
  categoryIcon: { fontSize: 24, marginRight: spacing.sm },
  categoryName: { ...typography.styles.body1, flex: 1 },
  actions: { flexDirection: 'row', gap: spacing.sm },
  actionButton: { padding: spacing.xs },
  formContainer: { gap: spacing.md },
  label: { ...typography.styles.body2, marginBottom: spacing.xs },
  typeButtons: { flexDirection: 'row', gap: spacing.sm },
  typeButton: { flex: 1, padding: spacing.md, borderRadius: 8, alignItems: 'center', borderWidth: 2, borderColor: 'transparent' },
  typeButtonActive: { borderWidth: 2 },
  typeButtonText: { ...typography.styles.button },
  modalButtons: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.lg },
  modalButton: { flex: 1 },
});
