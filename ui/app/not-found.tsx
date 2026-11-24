import Link from "next/link";
import { BookOpen, Compass, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

export const metadata = { title: "Página não encontrada" };

// 404 do app: em português, com o visual do site e caminhos de volta
export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <Link href="/home" className="mb-10 flex items-center gap-2 text-base font-semibold">
        <BookOpen className="size-6 text-primary" strokeWidth={2.5} />
        Banca de Materiais
      </Link>

      <p className="text-6xl font-bold tracking-tight text-primary/30 tabular-nums">404</p>
      <h1 className="mt-3 text-2xl font-bold tracking-tight text-brand-ink">Página não encontrada</h1>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        O endereço pode estar errado ou a página foi removida. Confira o link ou siga por um dos caminhos abaixo.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="h-11 px-5">
          <Link href="/home">
            <Home />
            Ir para o início
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-11 px-5">
          <Link href="/explorar">
            <Compass />
            Explorar materiais
          </Link>
        </Button>
      </div>
    </main>
  );
}
