// Esqueleto com as mesmas medidas do formulário de edição (container, cabeçalho do card, campos e rodapé),
// para a tela não nascer pequena e "esticar" quando os dados do material chegam.
function Bar({ className }: { className: string }) {
  return <div className={`rounded bg-gray-200/70 ${className}`} />;
}

function Field({ height }: { height: string }) {
  return (
    <div>
      <Bar className="mb-1.5 h-4 w-20" />
      <div className={`w-full rounded-lg border border-gray-200 bg-gray-50 ${height}`} />
    </div>
  );
}

export default function EditSkeleton() {
  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-surface">
      <div role="status" aria-label="Carregando material" className="mx-auto max-w-4xl animate-pulse px-4 py-8 sm:px-6 lg:px-8">
        {/* Voltar para o material */}
        <Bar className="mb-5 h-5 w-44" />

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Cabeçalho do card */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
            <div>
              <Bar className="h-5 w-36" />
              <Bar className="mt-1.5 h-4 w-56" />
            </div>
            <Bar className="h-8 w-8 rounded-md" />
          </div>

          {/* Título, descrição, disciplina, arquivo */}
          <div className="space-y-5 p-5 sm:p-6">
            <Field height="h-10" />
            <Field height="h-[89px]" />
            <Field height="h-10" />
            <div>
              <Bar className="mb-1.5 h-4 w-16" />
              <div className="mb-3 h-[42px] w-full rounded-lg border border-gray-200 bg-gray-50" />
              <div className="h-[158px] w-full rounded-xl border-2 border-dashed border-gray-200" />
            </div>
          </div>

          {/* Rodapé */}
          <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <Bar className="h-10 w-full rounded-lg sm:w-24" />
            <Bar className="h-10 w-full rounded-lg sm:w-40" />
          </div>
        </div>
      </div>
    </main>
  );
}
