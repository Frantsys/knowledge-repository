import { apiFetch } from "./client";
import type { Address, UserProfile } from "./perfil";

// Espelha o UserRegisterRequest da API
export interface RegisterData {
  cpf: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  gender: string;
  course: string;
  birthDate: string;
  address: Address;
}

export function createUser(data: RegisterData): Promise<UserProfile> {
  return apiFetch<UserProfile>("/v1/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
