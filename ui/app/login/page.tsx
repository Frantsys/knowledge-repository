"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { login } from "@/lib/api/login";
import AuthShell from "@/components/auth-shell";
import FormField, { INPUT_CLASS } from "@/components/form-field";
import PasswordInput from "@/components/password-input";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await login(email, password);
            window.location.href = "/home";
        } catch (err) {
            // 401: a mensagem da API ("Credenciais inválidas") não diz o que fazer
            const status = (err as { status?: number }).status;
            setError(
                status === 401
                    ? "E-mail ou senha incorretos. Confira os dados e tente de novo."
                    : err instanceof Error ? err.message : "Não foi possível entrar."
            );
            setLoading(false);
        }
    }

    return (
        <AuthShell
            aside={
                <div className="max-w-md">
                    <p className="text-4xl font-semibold leading-[1.1] tracking-tight text-balance xl:text-5xl">
                        Compartilhe conhecimento.
                        <span className="block text-purple-200">Encontre o que precisa para estudar.</span>
                    </p>

                    <p className="mt-8 text-sm text-purple-100">Comunidade acadêmica colaborativa</p>
                </div>
            }
        >
            <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-brand-ink">
                Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm text-gray-600">Entre para acessar a comunidade</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <FormField id="email" label="E-mail">
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="seu@email.com"
                        required
                        autoComplete="email"
                        autoFocus
                        aria-invalid={Boolean(error)}
                        className={INPUT_CLASS}
                    />
                </FormField>

                <FormField id="password" label="Senha">
                    <PasswordInput
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        autoComplete="current-password"
                        aria-invalid={Boolean(error)}
                    />
                </FormField>

                {error && (
                    <p role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
                        <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
                        <span className="whitespace-pre-line">{error}</span>
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-purple-600 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(16_24_40/0.08)] transition hover:bg-purple-700 active:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading && <Loader2 size={17} className="animate-spin" aria-hidden="true" />}
                    {loading ? "Entrando..." : "Entrar"}
                </button>
            </form>

            <p className="mt-8 border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
                Ainda não tem uma conta?{" "}
                <Link href="/signup" className="font-semibold text-purple-700 underline-offset-4 hover:underline">
                    Cadastre-se
                </Link>
            </p>
        </AuthShell>
    );
}
