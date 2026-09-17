export type UserRole = "ADMIN" | "FINANCE" | "DIVISION_LEADER";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}
