// src/lib/api/auth.service.ts
import { LoginFormData } from "@/lib/schemas/auth.schema";

export async function loginApi(data: LoginFormData) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // keep credentials if your API sets cookies:
    credentials: "include",
    body: JSON.stringify(data),
  });

  const payload = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = payload?.message ?? "Login failed";
    const error = new Error(message) as Error & {
      status: number;
      payload: unknown;
    };
    error.status = res.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
