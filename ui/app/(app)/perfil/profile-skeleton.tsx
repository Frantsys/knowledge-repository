import { Skeleton, SkeletonGroup } from "@/components/skeleton";

// Mesmo desenho da tela de perfil (título, cartão de identidade e grade de informações).
// Antes a tela mostrava dados vazios ("Usuário", "Membro desde" com a data de hoje) até o /me responder.
export default function ProfileSkeleton() {
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      <SkeletonGroup label="Carregando perfil" className="page-container pt-8 pb-16 lg:pt-10">
        {/* Título */}
        <div className="mb-8">

          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-3 h-4 w-96 max-w-full" />
        </div>

        {/* Cartão de identidade */}
        <section className="overflow-hidden rounded-3xl border border-border bg-card">
          <Skeleton className="h-32 rounded-none sm:h-40" />
          <div className="flex items-center gap-4 px-5 pb-6 sm:gap-5 sm:px-8 sm:pb-8">
            <Skeleton className="-mt-12 h-24 w-24 rounded-3xl border-4 border-card sm:-mt-14 sm:h-32 sm:w-32" />
            <div className="flex-1 space-y-2.5 pt-4 sm:pt-5">
              <Skeleton className="h-7 w-56" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        </section>

        {/* Informações pessoais + lateral */}
        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
          <section className="rounded-3xl border border-border bg-card p-5 sm:p-7">
            <Skeleton className="h-6 w-52" />
            <Skeleton className="mt-3 h-4 w-64" />
            <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {[0, 1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-6">
            <Skeleton className="h-40 rounded-3xl" />
            <Skeleton className="h-52 rounded-3xl" />
          </section>
        </div>
      </SkeletonGroup>
    </div>
  );
}
