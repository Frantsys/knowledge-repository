import { apiFetch, setToken } from "./client";

export interface LoginResponse {
  tokenType: string;
  token: string;
}

// Autentica e guarda o JWT para as próximas requisições
export async function login(email: string, password: string): Promise<LoginResponse> {
  const data = await apiFetch<LoginResponse>("/v1/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setToken(data.token);

  return data;
}

// Pede o link de redefinição (a API responde igual exista ou não o e-mail)
export function requestPasswordReset(email: string): Promise<void> {
  return apiFetch<void>("/v1/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

export function resetPassword(token: string, newPassword: string): Promise<void> {
  return apiFetch<void>("/v1/api/auth/reset-password", { method: "POST", body: JSON.stringify({ token, newPassword }) });
}
