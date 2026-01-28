/**
 * Hooks barrel export
 */

// Accounts
export { useAccounts, useAccount, useCreateAccount, useUpdateAccount, useDeleteAccount } from './useAccounts';

// Analytics
export { useDashboard, useBudgetProgress as useAnalyticsBudgetProgress, useSpendingByCategory, useMonthlyTrends } from './useAnalytics';

// Auth
export { useLogin, useRegister, useLogout, useCurrentUser } from './useAuth';

// Biometric
export { useBiometric } from './useBiometric';
export type { BiometricCredentials } from './useBiometric';

// Budgets
export { useBudgets, useBudget, useBudgetProgress, useCreateBudget, useUpdateBudget, useDeleteBudget } from './useBudgets';

// Categories
export { useCategories, useCategory, useCreateCategory, useUpdateCategory, useDeleteCategory } from './useCategories';

// Dark Mode
export { useDarkMode } from './useDarkMode';

// Investments
export {
  usePortfolios,
  usePortfolio,
  useCreatePortfolio,
  useUpdatePortfolio,
  useDeletePortfolio,
  useHoldings,
  useHolding,
  useCreateHolding,
  useUpdateHolding,
  useDeleteHolding,
  useInvestmentTransactions,
  useCreateInvestmentTransaction,
  useStockQuote,
  useStockHistory,
  useExchanges
} from './useInvestments';

// Transactions
export { useTransactions, useTransaction, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from './useTransactions';
