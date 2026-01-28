import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  investmentService,
  Portfolio,
  Investment,
  PortfolioFormData,
  InvestmentFormData,
  TransactionFormData,
} from '@services/investmentService';

// Portfolio hooks
export const usePortfolios = () => {
  return useQuery({
    queryKey: ['portfolios'],
    queryFn: () => investmentService.portfolios.getAll(),
  });
};

export const usePortfolio = (id: number) => {
  return useQuery({
    queryKey: ['portfolio', id],
    queryFn: () => investmentService.portfolios.getById(id),
    enabled: !!id,
  });
};

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PortfolioFormData) => investmentService.portfolios.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PortfolioFormData> }) =>
      investmentService.portfolios.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => investmentService.portfolios.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

// Holdings (investments) hooks
export const useHoldings = (portfolioId?: number) => {
  return useQuery({
    queryKey: portfolioId ? ['holdings', portfolioId] : ['holdings'],
    queryFn: () => investmentService.holdings.getAll(portfolioId),
  });
};

export const useHolding = (id: number) => {
  return useQuery({
    queryKey: ['holding', id],
    queryFn: () => investmentService.holdings.getById(id),
    enabled: !!id,
  });
};

export const useCreateHolding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InvestmentFormData) => investmentService.holdings.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useUpdateHolding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<InvestmentFormData> }) =>
      investmentService.holdings.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

export const useDeleteHolding = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => investmentService.holdings.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

// Transaction hooks
export const useInvestmentTransactions = (investmentId?: number) => {
  return useQuery({
    queryKey: investmentId ? ['investment-transactions', investmentId] : ['investment-transactions'],
    queryFn: () => investmentService.transactions.getAll(investmentId),
  });
};

export const useCreateInvestmentTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TransactionFormData) => investmentService.transactions.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investment-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
      queryClient.invalidateQueries({ queryKey: ['portfolios'] });
    },
  });
};

// Stock quote hooks
export const useStockQuote = (symbol?: string, exchange: string = 'US') => {
  return useQuery({
    queryKey: ['stock-quote', symbol, exchange],
    queryFn: () => investmentService.getQuote(symbol!, exchange),
    enabled: !!symbol,
  });
};

export const useStockHistory = (symbol?: string, exchange: string = 'US', period: string = '1mo') => {
  return useQuery({
    queryKey: ['stock-history', symbol, exchange, period],
    queryFn: () => investmentService.getHistory(symbol!, exchange, period),
    enabled: !!symbol,
  });
};

export const useExchanges = () => {
  return useQuery({
    queryKey: ['exchanges'],
    queryFn: () => investmentService.getExchanges(),
  });
};
