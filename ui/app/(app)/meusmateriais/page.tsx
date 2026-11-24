"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { Download, FileText, Folder, MoreVertical, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MaterialCard, { MaterialCardSkeleton } from "@/components/material-card";
import { SkeletonGroup } from "@/components/skeleton";
import { toast } from "@/components/toast";
import { downloadFile, listFiles } from "@/lib/api/files";
import { setMaterialActive, type Material } from "@/lib/api/materials";
import { invalidateMaterials, keys, useMyMaterials } from "@/lib/api/swr";
import { requestPublishModal } from "@/lib/hooks";

const LIST_KEY = keys.myMaterials(100);
// A partir daqui a lista ganha busca e ordenação (com poucos itens, elas só ocupariam espaço)
const TOOLS_FROM = 7;

export default function MeusMateriaisPage() {
  const router = useRouter();
  const [baixando, setBaixando] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("recentes");

  // Dados em cache (SWR): voltar à aba mostra a lista na hora e atualiza em segundo plano
  const { data, error, isLoading: loading, mutate: retry } = useMyMaterials(100);
  const materiais: Material[] = useMemo(() => data?.content ?? [], [data]);
  const showTools = materiais.length >= TOOLS_FROM;

  const visiveis = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    const result = term
      ? materiais.filter((material) =>
          [material.title, material.body, material.subject].some((value) => value.toLocaleLowerCase("pt-BR").includes(term))
        )
      : [...materiais];

    if (order === "alfabetica") result.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
    else result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }, [materiais, search, order]);

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

  function restoreToList(original: Material, posicao: number) {
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
    const posicao = materiais.findIndex((item) => item.id === material.id);

    removeFromList(material.id);

    try {
      await setMaterialActive(material.id, false);
    } catch (err) {
      restoreToList(material, posicao);
      toast(err instanceof Error ? err.message : "Não foi possível excluir o material.", { type: "error" });
      return;
    }

    invalidateMaterials();

    toast(`"${material.title}" foi excluído.`, {
      type: "success",
      action: {
        label: "Desfazer",
        onClick: async () => {
          restoreToList(material, posicao);

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

        {showTools && (
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar nos seus materiais..."
                aria-label="Buscar nos seus materiais"
                className="h-10 bg-card pl-9"
              />
            </div>
            <Select value={order} onValueChange={setOrder}>
              <SelectTrigger aria-label="Ordenar materiais" className="h-10 min-w-44 bg-card">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                <SelectItem value="recentes">Mais recentes</SelectItem>
                <SelectItem value="alfabetica">Ordem alfabética</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {loading ? (
          <SkeletonGroup label="Carregando seus materiais" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <MaterialCardSkeleton key={item} variant="cover" />
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
        ) : visiveis.length === 0 ? (
          <p role="status" className="rounded-2xl border border-dashed bg-card px-6 py-12 text-center text-sm text-muted-foreground">
            Nenhum dos seus materiais corresponde a “{search.trim()}”.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visiveis.map((material) => (
              <div key={material.id} className="relative">
                <MaterialCard
                  material={material}
                  variant="cover"
                  className="h-full"
                  actions={
                    // Ações (DropdownMenu do shadcn/ui: clique fora, Esc, foco e animação já inclusos)
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="secondary"
                          size="icon"
                          aria-label={`Ações de ${material.title}`}
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
                  }
                />

                {baixando === material.id && (
                  <p
                    role="status"
                    className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-primary py-1.5 text-center text-xs font-medium text-primary-foreground"
                  >
                    Baixando...
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
