// API client with JWT auth
const RAW_BASE = (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:8080/api";
export const API_BASE_URL: string = RAW_BASE.replace(/\/$/, "");

const TOKEN_KEY = "smartattend.token";
const USER_KEY = "smartattend.user";

export type StoredUser = {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: "ADMIN" | "STAFF" | "STUDENT";
};

export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },
  getUser(): StoredUser | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  },
  setUser(u: StoredUser) {
    if (typeof window !== "undefined") localStorage.setItem(USER_KEY, JSON.stringify(u));
  },
};

export class ApiError extends Error {
  status: number;
  body: unknown;
  constructor(status: number, message: string, body: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

export async function api<T = unknown>(
  path: string,
  opts: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const { auth = true, headers, body, ...rest } = opts;
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(body ? { "Content-Type": "application/json" } : {}),
    ...(headers as Record<string, string> | undefined),
  };
  if (auth) {
    const t = tokenStore.get();
    if (t) finalHeaders.Authorization = `Bearer ${t}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers: finalHeaders, body });
  } catch (e: any) {
    throw new ApiError(0, `Network error: ${e?.message ?? "cannot reach API"}`, null);
  }

  const text = await res.text();
  const data = text ? safeJson(text) : null;
  if (!res.ok) {
    const msg = (data as any)?.message || (data as any)?.error || res.statusText || "Request failed";
    if (res.status === 401) tokenStore.clear();
    throw new ApiError(res.status, msg, data);
  }
  return data as T;
}

function safeJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
