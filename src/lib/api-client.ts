import axios, { AxiosInstance, type AxiosRequestHeaders } from "axios";
import { env } from "@/utils/env";
import { LocalStore } from "@/utils/localStore";

const AUTH_STORE_KEY = "xanadu-auth";

type RequestOptions = {
  headers?: AxiosRequestHeaders;
  params?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
};

type RequestWithBodyOptions<TBody> = RequestOptions & {
  body?: TBody;
};

class ApiClient {
  private client: AxiosInstance;

  constructor(baseUrl: string = env.apiBaseUrl) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = LocalStore.getItem<{ token?: string }>(AUTH_STORE_KEY)?.token;
      if (token) {
        const existingHeaders = (config.headers || {}) as AxiosRequestHeaders;
        config.headers = {
          ...existingHeaders,
          Authorization: `Bearer ${token}`,
        } as AxiosRequestHeaders;
      }
      if (config.params) {
        config.params = this.cleanParams(config.params);
      }
      return config;
    });
  }

  private cleanParams(params: RequestOptions["params"]) {
    if (!params) return params;
    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
    );
  }

  private async request<TResponse>(
    method: string,
    path: string,
    options: RequestWithBodyOptions<any> = {},
  ): Promise<TResponse> {
    const { headers, body, params, signal } = options;
    const response = await this.client.request<TResponse>({
      method,
      url: path,
      data: body,
      params: this.cleanParams(params),
      headers,
      signal,
    });
    return response.data;
  }

  get<TResponse>(path: string, options?: RequestOptions) {
    return this.request<TResponse>("GET", path, options);
  }

  post<TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions) {
    return this.request<TResponse>("POST", path, { ...(options || {}), body });
  }

  patch<TResponse, TBody = unknown>(path: string, body?: TBody, options?: RequestOptions) {
    return this.request<TResponse>("PATCH", path, { ...(options || {}), body });
  }

  delete<TResponse>(path: string, options?: RequestOptions) {
    return this.request<TResponse>("DELETE", path, options);
  }

  async upload<TResponse>(
    path: string,
    formData: FormData,
    options: Omit<RequestOptions, "headers"> & { headers?: AxiosRequestHeaders } = {},
  ) {
    const response = await this.client.post<TResponse>(path, formData, {
      params: this.cleanParams(options.params),
      signal: options.signal,
      headers: {
        ...(options.headers || {}),
      },
    });
    return response.data;
  }

  async download(path: string, options: RequestOptions = {}) {
    const response = await this.client.get<Blob>(path, {
      params: this.cleanParams(options.params),
      headers: options.headers,
      signal: options.signal,
      responseType: "blob",
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();

export { ApiClient };
