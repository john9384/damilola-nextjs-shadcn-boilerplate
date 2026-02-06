import { apiClient } from "@/lib/api-client";

export type IUser = {
  id: string;
  email: string;
  role: string;
  type: string;
  status: string;
  emailVerified: boolean;
  name: string | null;
  phone: string | null;
  barcodeValue: string | null;
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
  "id" | "email" | "phone" | "role" | "name" | "type" | "status" | "createdAt"
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

export async function listAgents() {
  const response = await apiClient.get<ApiResponse<PaginatedUsers>>("/users/agent");
  return response.content;
}

export async function getAgent(id: string) {
  const response = await apiClient.get<ApiResponse<AdminUser>>(`/users/${id}`);
  return response.content;
}

export async function createAgent(payload: {
  email: string;
  name?: string;
  phone?: string;
  adminRole?: "STAFF" | "ADMIN";
}) {
  const response = await apiClient.post<ApiResponse<AdminUser>>("/users", {
    ...payload,
    type: "AGENT",
    adminRole: payload.adminRole ?? "STAFF",
  });
  return response.content;
}

export async function listUsers() {
  const response = await apiClient.get<ApiResponse<PaginatedUsers>>("/users/basic");
  return response.content;
}

export async function getUser(id: string) {
  const response = await apiClient.get<ApiResponse<AdminUser>>(`/users/${id}`);
  return response.content;
}

export async function createUser(payload: ICreateUser) {
  const response = await apiClient.post<ApiResponse<AdminUser>>("/users", {
    ...payload,
    adminRole: payload.adminRole ?? "STAFF",
  });
  return response.content;
}

export async function listAdmins() {
  const response = await apiClient.get<ApiResponse<PaginatedUsers>>("/users/admin");
  return response.content;
}

export async function getAdmin(id: string) {
  const response = await apiClient.get<ApiResponse<AdminUser>>(`/users/${id}`);
  return response.content;
}

export async function createAdmin(payload: {
  email: string;
  name?: string;
  phone?: string;
  adminRole?: "STAFF" | "ADMIN";
}) {
  const response = await apiClient.post<ApiResponse<AdminUser>>("/users", {
    ...payload,
    type: "ADMIN",
    adminRole: payload.adminRole ?? "ADMIN",
  });
  return response.content;
}

export async function updateAdminStatus(id: string, status: "SUSPENDED" | "ACTIVE") {
  const response = await apiClient.patch<ApiResponse<AdminUser>>(`/users/${id}`, { status });
  return response.content;
}

export async function listTransactions(params: {
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
  const response = await apiClient.get<ApiResponse<PaginatedTransactions>>("/admin/transactions", {
    params,
  });
  return response.content;
}
