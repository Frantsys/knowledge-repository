// Esqueleto com as mesmas medidas da página do material (container, capa, faixa de informações, colunas).
// Antes era só a frase "Carregando material...": a página nascia pequena e "esticava" quando os dados chegavam.
function Bar({ className }: { className: string }) {
  return <div className={`rounded bg-gray-200/70 ${className}`} />;
}

export default function MaterialSkeleton() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-surface">
      <div role="status" aria-label="Carregando material" className="mx-auto w-full max-w-[1200px] animate-pulse px-5 py-7 sm:px-8 lg:px-10">
        {/* Voltar */}
        <Bar className="mb-6 h-5 w-20" />

        {/* Cabeçalho: capa + informações */}
        <section className="overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-[0_3px_20px_rgba(70,50,140,0.05)]">
          <div className="flex h-[220px] flex-col justify-end gap-3 bg-gray-200/60 p-5 sm:h-[280px] sm:p-8">
            <Bar className="h-6 w-24 bg-white/70" />
            <Bar className="h-9 w-2/3 max-w-xl bg-white/70" />
          </div>

          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Bar className="h-5 w-32" />
              <Bar className="h-5 w-20" />
              <Bar className="h-5 w-28" />
            </div>
            <Bar className="h-11 w-28 rounded-xl" />
          </div>
        </section>

        {/* Conteúdo + lateral */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          <div className="rounded-2xl border border-gray-100 bg-white px-6 py-7 sm:px-10 sm:py-9">
            <Bar className="h-6 w-48" />
            <Bar className="mt-4 h-4 w-64" />
            <div className="my-8 border-t border-gray-100" />
            <Bar className="h-6 w-32" />
            <div className="mt-4 space-y-3">
              <Bar className="h-4 w-full" />
              <Bar className="h-4 w-11/12" />
              <Bar className="h-4 w-4/5" />
              <Bar className="h-4 w-2/3" />
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-purple-100 bg-white p-5">
            <Bar className="h-5 w-28" />
            <div className="mt-5 space-y-4">
              {[0, 1, 2, 3].map((item) => (
                <div key={item}>
                  <Bar className="h-3 w-16" />
                  <Bar className="mt-2 h-4 w-28" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
