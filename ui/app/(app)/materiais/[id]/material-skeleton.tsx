import { Skeleton as Bar } from "@/components/skeleton";

// Esqueleto com as mesmas medidas da página do material (coluna única, capa, autoria, arquivos e conteúdo),
// para a página não "esticar" quando os dados chegam

export default function MaterialSkeleton() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-background">
      <div
        role="status"
        aria-label="Carregando material"
        aria-busy="true"
        className="skeleton-delayed mx-auto max-w-4xl px-5 pt-8 pb-16 sm:px-8 lg:pt-10"
      >
        {/* Voltar */}
        <Bar className="mb-6 h-5 w-20" />

        {/* Cabeçalho: capa, autoria e arquivos */}
        <section className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex h-[200px] flex-col justify-end gap-3 bg-muted p-5 sm:h-[240px] sm:p-8">
            <Bar className="h-6 w-24" />
            <Bar className="h-9 w-2/3 max-w-xl" />
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 px-5 py-5 sm:px-8">
            <Bar className="h-5 w-32" />
            <Bar className="h-5 w-24" />
            <Bar className="h-5 w-28" />
          </div>

          <div className="border-t px-5 py-4 sm:px-8">
            <Bar className="mb-2 h-5 w-24" />
            <Bar className="h-[54px] w-full rounded-lg" />
          </div>
        </section>

        {/* Conteúdo */}
        <div className="mt-6 rounded-2xl border border-border bg-card px-6 py-7 sm:px-10 sm:py-9">
          <Bar className="h-6 w-32" />
          <div className="mt-4 space-y-3">
            <Bar className="h-4 w-full" />
            <Bar className="h-4 w-11/12" />
            <Bar className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </main>
  );
}
