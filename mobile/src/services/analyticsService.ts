import api from './api';

export interface DashboardData {
  summary: {
    total_income: number;
    total_expenses: number;
    net_balance: number;
    transaction_count: number;
  };
  recent_transactions: Array<{
    id: number;
    description: string;
    amount: number;
    date: string;
    type: 'income' | 'expense';
    category?: {
      id: number;
      name: string;
      icon: string;
    };
  }>;
  spending_by_category: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthly_trends: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}

export interface BudgetProgress {
  budgets: Array<{
    id: number;
    name: string;
    category_name: string;
    amount: number;
    spent: number;
    percentage: number;
    period: string;
  }>;
}

export const analyticsService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await api.get('/analytics/dashboard');
    return response.data.data;
  },

  getBudgetProgress: async (): Promise<BudgetProgress> => {
    const response = await api.get('/budgets/progress');
    return response.data;
  },

  getSpendingByCategory: async (startDate?: string, endDate?: string) => {
    const response = await api.get('/analytics/spending-by-category', {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data.data;
  },

  getMonthlyTrends: async (months: number = 6) => {
    const response = await api.get('/analytics/monthly-trends', {
      params: { months },
    });
    return response.data.data;
  },
};
