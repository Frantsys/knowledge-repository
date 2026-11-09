import { apiFetch, type Page } from "./client";

// Espelha o CommentResponse da API
export interface Comment {
  id: number;
  materialId: number;
  userId: number;
  parentId: number | null;
  body: string;
  likes: number;
  updatedAt: string | null;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export function listComments(materialId: number | string): Promise<Page<Comment>> {
  return apiFetch<Page<Comment>>(`/v1/api/comments?materialId=${materialId}&size=100`);
}

export function createComment(materialId: number, body: string): Promise<Comment> {
  return apiFetch<Comment>("/v1/api/comments", {
    method: "POST",
    body: JSON.stringify({ materialId, body }),
  });
}

export function replyComment(parentId: number, body: string): Promise<Comment> {
  return apiFetch<Comment>(`/v1/api/comments/${parentId}/replies`, {
    method: "POST",
    body: JSON.stringify({ body }),
  });
}

export function updateComment(id: number, body: string): Promise<Comment> {
  return apiFetch<Comment>(`/v1/api/comments/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ body }),
  });
}
