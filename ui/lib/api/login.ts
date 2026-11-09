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
