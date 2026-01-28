import api from './api';

export interface Account {
  id: number;
  name: string;
  account_type: string;
  balance: number;
  currency_code: string;
  institution?: string;
  account_number?: string;
  is_active: boolean;
  last_sync?: string;
}

export interface AccountFormData {
  name: string;
  account_type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan' | 'other';
  balance: number;
  currency_code: string;
  institution?: string;
  account_number?: string;
  is_active?: boolean;
}

export const accountService = {
  getAll: async (): Promise<Account[]> => {
    const response = await api.get('/accounts');
    return response.data.accounts;
  },

  getById: async (id: number): Promise<Account> => {
    const response = await api.get(`/accounts/${id}`);
    return response.data.account;
  },

  create: async (data: AccountFormData): Promise<Account> => {
    const response = await api.post('/accounts', data);
    return response.data.account;
  },

  update: async (id: number, data: Partial<AccountFormData>): Promise<Account> => {
    const response = await api.put(`/accounts/${id}`, data);
    return response.data.account;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/accounts/${id}`);
  },

  getBalance: async (id: number): Promise<{ balance: number; currency_code: string }> => {
    const response = await api.get(`/accounts/${id}/balance`);
    return {
      balance: response.data.balance,
      currency_code: response.data.currency_code,
    };
  },
};
