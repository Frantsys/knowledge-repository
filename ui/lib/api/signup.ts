const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createUser(data: unknown) {
  const response = await fetch(`${API_URL}/v1/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Erro ao criar usuário");
  }

  return response.json();
}