const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function api<T = unknown>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };

  const authToken = token || (typeof window !== "undefined" ? localStorage.getItem("auth_token") || "" : "");
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    let message: string;
    if (data?.errors) {
      const firstKey = Object.keys(data.errors)[0];
      message = data.errors[firstKey]?.[0] || data?.message || "Une erreur est survenue";
    } else {
      message = data?.message || "Une erreur est survenue";
    }
    throw new Error(message);
  }

  return data as T;
}
