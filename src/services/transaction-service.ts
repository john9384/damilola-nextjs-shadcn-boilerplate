"use client";

import { apiClient } from "@/lib/api-client";

export type Transaction = {
  id: string;
  walletId: string | null;
  userId: string | null;
  type: string;
  channel: string;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  reference: string | null;
  paymentCategory?: string | null;
  remarks?: string | null;
  meta?: Record<string, unknown> | null;
  createdAt: string;
};

export type PaginatedTransactions = {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
};

export type TransactionFilters = {
  userId?: string;
  walletId?: string;
  type?: string;
  channel?: string;
  agentId?: string;
  fromDate?: string;
  toDate?: string;
  reference?: string;
  page?: number;
  limit?: number;
};

type ApiResponse<T> = {
  success: boolean;
  content: T;
  message: string;
  statusCode: number;
};

class TransactionService {
  async listTransactions(params: TransactionFilters) {
    const response = await apiClient.get<ApiResponse<PaginatedTransactions>>("/transactions", {
      params,
    });
    return response.content;
  }

  async listCurrentUserTransactions(params: TransactionFilters) {
    const response = await apiClient.get<ApiResponse<PaginatedTransactions>>(
      "/transactions/current-user",
      {
        params,
      },
    );
    return response.content;
  }

  async getTransactionById(id: string) {
    const response = await apiClient.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.content;
  }
}

export const transactionService = new TransactionService();
