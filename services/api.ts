import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from './endpoints';

/**
 * Flip this to `false` once the real backend is available.
 * All service files check this flag and short-circuit to mock data when true.
 */
export const USE_MOCK = true;

const TOKEN_KEY = 'besafe.access_token';
const REFRESH_KEY = 'besafe.refresh_token';

export const tokenStore = {
  async get(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  async set(access: string, refresh?: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, access);
    if (refresh) await SecureStore.setItemAsync(REFRESH_KEY, refresh);
  },
  async clear() {
    await SecureStore.deleteItemAsync(TOKEN_KEY).catch(() => {});
    await SecureStore.deleteItemAsync(REFRESH_KEY).catch(() => {});
  },
  async refresh(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_KEY);
    } catch {
      return null;
    }
  },
};

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
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
    // Basic 401 → clear tokens (a real impl would try refresh first)
    if (error.response?.status === 401) {
      await tokenStore.clear();
    }
    return Promise.reject(error);
  }
);

/** Utility for the mock layer: simulate latency. */
export const mockDelay = <T,>(value: T, ms = 600): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

/** Utility: fail sometimes for realism (opt-in per service). */
export const maybeFail = (chance = 0) => {
  if (chance > 0 && Math.random() < chance) {
    const err = new Error('Simulated network error');
    (err as any).status = 500;
    throw err;
  }
};
