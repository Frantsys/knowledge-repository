"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Plus, Search } from "lucide-react";

import LinkProgress from "@/components/link-progress";
import MaterialCard, { MaterialCardSkeleton } from "@/components/material-card";
import { SkeletonGroup } from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Material } from "@/lib/api/materials";
import { useMaterials, useMe, useMyMaterials } from "@/lib/api/swr";
import { requestPublishModal } from "@/lib/hooks";
import { cn } from "@/lib/utils";

// Mesma regra de busca do Explorar: título, descrição, disciplina, curso ou autor
function matches(material: Material, term: string) {
  return [material.title, material.body, material.subject, material.course, material.createdBy].some((value) =>
    value.toLocaleLowerCase("pt-BR").includes(term)
  );
}

function SectionHeader({ title, subtitle, href, linkLabel }: { title: string; subtitle: string; href: string; linkLabel: string }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-bold text-brand-ink sm:text-xl">{title}</h2>
        <p className="mt-1 text-xs text-muted-foreground sm:text-sm">{subtitle}</p>
      </div>
      <Link
        href={href}
        transitionTypes={["nav-forward"]}
        className="flex min-h-11 shrink-0 items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
      >
        {linkLabel}
        <ArrowRight className="size-4" />
        <LinkProgress />
      </Link>
    </div>
  );
}

