import { apiFetch } from "./client";

export interface Address {
  country: string;
  state: string;
  city: string;
  street: string;
  number: string;
  district: string;
  zipcode: string;
}

// Espelha o UserResponse da API
export interface UserProfile {
  id: number;
  cpf: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  course: string;
  address: Address | null;
  birthDate: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

// Espelha o UserUpdateRequest da API
export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  course: string;
  address?: Address;
}

export function getMe(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/v1/api/users/me");
}

export function updateUser(id: number, data: UpdateProfileData): Promise<UserProfile> {
  return apiFetch<UserProfile>(`/v1/api/users/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return apiFetch<void>("/v1/api/users/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
