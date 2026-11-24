"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { login } from "@/lib/api/login";
import AuthShell from "@/components/auth-shell";
import FormField from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
                        <span className="block text-white/80">Encontre o que precisa para estudar.</span>
                    </p>

                    <p className="mt-8 text-sm text-white/80">Comunidade acadêmica colaborativa</p>
                </div>
            }
        >
            <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-brand-ink">
                Bem-vindo de volta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">Entre para acessar a comunidade</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <FormField id="email" label="E-mail">
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="seu@email.com"
                        required
                        autoComplete="email"
                        autoFocus
                        aria-invalid={Boolean(error)}
                        className="h-11"
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
                    <Alert variant="destructive">
                        <AlertCircle />
                        <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="h-11 w-full text-sm font-semibold"
                >
                    {loading && <Loader2 className="animate-spin" aria-hidden="true" />}
                    {loading ? "Entrando..." : "Entrar"}
                </Button>
            </form>

            <p className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
                Ainda não tem uma conta?{" "}
                <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
                    Cadastre-se
                </Link>
            </p>
        </AuthShell>
    );
}
