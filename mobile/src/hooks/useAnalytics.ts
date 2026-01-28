import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@services/analyticsService';

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsService.getDashboard(),
  });
};

export const useBudgetProgress = () => {
  return useQuery({
    queryKey: ['budgetProgress'],
    queryFn: () => analyticsService.getBudgetProgress(),
  });
};

export const useSpendingByCategory = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['spendingByCategory', startDate, endDate],
    queryFn: () => analyticsService.getSpendingByCategory(startDate, endDate),
  });
};

export const useMonthlyTrends = (months: number = 6) => {
  return useQuery({
    queryKey: ['monthlyTrends', months],
    queryFn: () => analyticsService.getMonthlyTrends(months),
  });
};
