"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import LinkProgress from "@/components/link-progress";
import { useRouter } from "next/navigation";
import {
  Clock3,
  Download,
  FileText,
  Folder,
  MoreVertical,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import SubjectCover from "@/components/subject-cover";
import { toast } from "@/components/toast";
import { listMyMaterials, setMaterialActive } from "@/lib/api/materials";
import { downloadFile, listFiles } from "@/lib/api/files";
import { requestPublishModal, useEscapeKey } from "@/lib/hooks";

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

export default function MeusMateriaisPage() {
  const router = useRouter();

  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [baixando, setBaixando] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listMyMaterials()
      .then((page) =>
        setMateriais(
          page.content.map((material) => ({
            id: material.id,
            titulo: material.title,
            categoria: material.subject,
            curso: material.course,
            tempo: formatDate(material.createdAt),
          }))
        )
      )
      .catch((error: Error) => setLoadError(error.message))
      .finally(() => setLoading(false));
  }, []);

  const fecharMenu = useCallback(() => setMenuAberto(null), []);
  useEscapeKey(menuAberto !== null, fecharMenu);

  // Fecha o menu de ações ao clicar fora dele
  useEffect(() => {
    if (menuAberto === null) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuAberto(null);
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuAberto]);

  async function baixarMaterial(material: Material) {
    setMenuAberto(null);
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
    } catch (error) {
      toast(error instanceof Error ? error.message : "Não foi possível baixar o arquivo.", { type: "error" });
    } finally {
      setBaixando(null);
    }
  }

  // Exclusão lógica (a API só desativa), então dá para oferecer "Desfazer" em vez de pedir confirmação
  async function excluirMaterial(material: Material) {
    setMenuAberto(null);

    const posicao = materiais.findIndex((item) => item.id === material.id);

    try {
      await setMaterialActive(material.id, false);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Não foi possível excluir o material.", { type: "error" });
      return;
    }

    setMateriais((atual) => atual.filter((item) => item.id !== material.id));

    toast(`"${material.titulo}" foi excluído.`, {
      type: "success",
      action: {
        label: "Desfazer",
        onClick: async () => {
          try {
            await setMaterialActive(material.id, true);
            setMateriais((atual) => {
              const copia = [...atual];
              copia.splice(Math.min(posicao, copia.length), 0, material);
              return copia;
            });
          } catch (error) {
            toast(error instanceof Error ? error.message : "Não foi possível restaurar o material.", { type: "error" });
          }
        },
      },
    });
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-surface">

      <main className="mx-auto w-full max-w-[1500px] px-5 pb-16 pt-10 sm:px-8 lg:px-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <Folder className="h-6 w-6 text-purple-600" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-brand-ink sm:text-4xl">
                Meus materiais
              </h1>
            </div>

            <p className="text-sm text-gray-600 sm:text-base">
              Todos os materiais que você publicou na plataforma.
            </p>
          </div>

          {!loading && !loadError && (
            <div className="flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 shadow-sm ring-1 ring-black/5 sm:self-auto">
              <FileText className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-brand-ink">
                {materiais.length}{" "}
                {materiais.length === 1 ? "material publicado" : "materiais publicados"}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div role="status" aria-label="Carregando seus materiais" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} aria-hidden="true" className="h-[300px] animate-pulse rounded-2xl bg-white ring-1 ring-black/5">
                <div className="h-48 rounded-t-2xl bg-gray-100" />
                <div className="space-y-2 p-5">
                  <div className="h-4 w-3/4 rounded bg-gray-100" />
                  <div className="h-3 w-1/2 rounded bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : loadError ? (
          <div role="alert" className="flex flex-col items-center py-16 text-center">
            <p className="text-sm text-red-600">{loadError}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Tentar novamente
            </button>
          </div>
        ) : materiais.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-white px-6 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
              <Folder className="h-8 w-8 text-purple-600" />
            </div>

            <h2 className="text-xl font-bold text-brand-ink">
              Você ainda não publicou materiais
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
              Compartilhe resumos, listas e anotações com a comunidade. Tudo o que você publicar aparece aqui.
            </p>

            <button
              type="button"
              onClick={requestPublishModal}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-lg bg-purple-600 px-4 text-sm font-medium text-white transition hover:bg-purple-700"
            >
              <Plus size={16} />
              Publicar material
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {materiais.map((material) => (
              <article
                key={material.id}
                className="group relative rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 focus-within:ring-2 focus-within:ring-purple-500 hover:-translate-y-1 hover:shadow-lg"
              >
                <SubjectCover subject={material.categoria} className="h-48 rounded-t-2xl">
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-purple-700 shadow-sm">
                    {material.categoria}
                  </span>
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

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-4 text-xs text-gray-600">
                    <span className="flex min-w-0 items-center gap-1.5">
                      <FileText className="h-4 w-4 shrink-0" />
                      <span className="truncate">{material.curso}</span>
                    </span>

                    <span className="flex shrink-0 items-center gap-1.5">
                      <Clock3 className="h-4 w-4" />
                      {material.tempo}
                    </span>
                  </div>
                </div>

                {/* Ações: menu suspenso ancorado no botão (acima do link esticado) */}
                <div ref={menuAberto === material.id ? menuRef : undefined} className="absolute right-3 top-3 z-10">
                  <button
                    type="button"
                    onClick={() => setMenuAberto(menuAberto === material.id ? null : material.id)}
                    aria-haspopup="menu"
                    aria-expanded={menuAberto === material.id}
                    aria-label={`Ações de ${material.titulo}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-brand-ink shadow-md transition hover:bg-white"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </button>

                  {menuAberto === material.id && (
                    <div role="menu" className="absolute right-0 top-11 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl">
                      <button
                        type="button"
                        role="menuitem"
                        autoFocus
                        onClick={() => router.push(`/materiais/${material.id}/editar`)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <Pencil size={16} />
                        Editar
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => baixarMaterial(material)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                      >
                        <Download size={16} />
                        Baixar arquivos
                      </button>

                      <div className="my-1 border-t border-gray-100" />

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => excluirMaterial(material)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>

                {baixando === material.id && (
                  <p role="status" className="absolute inset-x-0 bottom-0 rounded-b-2xl bg-purple-600 py-1.5 text-center text-xs font-medium text-white">
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