// Falha ao carregar uma seção: não mostrar o estado vazio ("você ainda não publicou"), que seria falso
function LoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-10 text-center">
      <p className="text-sm font-semibold">Não foi possível carregar esta seção</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      <Button variant="outline" className="mt-4" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Dados em cache (SWR): voltar ao Início mostra o que já foi carregado e atualiza em segundo plano.
  // A lista de 100 é a mesma do Explorar: as sugestões da busca já deixam o Explorar pronto
  const { data: me } = useMe();
  const { data: myPage, isLoading: loadingMine, error: mineError, mutate: retryMine } = useMyMaterials(3);
  const { data: allPage, isLoading: loadingAll, error: allError, mutate: retryAll } = useMaterials(100);

  const all = useMemo(() => (allPage?.content ?? []).filter((material) => material.isActive), [allPage]);
  const mine = myPage?.content ?? [];
  const recent = all.slice(0, 4);

  // Disciplinas com materiais publicados, da mais usada para a menos usada
  const subjects = useMemo(() => {
    const counts = new Map<string, number>();
    for (const material of all) counts.set(material.subject, (counts.get(material.subject) ?? 0) + 1);
    return [...counts].sort((a, b) => b[1] - a[1]);
  }, [all]);

  const term = query.trim().toLocaleLowerCase("pt-BR");
  const suggestions = term ? all.filter((material) => matches(material, term)).slice(0, 5) : [];
  const showSuggestions = searchFocused && term.length > 0;

  // Enter leva para o Explorar com o termo (lá a lista continua filtrando enquanto digita)
  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    router.push(value ? `/explorar?q=${encodeURIComponent(value)}` : "/explorar");
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      <main className="page-container pt-8 pb-16 lg:pt-10">
        {/* Boas-vindas e busca */}
        <section className="mb-8">
          <p className="mb-1 text-sm font-medium text-primary">Olá{me?.firstName && `, ${me.firstName}`}</p>
          <h1 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">O que você quer estudar hoje?</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Busque um material ou escolha uma disciplina para começar.
          </p>

          <div className="relative mt-6">
            <form
              onSubmit={handleSearch}
              role="search"
              className="flex h-12 w-full items-center gap-2 rounded-xl border bg-card pl-4 pr-2 shadow-sm transition focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30"
            >
              <Search className="size-[19px] shrink-0 text-muted-foreground" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                aria-label="Buscar materiais"
                aria-controls="home-search-suggestions"
                aria-expanded={showSuggestions}
                placeholder="Buscar materiais, disciplinas ou assuntos..."
                className="h-full min-w-0 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
              />
              <Button type="submit" aria-label="Ver resultados no Explorar" className="h-8 px-3 text-xs">
                <span className="hidden sm:inline">Buscar</span>
                <ArrowRight />
              </Button>
            </form>

            {/* Sugestões ao vivo: os 5 primeiros resultados, com atalho para a lista completa */}
            {showSuggestions && (
              <div
                id="home-search-suggestions"
                // Mantém o foco no campo ao clicar numa sugestão (o blur fecharia a lista antes do clique)
                onMouseDown={(event) => event.preventDefault()}
                className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-lg animate-in fade-in-0 slide-in-from-top-1 duration-150"
              >
                <p role="status" className="px-4 pt-3 pb-1 text-xs text-muted-foreground">
                  {loadingAll ? "Buscando..." : suggestions.length === 0 ? "Nenhum material encontrado." : "Sugestões"}
                </p>
                <ul>
                  {suggestions.map((material) => (
                    <li key={material.id}>
                      <Link
                        href={`/materiais/${material.id}`}
                        transitionTypes={["nav-forward"]}
                        className="flex min-h-11 items-center justify-between gap-3 px-4 py-2 text-sm hover:bg-muted focus-visible:bg-muted"
                      >
                        <span className="truncate font-medium">{material.title}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{material.subject}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/explorar?q=${encodeURIComponent(query.trim())}`}
                  transitionTypes={["nav-forward"]}
                  className="flex min-h-11 items-center gap-1.5 border-t px-4 text-sm font-medium text-primary hover:bg-muted"
                >
                  Ver todos os resultados para “{query.trim()}”
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>

          {/* Disciplinas: um toque abre o Explorar já filtrado */}
          {subjects.length > 0 && (
            <nav
              aria-label="Disciplinas"
              className="-mx-5 mt-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {subjects.map(([subject, count]) => (
                <Link
                  key={subject}
                  href={`/explorar?disciplina=${encodeURIComponent(subject)}`}
                  transitionTypes={["nav-forward"]}
                  className="flex h-10 shrink-0 items-center gap-2 rounded-full border bg-card px-4 text-sm font-medium text-foreground/80 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {subject}
                  <span className="rounded-full bg-muted px-1.5 text-xs tabular-nums text-muted-foreground">{count}</span>
                </Link>
              ))}
            </nav>
          )}
        </section>

        {/* Materiais da própria pessoa */}
        <section>
          <SectionHeader title="Seus materiais" subtitle="Os últimos que você publicou" href="/meusmateriais" linkLabel="Ver todos" />

          {loadingMine ? (
            <SkeletonGroup label="Carregando seus materiais" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((item) => (
                <MaterialCardSkeleton key={item} variant="cover" className={cn(item > 0 && "max-sm:hidden")} />
              ))}
            </SkeletonGroup>
          ) : mineError && !myPage ? (
            <LoadError message={mineError.message} onRetry={() => retryMine()} />
          ) : mine.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed bg-card px-6 py-10 text-center">
              <p className="text-sm font-semibold">Você ainda não publicou nenhum material</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Compartilhe um resumo ou anotação; ele aparece aqui para você acompanhar.
              </p>
              <Button size="lg" className="mt-4 h-10" onClick={requestPublishModal}>
                <Plus />
                Publicar meu primeiro material
              </Button>
            </div>
          ) : (
            // No celular: carrossel com deslize horizontal
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 max-sm:-mx-5 max-sm:flex max-sm:snap-x max-sm:snap-mandatory max-sm:scroll-px-5 max-sm:gap-3 max-sm:overflow-x-auto max-sm:px-5 max-sm:pb-2 max-sm:[scrollbar-width:none]">
              {mine.map((material) => (
                <MaterialCard key={material.id} material={material} variant="cover" className="max-sm:w-[78%] max-sm:shrink-0 max-sm:snap-start" />
              ))}
            </div>
          )}
        </section>

        {/* Novidades da comunidade */}
        <section className="mt-12 sm:mt-14">
          <SectionHeader
            title="Novos materiais"
            subtitle="Publicados recentemente pela comunidade"
            href="/explorar"
            linkLabel="Explorar"
          />

          {loadingAll ? (
            <SkeletonGroup label="Carregando novos materiais" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[0, 1, 2, 3].map((item) => (
                <MaterialCardSkeleton key={item} />
              ))}
            </SkeletonGroup>
          ) : allError && !allPage ? (
            <LoadError message={allError.message} onRetry={() => retryAll()} />
          ) : recent.length === 0 ? (
            <p className="rounded-2xl border border-dashed bg-card px-6 py-10 text-center text-sm text-muted-foreground">
              Ainda não há materiais publicados. Que tal ser a primeira pessoa a compartilhar?
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {recent.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
