"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { Clock3, Download, FileText, Folder, MoreVertical, Pencil, Plus, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LinkProgress from "@/components/link-progress";
import { Skeleton, SkeletonGroup } from "@/components/skeleton";
import SubjectCover from "@/components/subject-cover";
import { toast } from "@/components/toast";
import { downloadFile, listFiles } from "@/lib/api/files";
import { setMaterialActive, type Material as ApiMaterial } from "@/lib/api/materials";
import { invalidateMaterials, keys, useMyMaterials } from "@/lib/api/swr";
import { requestPublishModal } from "@/lib/hooks";

type Material = {
  id: number;
  titulo: string;
  categoria: string;
  curso: string;
  tempo: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

const LIST_KEY = keys.myMaterials(100);

export default function MeusMateriaisPage() {
  const router = useRouter();
  const [baixando, setBaixando] = useState<number | null>(null);

  // Dados em cache (SWR): voltar à aba mostra a lista na hora e atualiza em segundo plano
  const { data, error, isLoading: loading, mutate: retry } = useMyMaterials(100);
  const materiais: Material[] = useMemo(
    () =>
      (data?.content ?? []).map((material) => ({
        id: material.id,
        titulo: material.title,
        categoria: material.subject,
        curso: material.course,
        tempo: formatDate(material.createdAt),
      })),
    [data]
  );

  async function baixarMaterial(material: Material) {
    setBaixando(material.id);

    try {
      const files = await listFiles(material.id);

      if (files.content.length === 0) {
        toast("Este material não tem arquivo anexado.", { type: "error" });
        return;
      }

      for (const file of files.content) {
        await downloadFile(file);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Não foi possível baixar o arquivo.", { type: "error" });
    } finally {
      setBaixando(null);
    }
  }

  // Tira ou devolve o card no cache da lista, sem esperar a API (atualização otimista)
  function removeFromList(id: number) {
    return mutate(
      LIST_KEY,
      (page?: typeof data) => page && { ...page, content: page.content.filter((item) => item.id !== id) },
      { revalidate: false }
    );
  }

  function restoreToList(original: ApiMaterial, posicao: number) {
    return mutate(
      LIST_KEY,
      (page?: typeof data) => {
        if (!page || page.content.some((item) => item.id === original.id)) return page;
        const content = [...page.content];
        content.splice(Math.max(0, Math.min(posicao, content.length)), 0, original);
        return { ...page, content };
      },
      { revalidate: false }
    );
  }

  // Exclusão lógica (a API só desativa), então dá para oferecer "Desfazer" em vez de pedir confirmação.
  // O card some na hora; se a API falhar, ele volta para o mesmo lugar com um aviso de erro.
  async function excluirMaterial(material: Material) {
    const original = data?.content.find((item) => item.id === material.id);
    const posicao = data?.content.findIndex((item) => item.id === material.id) ?? -1;
    if (!original) return;

    removeFromList(material.id);

    try {
      await setMaterialActive(material.id, false);
    } catch (err) {
      restoreToList(original, posicao);
      toast(err instanceof Error ? err.message : "Não foi possível excluir o material.", { type: "error" });
      return;
    }

    invalidateMaterials();

    toast(`"${material.titulo}" foi excluído.`, {
      type: "success",
      action: {
        label: "Desfazer",
        onClick: async () => {
          restoreToList(original, posicao);

          try {
            await setMaterialActive(material.id, true);
            invalidateMaterials();
          } catch (err) {
            removeFromList(material.id);
            toast(err instanceof Error ? err.message : "Não foi possível restaurar o material.", { type: "error" });
          }
        },
      },
    });
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      <main className="page-container pt-8 pb-16 lg:pt-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Folder className="size-6" />
              </span>
              <h1 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">Meus materiais</h1>
            </div>
            <p className="text-sm text-muted-foreground sm:text-base">Todos os materiais que você publicou na plataforma.</p>
          </div>

          {!loading && !error && (
            <Badge variant="outline" className="h-9 gap-2 self-start rounded-full bg-card px-4 text-sm sm:self-auto">
              <FileText className="text-primary" />
              {materiais.length} {materiais.length === 1 ? "material publicado" : "materiais publicados"}
            </Badge>
          )}
        </div>

        {loading ? (
          <SkeletonGroup label="Carregando seus materiais" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
                <Skeleton className="h-48 rounded-none" />
                <div className="p-5">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="mt-[3.25rem] flex justify-between border-t pt-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </SkeletonGroup>
        ) : error ? (
          <div role="alert" className="flex flex-col items-center py-16 text-center">
            <p className="text-sm text-destructive">{error.message}</p>
            <Button variant="outline" className="mt-4" onClick={() => retry()}>
              Tentar novamente
            </Button>
          </div>
        ) : materiais.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card px-6 text-center">
            <span className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
              <Folder className="size-8" />
            </span>
            <h2 className="text-xl font-bold text-brand-ink">Você ainda não publicou materiais</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
              Compartilhe resumos, listas e anotações com a comunidade. Tudo o que você publicar aparece aqui.
            </p>
            <Button size="lg" className="mt-6" onClick={requestPublishModal}>
              <Plus />
              Publicar material
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {materiais.map((material) => (
              <article
                key={material.id}
                className="group relative rounded-2xl bg-card shadow-sm ring-1 ring-foreground/10 transition-shadow duration-200 focus-within:ring-2 focus-within:ring-ring hover:shadow-lg"
              >
                <SubjectCover subject={material.categoria} className="h-48 rounded-t-2xl">
                  <Badge className="absolute left-4 top-4 bg-card/95 text-primary shadow-sm">{material.categoria}</Badge>
                </SubjectCover>

                <div className="p-5">
                  {/* Link "esticado": o card inteiro é clicável e navegável por teclado, sem div com onClick */}
                  <h2 className="line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-brand-ink">
                    <Link
                      href={`/materiais/${material.id}`}
                      transitionTypes={["nav-forward"]}
                      className="outline-none after:absolute after:inset-0 after:rounded-2xl after:content-['']"
                    >
                      {material.titulo}
                      <LinkProgress />
                    </Link>
                  </h2>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4 text-xs text-muted-foreground">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <FileText className="size-4 shrink-0" />
                      <span className="truncate">{material.curso}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      <Clock3 className="size-4" />
                      {material.tempo}
                    </span>
                  </div>
                </div>

                {/* Ações (DropdownMenu do shadcn/ui: clique fora, Esc, foco e animação já inclusos) */}
                <div className="absolute right-3 top-3 z-10">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        size="icon"
                        aria-label={`Ações de ${material.titulo}`}
                        className="size-9 rounded-full bg-card/95 shadow-md hover:bg-card"
                      >
                        <MoreVertical />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52">
                      <DropdownMenuItem onSelect={() => router.push(`/materiais/${material.id}/editar`)}>
                        <Pencil />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => baixarMaterial(material)}>
                        <Download />
                        Baixar arquivos
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive" onSelect={() => excluirMaterial(material)}>
                        <Trash2 />
                        Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {baixando === material.id && (
                  <p role="status" className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-primary py-1.5 text-center text-xs font-medium text-primary-foreground">
                    Baixando...
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
