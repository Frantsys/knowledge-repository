"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDownAZ, BookOpen, Filter, RotateCcw, Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MaterialCard, { MaterialCardSkeleton } from "@/components/material-card";
import { SkeletonGroup } from "@/components/skeleton";
import { type Material } from "@/lib/api/materials";
import { useMaterials } from "@/lib/api/swr";
import { cn } from "@/lib/utils";


export default function ExplorarPage() {
  // Termo vindo da busca da tela inicial (/explorar?q=...)
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("q") ?? "");
  // Filtra enquanto digita: a lista é local, então a resposta é imediata; o valor adiado mantém o campo fluido
  const query = useDeferredValue(search).trim();
  // ?disciplina= vem dos atalhos de disciplina do Início
  const [selectedSubject, setSelectedSubject] = useState(() => searchParams.get("disciplina") ?? "Todas");
  const [order, setOrder] = useState("recentes");

  // shortcut: busca/filtro no cliente sobre os 100 mais recentes; criar busca no servidor quando houver muitos materiais
  const { data, error: loadError, isLoading: loading, mutate: retry } = useMaterials(100);
  const materials: Material[] = useMemo(() => (data?.content ?? []).filter((material) => material.isActive), [data]);

  const subjects = useMemo(() => ["Todas", ...new Set(materials.map((material) => material.subject))], [materials]);

  const filteredMaterials = useMemo(() => {
    let result = [...materials];

    if (selectedSubject !== "Todas") {
      result = result.filter((material) => material.subject === selectedSubject);
    }

    if (query) {
      const term = query.toLocaleLowerCase("pt-BR");
      result = result.filter((material) =>
        [material.title, material.body, material.subject, material.course, material.createdBy].some((value) =>
          value.toLocaleLowerCase("pt-BR").includes(term)
        )
      );
    }

    if (order === "recentes") {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (order === "alfabetica") {
      result.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    }

    return result;
  }, [materials, query, selectedSubject, order]);

  // Mantém ?q= na URL (para voltar ou compartilhar a busca) sem navegar nem recarregar
  function updateSearch(value: string) {
    setSearch(value);
    const url = value.trim() ? `?q=${encodeURIComponent(value.trim())}` : window.location.pathname;
    window.history.replaceState(null, "", url);
  }

  // O resultado já acompanha a digitação; enviar só tira o foco (útil no teclado do celular)
  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    (document.activeElement as HTMLElement | null)?.blur();
  }

  function clearFilters() {
    updateSearch("");
    setSelectedSubject("Todas");
    setOrder("recentes");
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      <main className="page-container pt-8 pb-16 lg:pt-10">
        {/* Busca */}
        <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#250080] via-purple-700 to-indigo-600 px-4 py-5 text-white shadow-sm sm:mb-7 sm:px-8 sm:py-9">
          <div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border border-white/10" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-white/5" />

          <div className="relative max-w-2xl">
            <h1 className="text-xl font-bold tracking-tight sm:text-3xl">Explore novos conhecimentos</h1>
            <p className="mt-2 hidden max-w-xl text-sm leading-6 text-white/80 sm:block sm:text-base">
              Encontre resumos, anotações e conteúdos compartilhados por estudantes para apoiar sua jornada acadêmica.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            role="search"
            className="relative mt-4 flex max-w-3xl gap-2 rounded-xl bg-card p-1 text-card-foreground shadow-lg sm:mt-6 sm:p-2"
          >
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-primary" />
              <Input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Buscar por material, disciplina ou assunto..."
                aria-label="Buscar materiais"
                className="h-10 border-0 bg-transparent pl-10 shadow-none focus-visible:ring-0 dark:bg-transparent"
              />
            </div>
            <Button type="submit" size="lg" className="hidden h-10 px-5 font-semibold sm:inline-flex">
              <Search />
              Buscar materiais
            </Button>
          </form>
        </section>

        {/* Barra: filtros (celular) e ordenação */}
        {/* Disciplinas em chips (celular e tablet): um toque filtra, sem abrir painel */}
        {subjects.length > 1 && (
          <div
            role="radiogroup"
            aria-label="Filtrar por disciplina"
            className="-mx-4 mb-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:hidden [&::-webkit-scrollbar]:hidden"
          >
            {subjects.map((subject) => {
              const active = selectedSubject === subject;
              return (
                <button
                  key={subject}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSelectedSubject(subject)}
                  className={cn(
                    "h-10 shrink-0 rounded-full border px-4 text-sm font-medium transition-colors",
                    active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-foreground/80 hover:border-primary/40"
                  )}
                >
                  {subject}
                </button>
              );
            })}
          </div>
        )}

        <div className="mb-5 flex items-center justify-end gap-3">
          <div className="flex items-center gap-2">
            <Label htmlFor="ordenar" className="hidden text-sm font-normal text-muted-foreground sm:flex">
              <ArrowDownAZ className="size-4 text-primary" />
              Ordenar:
            </Label>
            <Select value={order} onValueChange={setOrder}>
              <SelectTrigger id="ordenar" aria-label="Ordenar materiais" className="h-10 min-w-44 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="recentes">Mais recentes</SelectItem>
                <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* Filtros */}
          <Card id="explorar-filtros" className="hidden gap-0 rounded-2xl p-5 lg:sticky lg:top-5 lg:flex">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Filter className="size-4" />
                </span>
                <div>
                  <h2 className="text-sm font-semibold">Filtrar materiais</h2>
                  <p className="text-xs text-muted-foreground">Refine sua busca</p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="subject" className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Disciplina
                </Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger id="subject" className="h-10 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-xl bg-muted p-3.5">
                <p className="text-xs font-semibold">Dica de pesquisa</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Você também pode buscar pelo nome do autor ou pelo curso.</p>
              </div>

              <Button variant="outline" onClick={clearFilters} className="h-10 w-full">
                <X />
                Limpar filtros
              </Button>
            </div>
          </Card>

          {/* Resultados */}
          <section aria-label="Resultados dos materiais">
            {!loading && !loadError && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p role="status" className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{filteredMaterials.length}</span>{" "}
                  {filteredMaterials.length === 1 ? "material encontrado" : "materiais encontrados"}
                  {query && (
                    <>
                      {" "}para <span className="font-medium text-primary">“{query}”</span>
                    </>
                  )}
                </p>

                {(selectedSubject !== "Todas" || query) && (
                  <Button variant="link" size="sm" onClick={clearFilters} className="h-auto px-0 text-xs font-semibold">
                    Limpar busca e filtros
                  </Button>
                )}
              </div>
            )}

            {loading ? (
              <SkeletonGroup label="Carregando materiais" className="grid gap-4 md:grid-cols-2">
                {[0, 1, 2, 3].map((item) => (
                  <MaterialCardSkeleton key={item} />
                ))}
              </SkeletonGroup>
            ) : loadError ? (
              <Card role="alert" className="items-center rounded-2xl px-5 py-14 text-center">
                <p className="whitespace-pre-line text-sm text-destructive">{loadError.message}</p>
                <Button variant="outline" onClick={() => retry()}>
                  <RotateCcw />
                  Tentar novamente
                </Button>
              </Card>
            ) : filteredMaterials.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredMaterials.map((material) => (
                  <MaterialCard key={material.id} material={material} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed bg-card px-5 py-14 text-center sm:px-8">
                <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <BookOpen className="size-6" />
                </span>
                <h2 className="text-base font-semibold">Nenhum material encontrado</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Não encontramos materiais com esses critérios. Experimente outro termo ou remova os filtros.
                </p>
                <Button className="mt-5" size="lg" onClick={clearFilters}>
                  Ver todos os materiais
                </Button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
