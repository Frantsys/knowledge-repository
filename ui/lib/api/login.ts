const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginResponse {
    token: string;
}

export async function login(
    email: string,
    password: string
): Promise<LoginResponse> {

    const response = await fetch(
        `${API_URL}/v1/api/users/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Credenciais inválidas."
        );
    }

    return data;
}