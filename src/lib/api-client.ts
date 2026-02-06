import axios, { AxiosInstance, type AxiosRequestHeaders } from "axios";
import { env } from "@/utils/env";
import { CookieStore } from "@/utils/cookieStore";
import { LocalStore } from "@/utils/localStore";

const AUTH_STORE_KEY = "metropay-admin-auth";
const UNAUTHORIZED_MESSAGE = "Invalid or expired token.";
const UNAUTHORIZED_ERROR = "Unauthorized";
const LOGIN_ROUTE = "/auth/login";

type UnauthorizedPayload = {
  statusCode: number;
  message: string;
  error: string;
};

const isUnauthorizedSessionError = (payload: unknown): payload is UnauthorizedPayload => {
  if (!payload || typeof payload !== "object") return false;
  const data = payload as UnauthorizedPayload;
  return (
    data.statusCode === 401 &&
    data.message === UNAUTHORIZED_MESSAGE &&
    data.error === UNAUTHORIZED_ERROR
  );
};

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
  private static isHandlingUnauthorized = false;

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

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        const payload = error?.response?.data;
        if (isUnauthorizedSessionError(payload)) {
          this.handleUnauthorized();
        }
        return Promise.reject(error);
      },
    );
  }

  private handleUnauthorized() {
    if (typeof window === "undefined") return;

    LocalStore.removeItem(AUTH_STORE_KEY);
    CookieStore.removeItem(AUTH_STORE_KEY);

    if (window.location.pathname === LOGIN_ROUTE) return;
    if (ApiClient.isHandlingUnauthorized) return;
    ApiClient.isHandlingUnauthorized = true;
    window.location.replace(LOGIN_ROUTE);
  }

  private cleanParams(params: RequestOptions["params"]) {
    if (!params) return params;
    return Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
    );
  }

  private async request<TResponse, TBody = unknown>(
    method: string,
    path: string,
    options: RequestWithBodyOptions<TBody> = {},
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
