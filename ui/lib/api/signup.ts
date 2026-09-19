const API_URL = "http://localhost:8080";

export async function createUser(data: unknown) {
  const response = await fetch(`${API_URL}/v1/api/users`, {
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