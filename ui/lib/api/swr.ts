"use client";

import useSWR, { mutate, type SWRConfiguration } from "swr";
import { apiFetch, type Page } from "./client";
import type { Material } from "./materials";
import type { MaterialFile } from "./files";
import type { Comment } from "./comments";
import type { UserProfile } from "./perfil";

// Cache das leituras da API: ao voltar a uma tela já vista, os dados aparecem na hora
// e são atualizados em segundo plano (sem esqueleto de novo). A chave é a própria URL.
export const swrConfig: SWRConfiguration = {
  fetcher: (url: string) => apiFetch(url),
  revalidateOnFocus: true,
  dedupingInterval: 5000,
  keepPreviousData: true,
  // 4xx não melhora tentando de novo (ex.: 404 de material removido)
  shouldRetryOnError: (error: Error & { status?: number }) => !(error.status && error.status < 500),
};

export const keys = {
  me: "/v1/api/users/me",
  materials: (size: number) => `/v1/api/materials?size=${size}`,
  myMaterials: (size: number) => `/v1/api/materials/me?size=${size}`,
  material: (id: number | string) => `/v1/api/materials/${id}`,
  files: (materialId: number | string) => `/v1/api/files?materialId=${materialId}&size=100`,
  comments: (materialId: number | string) => `/v1/api/comments?materialId=${materialId}&size=100`,
};

export const useMe = () => useSWR<UserProfile>(keys.me);
export const useMaterials = (size: number) => useSWR<Page<Material>>(keys.materials(size));
export const useMyMaterials = (size: number) => useSWR<Page<Material>>(keys.myMaterials(size));
export const useMaterial = (id: number | string) => useSWR<Material>(keys.material(id));
export const useFiles = (materialId: number | string) => useSWR<Page<MaterialFile>>(keys.files(materialId));
export const useComments = (materialId: number | string) => useSWR<Page<Comment>>(keys.comments(materialId));

// Depois de publicar, editar, excluir ou restaurar: todas as listas e detalhes de materiais revalidam
export function invalidateMaterials() {
  return mutate((key) => typeof key === "string" && key.startsWith("/v1/api/materials"));
}

// Perfil ou foto alterados: navbar, perfil e quem mais usar o /me recebem o usuário novo sem nova busca
export function setMe(user: UserProfile) {
  return mutate(keys.me, user, { revalidate: false });
}
