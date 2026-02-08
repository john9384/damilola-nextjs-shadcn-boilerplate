import { apiClient } from "@/lib/api-client";

type ApiResponse<T> = {
  success: boolean;
  content: T;
  message: string;
  statusCode: number;
};

export type SystemSettings = {
  id: number;
  appName: string;
  paystackPubKey: string;
  paystackPrivateKey: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateSystemSettingsPayload = {
  password: string;
  appName?: string;
  paystackPubKey?: string;
  paystackPrivateKey?: string;
};

class SettingsService {
  async getSystemSettings() {
    const response = await apiClient.get<ApiResponse<SystemSettings>>("/system");
    return response.content;
  }

  async updateSystemSettings(payload: UpdateSystemSettingsPayload) {
    const response = await apiClient.patch<ApiResponse<SystemSettings>>("/system", payload);
    return response.content;
  }
}

export const settingsService = new SettingsService();
