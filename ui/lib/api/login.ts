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

    console.log("URL:", `${API_URL}/v1/api/users/login`);
    console.log("STATUS:", response.status);
    console.log("CONTENT-TYPE:", response.headers.get("content-type"));

    const contentType = response.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
        const text = await response.text();

        console.error("RESPOSTA DO SERVIDOR:");
        console.error(text);

        throw new Error(
            `Servidor retornou ${response.status} em vez de JSON.`
        );
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Credenciais inválidas."
        );
    }

    return data;
}