import api from './api';

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
  category_id?: number;
  account_id: number;
  notes?: string;
  category?: {
    id: number;
    name: string;
    icon: string;
  };
}

export interface TransactionFilters {
  page?: number;
  per_page?: number;
  start_date?: string;
  end_date?: string;
  category_id?: number;
  account_id?: number;
  type?: 'expense' | 'income';
  search?: string;
}

export interface TransactionsResponse {
  success: boolean;
  transactions: Transaction[];
  pagination: {
    page: number;
    per_page: number;
    total_pages: number;
    total_items: number;
  };
}

export const transactionService = {
  getAll: async (filters?: TransactionFilters): Promise<TransactionsResponse> => {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  getById: async (id: number): Promise<Transaction> => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.transaction;
  },

  create: async (data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.post('/transactions', data);
    return response.data.transaction;
  },

  update: async (id: number, data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data.transaction;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};
