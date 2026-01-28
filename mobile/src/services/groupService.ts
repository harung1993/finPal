import api from './api';

export interface GroupMember {
  id: string;
  email: string;
  name: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  created_by: string;
  default_split_method: 'equal' | 'percentage' | 'custom' | 'shares';
  default_payer?: string;
  auto_include_all: boolean;
  members: GroupMember[];
  created_at?: string;
  updated_at?: string;
}

export interface GroupFormData {
  name: string;
  description?: string;
  default_split_method: 'equal' | 'percentage' | 'custom' | 'shares';
  auto_include_all: boolean;
  member_ids?: string[];
}

export interface GroupBalance {
  group_id: number;
  group_name: string;
  balances: {
    user_id: string;
    user_name: string;
    balance: number;
  }[];
}

export const groupService = {
  // Get all groups for the current user
  getAll: async (): Promise<Group[]> => {
    const response = await api.get('/api/v1/groups');
    return response.data.groups;
  },

  // Get single group by ID
  getById: async (id: number): Promise<Group> => {
    const response = await api.get(`/api/v1/groups/${id}`);
    return response.data.group;
  },

  // Create a new group
  create: async (data: GroupFormData): Promise<{ message: string; group_id: number }> => {
    const response = await api.post('/api/v1/groups', data);
    return response.data;
  },

  // Update an existing group
  update: async (id: number, data: Partial<GroupFormData>): Promise<{ message: string }> => {
    const response = await api.put(`/api/v1/groups/${id}`, data);
    return response.data;
  },

  // Delete a group
  delete: async (id: number): Promise<{ message: string }> => {
    const response = await api.delete(`/api/v1/groups/${id}`);
    return response.data;
  },

  // Get group balances
  getBalances: async (id: number): Promise<GroupBalance> => {
    const response = await api.get(`/api/v1/groups/${id}/balances`);
    return response.data;
  },

  // Add member to group
  addMember: async (id: number, email: string): Promise<{ message: string }> => {
    const response = await api.post(`/api/v1/groups/${id}/members`, { email });
    return response.data;
  },

  // Remove member from group
  removeMember: async (id: number, userId: string): Promise<{ message: string }> => {
    const response = await api.delete(`/api/v1/groups/${id}/members/${userId}`);
    return response.data;
  },

  // Invite member via email
  inviteMember: async (id: number, email: string): Promise<{ message: string }> => {
    const response = await api.post(`/api/v1/groups/${id}/invite`, { email });
    return response.data;
  },
};
