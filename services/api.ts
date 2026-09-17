import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";
import { API_BASE_URL, endpoints } from "./endpoints";

const TOKEN_KEY = "besafe.access_token";
const REFRESH_KEY = "besafe.refresh_token";

export const tokenStore = {
  async get(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async getRefresh(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_KEY);
    } catch {
      return null;
    }
  },

  async set(access?: string, refresh?: string) {
    // Strictly validate before saving to prevent SecureStore crashes
    if (typeof access === "string" && access.trim().length > 0) {
      await SecureStore.setItemAsync(TOKEN_KEY, access);
    }
    if (typeof refresh === "string" && refresh.trim().length > 0) {
      await SecureStore.setItemAsync(REFRESH_KEY, refresh);
    }
  },

  async clear() {
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    await SecureStore.deleteItemAsync(REFRESH_KEY).catch(() => {});
  },
};

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await tokenStore.get();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = await tokenStore.getRefresh();

      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${API_BASE_URL}${endpoints.auth.refresh}`,
            { refreshToken },
          );
          await tokenStore.set(data.accessToken, data.refreshToken);
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          await tokenStore.clear();
          return Promise.reject(refreshError);
        }
      } else {
        await tokenStore.clear();
      }
    }

    if (error.response?.data) {
      const data: any = error.response.data;

      let extractedMsg =
        data?.error?.message ||
        data?.message?.message ||
        data?.message ||
        data?.error ||
        error.message;

      if (Array.isArray(extractedMsg)) {
        extractedMsg = extractedMsg[0];
      }

      error.message =
        typeof extractedMsg === "string" ? extractedMsg : "An error occurred";
    }

    return Promise.reject(error);
  },
);
