import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Users, DollarSign, ChevronRight, Settings } from 'lucide-react-native';
import { colors, typography, spacing } from '@theme';
import { groupService, Group } from '@services/groupService';
import { GroupForm } from '@components/GroupForm';

export const GroupsScreen: React.FC = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setIsLoading(true);
      const data = await groupService.getAll();
      setGroups(data);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to load groups');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadGroups();
  };

  const handleCreateGroup = () => {
    setSelectedGroup(null);
    setShowForm(true);
  };

  const handleEditGroup = (group: Group) => {
    setSelectedGroup(group);
    setShowForm(true);
  };

  const handleSubmitGroup = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedGroup) {
        await groupService.update(selectedGroup.id, data);
        Alert.alert('Success', 'Group updated successfully');
      } else {
        await groupService.create(data);
        Alert.alert('Success', 'Group created successfully');
      }
      setShowForm(false);
      loadGroups();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to save group');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGroup = (group: Group) => {
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${group.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await groupService.delete(group.id);
              Alert.alert('Success', 'Group deleted successfully');
              loadGroups();
            } catch (error: any) {
              Alert.alert('Error', error.response?.data?.error || 'Failed to delete group');
            }
          },
        },
      ]
    );
  };

  const getSplitMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      equal: 'Equal Split',
      percentage: 'Percentage Split',
      custom: 'Custom Split',
      shares: 'Shares Split',
    };
    return labels[method] || method;
  };

  const renderGroupCard = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupCard}
      onPress={() => handleEditGroup(item)}
      activeOpacity={0.7}
    >
      <View style={styles.groupHeader}>
        <View style={styles.groupIcon}>
          <Users size={24} color={colors.primary.default} />
        </View>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{item.name}</Text>
          {item.description && (
            <Text style={styles.groupDescription} numberOfLines={1}>
              {item.description}
            </Text>
          )}
        </View>
        <ChevronRight size={20} color={colors.text.tertiary} />
      </View>

      <View style={styles.groupDetails}>
        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Users size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              {item.members?.length || 0} members
            </Text>
          </View>
          <View style={styles.detailItem}>
            <DollarSign size={16} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              {getSplitMethodLabel(item.default_split_method)}
            </Text>
          </View>
        </View>

        {item.auto_include_all && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Auto-include enabled</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Users size={64} color={colors.text.tertiary} />
      <Text style={styles.emptyTitle}>No Groups Yet</Text>
      <Text style={styles.emptyDescription}>
        Create a group to split expenses with friends, roommates, or family
      </Text>
      <TouchableOpacity style={styles.emptyButton} onPress={handleCreateGroup}>
        <Plus size={20} color={colors.text.inverse} />
        <Text style={styles.emptyButtonText}>Create Your First Group</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Groups</Text>
          <Text style={styles.subtitle}>
            {groups.length} {groups.length === 1 ? 'group' : 'groups'}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleCreateGroup}>
          <Plus size={24} color={colors.text.inverse} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroupCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContainer,
          groups.length === 0 && styles.emptyListContainer,
        ]}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary.default}
          />
        }
        showsVerticalScrollIndicator={false}
      />

      <GroupForm
        visible={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleSubmitGroup}
        initialData={selectedGroup}
        isLoading={isSubmitting}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  title: {
    ...typography.styles.h1,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  subtitle: {
    ...typography.styles.body2,
    color: colors.text.secondary,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.default,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary.default,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  listContainer: {
    padding: spacing.lg,
  },
  emptyListContainer: {
    flex: 1,
  },
  groupCard: {
    backgroundColor: colors.surface.primary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border.default,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.default + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    ...typography.styles.h3,
    color: colors.text.primary,
    marginBottom: spacing.xxs,
  },
  groupDescription: {
    ...typography.styles.body2,
    color: colors.text.secondary,
  },
  groupDetails: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  detailText: {
    ...typography.styles.caption,
    color: colors.text.secondary,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.success.default + '20',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
  },
  badgeText: {
    ...typography.styles.caption,
    color: colors.success.default,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    ...typography.styles.h2,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptyDescription: {
    ...typography.styles.body1,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary.default,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  emptyButtonText: {
    ...typography.styles.button,
    color: colors.text.inverse,
  },
});
