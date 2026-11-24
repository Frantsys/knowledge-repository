"use client";

import { FormEvent, Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { resetPassword } from "@/lib/api/login";
import AuthShell from "@/components/auth-shell";
import FormField from "@/components/form-field";
import PasswordInput from "@/components/password-input";
import { toast } from "@/components/toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

const ASIDE = (
  <div className="max-w-md">
    <p className="text-4xl font-semibold leading-[1.1] tracking-tight text-balance xl:text-5xl">Quase lá.</p>
    <p className="mt-4 text-base leading-relaxed text-white/80">Escolha uma senha nova para voltar a acessar sua conta.</p>
  </div>
);

function ResetForm() {
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));

    if (password !== form.get("confirmPassword")) {
      setError("As senhas não são iguais. Digite a mesma senha nos dois campos.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await resetPassword(token, password);
      toast("Senha alterada. Entre com a senha nova.");
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível alterar a senha.");
      setSaving(false);
    }
  }

  if (!token) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertCircle />
        <AlertDescription>
          Este link está incompleto.{" "}
          <Link href="/esqueci-senha" className="font-semibold underline">
            Peça um novo link
          </Link>
          .
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <FormField id="password" label="Senha nova" required hint="Mínimo de 8 caracteres.">
        <PasswordInput
          id="password"
          name="password"
          required
          minLength={8}
          autoComplete="new-password"
          autoFocus
          aria-describedby="password-hint"
        />
      </FormField>

      <FormField id="confirmPassword" label="Confirmar senha nova" required>
        <PasswordInput id="confirmPassword" name="confirmPassword" label="confirmação da senha" required minLength={8} autoComplete="new-password" />
      </FormField>

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription className="whitespace-pre-line">
            {error}
            {error.includes("expirou") && (
              <Link href="/esqueci-senha" className="mt-1 block font-semibold underline">
                Pedir novo link
              </Link>
            )}
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" disabled={saving} className="h-11 w-full text-sm font-semibold">
        {saving && <Loader2 className="animate-spin" aria-hidden="true" />}
        {saving ? "Salvando..." : "Salvar senha nova"}
      </Button>
    </form>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <AuthShell aside={ASIDE}>
      <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-brand-ink">Criar senha nova</h1>
      <p className="mt-2 text-sm text-muted-foreground">Depois de salvar, entre com a senha nova.</p>
      {/* useSearchParams precisa de Suspense para a página poder ser pré-renderizada */}
      <Suspense>
        <ResetForm />
      </Suspense>
      <p className="mt-8 border-t border-border pt-6 text-center text-sm">
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Voltar para o login
        </Link>
      </p>
    </AuthShell>
  );
}
