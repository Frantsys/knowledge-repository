import { apiFetch, type Page } from "./client";

// Espelha o MaterialResponse da API
export interface Material {
  id: number;
  userId: number;
  user: { id: number; firstName: string; lastName: string; email: string; role: string } | null;
  title: string;
  body: string;
  subject: string;
  course: string;
  likes: number;
  views: number;
  updatedAt: string | null;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export interface MaterialInput {
  title: string;
  body: string;
  subject: string;
  course: string;
}

export function listMaterials(size = 20): Promise<Page<Material>> {
  return apiFetch<Page<Material>>(`/v1/api/materials?size=${size}`);
}

export function listMyMaterials(size = 100): Promise<Page<Material>> {
  return apiFetch<Page<Material>>(`/v1/api/materials/me?size=${size}`);
}

export function getMaterial(id: number | string): Promise<Material> {
  return apiFetch<Material>(`/v1/api/materials/${id}`);
}

export function createMaterial(data: MaterialInput): Promise<Material> {
  return apiFetch<Material>("/v1/api/materials", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateMaterial(id: number | string, data: MaterialInput): Promise<Material> {
  return apiFetch<Material>(`/v1/api/materials/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function setMaterialActive(id: number | string, isActive: boolean): Promise<Material> {
  return apiFetch<Material>(`/v1/api/materials/${id}/activation`, {
    method: "PATCH",
    body: JSON.stringify({ isActive }),
  });
}
