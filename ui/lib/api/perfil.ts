import { API_URL, apiFetch } from "./client";

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
  // Caminho relativo da foto (/v1/api/users/avatars/{chave}) ou null sem foto
  avatarUrl: string | null;
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

// URL absoluta da foto para <img>; o endpoint é público e a URL muda a cada nova foto
export function avatarSrc(user: Pick<UserProfile, "avatarUrl"> | null): string | null {
  return user?.avatarUrl ? `${API_URL}${user.avatarUrl}` : null;
}

export function uploadAvatar(file: File): Promise<UserProfile> {
  const form = new FormData();
  form.append("file", file);

  return apiFetch<UserProfile>("/v1/api/users/me/avatar", { method: "PUT", body: form });
}

export function removeAvatar(): Promise<UserProfile> {
  return apiFetch<UserProfile>("/v1/api/users/me/avatar", { method: "DELETE" });
}

export function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return apiFetch<void>("/v1/api/users/password", {
    method: "PATCH",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}
