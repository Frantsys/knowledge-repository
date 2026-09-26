export interface UserProfile {
  id: number;
  cpf: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  course: string;
  role: string;
  createdAt: string;
  isActive: boolean;
  city: string;
  state: string;
}



export interface UpdateProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  course: string;
  city: string;
  state: string;
}

/*
 * ============================================================
 * CONFIGURAÇÃO DA API
 * ============================================================
 
 * NEXT_PUBLIC_API_URL=http://localhost:8080
 *
 * Depois:
 *
 * const API_URL =
 *   process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
 *
 */

// const API_URL =
//   process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/*
 * ============================================================
 * BUSCAR PERFIL
 * ============================================================
 *
 *
 * GET /v1/api/users/me
 *
 *
 * const user = await getProfile(token);
 *
 *
 * setUser(user);
 *
 * ============================================================
 */

export async function getProfile(
  token: string
): Promise<UserProfile> {
  /*
   * FUTURA IMPLEMENTAÇÃO:
   *
   * const response = await fetch(
   *   `${API_URL}/v1/api/users/me`,
   *   {
   *     method: "GET",
   *     headers: {
   *       "Content-Type": "application/json",
   *       Authorization: `Bearer ${token}`,
   *     },
   *   }
   * );
   *
   * if (!response.ok) {
   *   throw new Error("Erro ao buscar perfil");
   * }
   *
   * return response.json();
   */

  throw new Error(
    "getProfile ainda não está conectado à API."
  );
}

/*
 * ============================================================
 * ATUALIZAR PERFIL
 * ============================================================
 *
 * PUT /v1/api/users/me
 *
 * const updatedUser = await updateProfile(
 *   token,
 *   formData
 * );
 *
 * setUser(updatedUser);
 *
 * ============================================================
 */

export async function updateProfile(
  token: string,
  data: UpdateProfileData
): Promise<UserProfile> {
  /*
   *
   * const response = await fetch(
   *   `${API_URL}/v1/api/users/me`,
   *   {
   *     method: "PUT",
   *     headers: {
   *       "Content-Type": "application/json",
   *       Authorization: `Bearer ${token}`,
   *     },
   *     body: JSON.stringify(data),
   *   }
   * );
   *
   * if (!response.ok) {
   *   throw new Error("Erro ao atualizar perfil");
   * }
   *
   * return response.json();
   */

  throw new Error(
    "updateProfile ainda não está conectado à API."
  );
}

/*
 * ============================================================
 * ATUALIZAR PARCIALMENTE O PERFIL
 * ============================================================
 *
 *
 *
 * PATCH /v1/api/users/me
 *
 * ============================================================
 */

export async function patchProfile(
  token: string,
  data: Partial<UpdateProfileData>
): Promise<UserProfile> {
  /*
   *
   * const response = await fetch(
   *   `${API_URL}/v1/api/users/me`,
   *   {
   *     method: "PATCH",
   *     headers: {
   *       "Content-Type": "application/json",
   *       Authorization: `Bearer ${token}`,
   *     },
   *     body: JSON.stringify(data),
   *   }
   * );
   *
   * if (!response.ok) {
   *   throw new Error("Erro ao atualizar perfil");
   * }
   *
   * return response.json();
   */

  throw new Error(
    "patchProfile ainda não está conectado à API."
  );
}