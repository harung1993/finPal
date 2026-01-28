import api from './api';

export interface Budget {
  id: number;
  name: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  category_id: number;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  spent?: number;
  remaining?: number;
  percentage?: number;
}

export interface BudgetFormData {
  name: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  category_id: number;
  start_date: string;
  end_date?: string;
  is_active?: boolean;
}

export interface BudgetProgress {
  budget_id: number;
  budget_name: string;
  budget_amount: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'on_track' | 'warning' | 'over_budget';
}

export const budgetService = {
  getAll: async (): Promise<Budget[]> => {
    const response = await api.get('/budgets');
    return response.data.budgets;
  },

  getById: async (id: number): Promise<Budget> => {
    const response = await api.get(`/budgets/${id}`);
    return response.data.budget;
  },

  create: async (data: BudgetFormData): Promise<Budget> => {
    const response = await api.post('/budgets', data);
    return response.data.budget;
  },

  update: async (id: number, data: Partial<BudgetFormData>): Promise<Budget> => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data.budget;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/budgets/${id}`);
  },

  getProgress: async (id: number): Promise<BudgetProgress> => {
    const response = await api.get(`/budgets/${id}/progress`);
    return response.data;
  },
};
