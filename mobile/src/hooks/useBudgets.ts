import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService, Budget, BudgetFormData } from '@services/budgetService';

export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: () => budgetService.getAll(),
  });
};

export const useBudget = (id: number) => {
  return useQuery({
    queryKey: ['budget', id],
    queryFn: () => budgetService.getById(id),
    enabled: !!id,
  });
};

export const useBudgetProgress = (id: number) => {
  return useQuery({
    queryKey: ['budget', id, 'progress'],
    queryFn: () => budgetService.getProgress(id),
    enabled: !!id,
  });
};

export const useCreateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BudgetFormData) => budgetService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BudgetFormData> }) =>
      budgetService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};

export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => budgetService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });
};
