// Cliente HTTP único da UI: base URL, token JWT e erros no formato ProblemDetail da API
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const TOKEN_KEY = "token";

export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

// O proxy.ts roda no servidor e não enxerga o localStorage: o cookie "banca_session" só avisa que há login,
// para mandar direto ao /login quem não tem sessão. O JWT continua indo pelo header Authorization.
export const SESSION_COOKIE = "banca_session";

// Segundos até o JWT expirar (claim exp); se não der para ler, vale até fechar o navegador
function tokenMaxAge(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const seconds = Math.floor(payload.exp - Date.now() / 1000);
    return seconds > 0 ? `; max-age=${seconds}` : "; max-age=0";
  } catch {
    return "";
  }
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax${tokenMaxAge(token)}`;
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0`;
}

// Transforma o ProblemDetail da API ({ detail, errors: { campo: msg } }) em uma mensagem legível
async function errorMessage(response: Response): Promise<string> {
  try {
    const body = await response.json();
    const fieldErrors = body.errors ? Object.values(body.errors).join("\n") : "";
    return fieldErrors || body.detail || body.message || `Erro ${response.status}`;
  } catch {
    return `Erro ${response.status}`;
  }
}

// Faz a requisição autenticada e devolve a Response crua (usado para download de arquivo)
export async function apiRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers);
  const token = getToken();

  if (token) headers.set("Authorization", `Bearer ${token}`);

  // FormData define o próprio Content-Type (multipart com boundary)
  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, { ...init, headers });

  // Token ausente/expirado: volta ao login (exceto na própria tela de login)
  if (response.status === 401 && token) {
    clearToken();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }

  if (!response.ok) {
    // status permite à tela distinguir "não encontrado" (404) de falha de rede/servidor
    throw Object.assign(new Error(await errorMessage(response)), { status: response.status });
  }

  return response;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await apiRequest(path, init);

  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}
