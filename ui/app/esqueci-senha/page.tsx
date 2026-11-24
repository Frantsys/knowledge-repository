"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2, MailCheck } from "lucide-react";
import { requestPasswordReset } from "@/lib/api/login";
import AuthShell from "@/components/auth-shell";
import FormField from "@/components/form-field";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ASIDE = (
  <div className="max-w-md">
    <p className="text-4xl font-semibold leading-[1.1] tracking-tight text-balance xl:text-5xl">Acontece com todo mundo.</p>
    <p className="mt-4 text-base leading-relaxed text-white/80">Em poucos passos você define uma senha nova e volta aos seus estudos.</p>
  </div>
);

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError(null);

    try {
      await requestPasswordReset(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar o link. Tente de novo.");
    } finally {
      setSending(false);
    }
  }

  return (
    <AuthShell aside={ASIDE}>
      {sent ? (
        <div role="status">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <MailCheck className="size-6" />
          </span>
          <h1 className="mt-5 text-[1.75rem] font-semibold leading-tight tracking-tight text-brand-ink">Confira seu e-mail</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Se existir uma conta com <span className="font-medium text-foreground">{email}</span>, enviamos um link para criar uma senha
            nova. Ele vale por 30 minutos.
          </p>
          <Button variant="outline" size="lg" className="mt-6 h-11 w-full" onClick={() => setSent(false)}>
            Usar outro e-mail
          </Button>
        </div>
      ) : (
        <>
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-brand-ink">Esqueci minha senha</h1>
          <p className="mt-2 text-sm text-muted-foreground">Informe o e-mail da sua conta e enviaremos um link para criar uma senha nova.</p>

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
                className="h-11"
              />
            </FormField>

            {error && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" size="lg" disabled={sending} className="h-11 w-full text-sm font-semibold">
              {sending && <Loader2 className="animate-spin" aria-hidden="true" />}
              {sending ? "Enviando..." : "Enviar link"}
            </Button>
          </form>
        </>
      )}

      <p className="mt-8 border-t border-border pt-6 text-center text-sm">
        <Link href="/login" className="inline-flex items-center gap-1.5 font-semibold text-primary underline-offset-4 hover:underline">
          <ArrowLeft className="size-4" />
          Voltar para o login
        </Link>
      </p>
    </AuthShell>
  );
}
