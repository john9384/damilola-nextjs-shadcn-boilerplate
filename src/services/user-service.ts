"use client";

import { apiClient } from "@/lib/api-client";

export type IUser = {
  id: string;
  email: string;
  adminRole?: "STAFF" | "ADMIN" | null;
  role: string;
  type: string;
  status: string;
  emailVerified: boolean;
  phoneVerified?: boolean;
  name: string | null;
  phone: string | null;
  barcodeValue: string | null;
  hasScheduledRemittance?: boolean;
  remittanceStartDate?: string | null;
  scheduledRemittanceAmount?: string | number | null;
  remittanceOutstanding?: string | number | null;
  nin?: string | null;
  createdAt: string;
};

export type ICreateUser = {
  email: string;
  name?: string;
  phone?: string;
  type: "ADMIN" | "AGENT" | "BASIC";
  adminRole?: "STAFF" | "ADMIN";
  hasScheduledRemittance?: boolean;
  remittanceStartDate?: string;
  scheduledRemittanceAmount?: number;
};

export type AdminUser = Pick<
  IUser,
  | "id"
  | "email"
  | "adminRole"
  | "phone"
  | "phoneVerified"
  | "role"
  | "name"
  | "type"
  | "status"
  | "emailVerified"
  | "hasScheduledRemittance"
  | "remittanceStartDate"
  | "scheduledRemittanceAmount"
  | "remittanceOutstanding"
  | "nin"
  | "createdAt"
  | "barcodeValue"
>;

export type AdminTransaction = {
  id: string;
  walletId: string | null;
  userId: string | null;
  type: string;
  channel: string;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  reference: string | null;
  meta: Record<string, unknown> | null;
  createdAt: string;
};

export type PaginatedTransactions = {
  items: AdminTransaction[];
  total: number;
  page: number;
  limit: number;
};

export type PaginatedUsers = {
  items: IUser[];
  total: number;
  page: number;
  limit: number;
};

type ApiResponse<T> = {
  success: boolean;
  content: T;
  message: string;
  statusCode: number;
};

class UserService {
  public async getUsers(userType: "ADMIN" | "AGENT" | "BASIC") {
    let response: ApiResponse<PaginatedUsers> | null = null;

    if (userType === "ADMIN") {
      response = await apiClient.get<ApiResponse<PaginatedUsers>>("/users/admin");
    }
    if (userType === "AGENT") {
      response = await apiClient.get<ApiResponse<PaginatedUsers>>("/users/agent");
    }

    if (userType === "BASIC") {
      response = await apiClient.get<ApiResponse<PaginatedUsers>>("/users/basic");
    }

    return (
      response?.content ?? {
        items: [],
        total: 0,
        page: 1,
        limit: 0,
      }
    );
  }

  public async getUser(id: string) {
    const response = await apiClient.get<ApiResponse<AdminUser>>(`/users/${id}`);
    return response.content;
  }

  public async createUser(payload: ICreateUser) {
    const response = await apiClient.post<ApiResponse<AdminUser>>("/users", {
      ...payload,
      adminRole: payload.adminRole ?? "STAFF",
    });
    return response.content;
  }

  public async updateAdminStatus(id: string, status: "SUSPENDED" | "ACTIVE") {
    const response = await apiClient.patch<ApiResponse<AdminUser>>(`/users/${id}`, { status });
    return response.content;
  }

  async listTransactions(params: {
    page?: number;
    limit?: number;
    agentId?: string;
    userId?: string;
    walletId?: string;
    type?: string;
    channel?: string;
    reference?: string;
    fromDate?: string;
    toDate?: string;
  }) {
    const response = await apiClient.get<ApiResponse<PaginatedTransactions>>(
      "/admin/transactions",
      {
        params,
      },
    );
    return response.content;
  }
}

export const userService = new UserService();
