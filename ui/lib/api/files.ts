import { apiFetch, apiRequest, type Page } from "./client";

// Espelha o FileResponse da API
export interface MaterialFile {
  id: number;
  materialId: number;
  downloadUrl: string;
  size: string | null;
  type: string;
  readOnly: boolean;
  name: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export function listFiles(materialId: number | string): Promise<Page<MaterialFile>> {
  return apiFetch<Page<MaterialFile>>(`/v1/api/files?materialId=${materialId}&size=100`);
}

export function uploadFile(materialId: number | string, file: File): Promise<MaterialFile> {
  const form = new FormData();
  form.append("materialId", String(materialId));
  form.append("readOnly", "false");
  form.append("name", file.name);
  form.append("file", file);

  return apiFetch<MaterialFile>("/v1/api/files", { method: "POST", body: form });
}

// Download precisa do header Authorization, então não dá para usar um <a href> direto
export async function downloadFile(file: MaterialFile) {
  const response = await apiRequest(file.downloadUrl);
  const url = URL.createObjectURL(await response.blob());

  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.click();

  URL.revokeObjectURL(url);
}
