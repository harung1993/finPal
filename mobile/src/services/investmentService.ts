import api from './api';

export interface Portfolio {
  id: number;
  name: string;
  description?: string;
  user_id: string;
  account_id?: number;
  created_at: string;
  updated_at: string;
  total_value?: number;
  total_cost?: number;
  gain_loss?: number;
  gain_loss_percentage?: number;
  investments?: Investment[];
}

export interface Investment {
  id: number;
  portfolio_id: number;
  symbol: string;
  name?: string;
  shares: number;
  purchase_price: number;
  current_price?: number;
  purchase_date: string;
  last_update?: string;
  notes?: string;
  sector?: string;
  industry?: string;
  cost_basis?: number;
  current_value?: number;
  gain_loss?: number;
  gain_loss_percentage?: number;
  transactions?: InvestmentTransaction[];
}

export interface InvestmentTransaction {
  id: number;
  investment_id: number;
  transaction_type: 'buy' | 'sell' | 'dividend' | 'split';
  shares: number;
  price: number;
  date: string;
  fees?: number;
  notes?: string;
  transaction_value?: number;
}

export interface StockQuote {
  symbol: string;
  formatted_symbol: string;
  exchange: string;
  exchange_name: string;
  currency_code: string;
  name: string;
  price: number;
  change: number;
  percent_change: number;
  market_cap: number;
  sector: string;
  industry: string;
  description: string;
  website: string;
  country: string;
}

export interface StockHistory {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface PortfolioFormData {
  name: string;
  description?: string;
  account_id?: number;
}

export interface InvestmentFormData {
  portfolio_id: number;
  symbol: string;
  shares: number;
  purchase_price: number;
  purchase_date?: string;
  notes?: string;
}

export interface TransactionFormData {
  investment_id: number;
  transaction_type: 'buy' | 'sell' | 'dividend' | 'split';
  shares: number;
  price: number;
  date?: string;
  fees?: number;
  notes?: string;
}

export const investmentService = {
  // Portfolio endpoints
  portfolios: {
    getAll: async (): Promise<Portfolio[]> => {
      const response = await api.get('/investments/portfolios');
      return response.data.portfolios;
    },

    getById: async (id: number): Promise<Portfolio> => {
      const response = await api.get(`/investments/portfolios/${id}`);
      return response.data.portfolio;
    },

    create: async (data: PortfolioFormData): Promise<Portfolio> => {
      const response = await api.post('/investments/portfolios', data);
      return response.data.portfolio;
    },

    update: async (id: number, data: Partial<PortfolioFormData>): Promise<Portfolio> => {
      const response = await api.put(`/investments/portfolios/${id}`, data);
      return response.data.portfolio;
    },

    delete: async (id: number): Promise<void> => {
      await api.delete(`/investments/portfolios/${id}`);
    },
  },

  // Holdings (investments) endpoints
  holdings: {
    getAll: async (portfolioId?: number): Promise<Investment[]> => {
      const params = portfolioId ? { portfolio_id: portfolioId } : {};
      const response = await api.get('/investments/holdings', { params });
      return response.data.holdings;
    },

    getById: async (id: number): Promise<Investment> => {
      const response = await api.get(`/investments/holdings/${id}`);
      return response.data.holding;
    },

    create: async (data: InvestmentFormData): Promise<Investment> => {
      const response = await api.post('/investments/holdings', data);
      return response.data.holding;
    },

    update: async (id: number, data: Partial<InvestmentFormData>): Promise<Investment> => {
      const response = await api.put(`/investments/holdings/${id}`, data);
      return response.data.holding;
    },

    delete: async (id: number): Promise<void> => {
      await api.delete(`/investments/holdings/${id}`);
    },
  },

  // Transaction endpoints
  transactions: {
    getAll: async (investmentId?: number): Promise<InvestmentTransaction[]> => {
      const params = investmentId ? { investment_id: investmentId } : {};
      const response = await api.get('/investments/transactions', { params });
      return response.data.transactions;
    },

    create: async (data: TransactionFormData): Promise<InvestmentTransaction> => {
      const response = await api.post('/investments/transactions', data);
      return response.data.transaction;
    },
  },

  // Stock quote and history
  getQuote: async (symbol: string, exchange: string = 'US'): Promise<StockQuote> => {
    const response = await api.get(`/investments/quote/${symbol}`, {
      params: { exchange },
    });
    return response.data.quote;
  },

  getHistory: async (
    symbol: string,
    exchange: string = 'US',
    period: string = '1mo'
  ): Promise<StockHistory[]> => {
    const response = await api.get(`/investments/history/${symbol}`, {
      params: { exchange, period },
    });
    return response.data.history;
  },

  getExchanges: async (): Promise<{ [key: string]: string }> => {
    const response = await api.get('/investments/exchanges');
    return response.data.exchanges;
  },
};
