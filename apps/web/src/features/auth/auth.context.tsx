import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiClient, tokenStore } from "../../lib/api-client";
import type { AuthUser, LoginResponse } from "./auth.types";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  // On mount: validate existing access token against /auth/me
  useEffect(() => {
    if (!tokenStore.getAccess()) {
      setState({ user: null, isLoading: false });
      return;
    }
    apiClient
      .get<AuthUser>("/auth/me")
      .then(({ data }) => setState({ user: data, isLoading: false }))
      .catch(() => {
        // Refresh interceptor already tried to renew; if we're here it failed.
        tokenStore.clear();
        setState({ user: null, isLoading: false });
      });
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthUser> => {
      const { data } = await apiClient.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      tokenStore.set(data.accessToken, data.refreshToken);
      setState({ user: data.user, isLoading: false });
      return data.user;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      tokenStore.clear();
      setState({ user: null, isLoading: false });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
