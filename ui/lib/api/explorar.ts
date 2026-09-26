export interface Material {
  id: number;
  title: string;
  body: string;
  subject: string;
  course: string;
  likes: number;
  views: number;
  createdBy: string;
  createdAt: string;
}

/*
 * FUTURA CHAMADA DA API
 *
 *
 * export async function getMaterials(): Promise<Material[]> {
 *   const response = await fetch(`${API_URL}/v1/api/materials`, {
 *     method: "GET",
 *     headers: {
 *       "Content-Type": "application/json",
 *     },
 *   });
 *
 *   if (!response.ok) {
 *     throw new Error("Erro ao buscar materiais");
 *   }
 *
 *   return response.json();
 * }
 */