import { api, tokenStore, type StoredUser } from "./client";

export type Role = "ADMIN" | "STAFF" | "STUDENT";

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  fullName: string;
  department?: string;
  role: Role;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: Role;
}

export async function login(req: LoginRequest): Promise<AuthResponse> {
  const res = await api<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(req),
    auth: false,
  });
  persistAuth(res);
  return res;
}

export async function register(req: RegisterRequest): Promise<AuthResponse> {
  const res = await api<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(req),
    auth: false,
  });
  persistAuth(res);
  return res;
}

export function logout() {
  tokenStore.clear();
}

function persistAuth(res: AuthResponse) {
  tokenStore.set(res.token);
  const user: StoredUser = {
    userId: res.userId,
    username: res.username,
    email: res.email,
    fullName: res.fullName,
    role: res.role,
  };
  tokenStore.setUser(user);
}
