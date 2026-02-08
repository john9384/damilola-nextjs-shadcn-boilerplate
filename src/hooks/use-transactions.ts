import { useQuery } from "@tanstack/react-query";
import {
  transactionService,
  type PaginatedTransactions,
  type Transaction,
  type TransactionFilters,
} from "@/services/transaction-service";

export type TransactionScope = "admin" | "current-user";

export function generateTransactionQueryKey(scope: TransactionScope, filters: TransactionFilters) {
  return [scope, "transactions", filters] as const;
}

export function useTransactions(filters: TransactionFilters, scope: TransactionScope = "admin") {
  const queryKey = generateTransactionQueryKey(scope, filters);

  return useQuery<PaginatedTransactions>({
    queryKey,
    queryFn: () =>
      scope === "current-user"
        ? transactionService.listCurrentUserTransactions(filters)
        : transactionService.listTransactions(filters),
  });
}

export function useTransaction(id?: string) {
  return useQuery<Transaction>({
    queryKey: ["transactions", "details", id],
    queryFn: () => transactionService.getTransactionById(id as string),
    enabled: Boolean(id),
  });
}
