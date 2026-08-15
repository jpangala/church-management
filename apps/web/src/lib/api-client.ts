import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "/api";

export const apiClient = axios.create({
  baseURL: BASE,
  withCredentials: true,
});

const ACCESS_KEY = "church_access";
const REFRESH_KEY = "church_refresh";

export const tokenStore = {
  getAccess: () => localStorage.getItem(ACCESS_KEY),
  getRefresh: () => localStorage.getItem(REFRESH_KEY),
  set: (access: string, refresh: string) => {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear: () => {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// Inject access token on every request
apiClient.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401: attempt silent token refresh, then replay the original request.
// Uses a queue so concurrent requests don't all race to refresh at once.
let isRefreshing = false;
let waitQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function drainQueue(err: unknown, token?: string) {
  waitQueue.forEach((p) => (err ? p.reject(err) : p.resolve(token!)));
  waitQueue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStore.getRefresh();
    if (!refreshToken) {
      tokenStore.clear();
      window.location.href = "/login";
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        waitQueue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers = {
          ...original.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return apiClient(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axios.post(`${BASE}/auth/refresh`, {
        refreshToken,
      });
      tokenStore.set(data.accessToken, data.refreshToken);
      drainQueue(null, data.accessToken);
      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${data.accessToken}`,
      };
      return apiClient(original);
    } catch (err) {
      drainQueue(err);
      tokenStore.clear();
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  },
);
