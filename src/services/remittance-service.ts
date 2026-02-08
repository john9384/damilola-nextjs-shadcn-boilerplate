"use client";

import { apiClient } from "@/lib/api-client";

export type RemittanceRecord = {
  id: string;
  userId: string;
  paymentStatus: string;
  amountDue: string;
  amountPaid: string;
  remittanceDate: string;
  transactionId: string | null;
  createdAt: string;
};

export type PaginatedRemittances = {
  items: RemittanceRecord[];
  total: number;
  page: number;
  limit: number;
};

export type RemittanceFilters = {
  userId?: string;
  barCode?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

type ApiResponse<T> = {
  success: boolean;
  content: T;
  message: string;
  statusCode: number;
};

class RemittanceService {
  async listRemittances(params: RemittanceFilters) {
    const response = await apiClient.get<ApiResponse<PaginatedRemittances>>("/remittance", {
      params,
    });
    return response.content;
  }

  async getRemittanceById(id: string) {
    const response = await apiClient.get<ApiResponse<RemittanceRecord>>(`/remittance/${id}`);
    return response.content;
  }

  async getLatestRemittanceForUser(userId: string) {
    const response = await apiClient.get<ApiResponse<RemittanceRecord>>(
      `/remittance/current-user/${userId}`,
    );
    return response.content;
  }

  async getLatestRemittanceForCurrentUser() {
    const response = await apiClient.get<ApiResponse<RemittanceRecord>>(
      "/remittance/current-user",
    );
    return response.content;
  }
}

export const remittanceService = new RemittanceService();
