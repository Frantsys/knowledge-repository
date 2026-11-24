"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Clock3, Download, FileText, Folder, GraduationCap, Loader2, Pencil, RotateCcw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton, SkeletonGroup } from "@/components/skeleton";
import SubjectCover from "@/components/subject-cover";
import { toast } from "@/components/toast";
import UserAvatar from "@/components/user-avatar";
import { downloadFile, type MaterialFile } from "@/lib/api/files";
import { useFiles, useMaterial, useMe } from "@/lib/api/swr";
import Comments from "./comments";
import MaterialSkeleton from "./material-skeleton";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export default function MaterialPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [downloading, setDownloading] = useState<number | "all" | null>(null);

  // O material decide quando a página aparece; arquivos e comentários carregam em paralelo,
  // cada um com o próprio esqueleto, em vez de a página inteira esperar as quatro respostas
  const { data, error, isLoading: loading, mutate: retryMaterial } = useMaterial(id);
  const { data: filesPage, isLoading: loadingFiles } = useFiles(id);
  const { data: me } = useMe();

  const files: MaterialFile[] = filesPage?.content ?? [];
  // 404 vira "não encontrado"; qualquer outra falha mostra o erro com opção de tentar de novo
  const loadError = error && (error as Error & { status?: number }).status !== 404 ? error.message : null;

  // Volta para a tela de onde o usuário veio (Explorar, Meus materiais, Início); sem histórico, vai ao Explorar
  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/explorar");
  }

  async function handleDownload(target: MaterialFile | "all") {
    setDownloading(target === "all" ? "all" : target.id);

    try {
      for (const file of target === "all" ? files : [target]) {
        await downloadFile(file);
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : "Não foi possível baixar o arquivo.", { type: "error" });
    } finally {
      setDownloading(null);
    }
  }

  if (loading) {
    return <MaterialSkeleton />;
  }

  if (loadError) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-background">
        <div role="alert" className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
          <h1 className="text-2xl font-bold text-brand-ink">Não foi possível carregar o material</h1>
          <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{loadError}</p>
          <div className="mt-6 flex gap-2">
            <Button variant="outline" size="lg" onClick={goBack}>
              Voltar
            </Button>
            <Button size="lg" onClick={() => retryMaterial()}>
              <RotateCcw />
              Tentar novamente
            </Button>
          </div>
        </div>
      </main>
    );
  }

  if (!data || !data.isActive) {
    return (
      <main className="min-h-[calc(100dvh-4rem)] bg-background">
        <div className="mx-auto flex min-h-[70vh] max-w-[900px] flex-col items-center justify-center px-5 text-center">
          <span className="flex size-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
            <FileText className="size-8" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-brand-ink">Material não encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">Ele pode ter sido removido pelo autor ou o link está incorreto.</p>
          <Button size="lg" className="mt-6" onClick={() => router.push("/explorar")}>
            <ArrowLeft />
            Voltar para explorar materiais
          </Button>
        </div>
      </main>
    );
  }

  const isOwner = me !== undefined && data.userId === me.id;
  const paragraphs = data.body.split(/\n+/).filter(Boolean);

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-background">
      <div className="mx-auto max-w-4xl px-5 pt-8 pb-16 sm:px-8 lg:pt-10">
        <Button variant="ghost" onClick={goBack} className="mb-6 -ml-2 text-muted-foreground">
          <ArrowLeft />
          Voltar
        </Button>

        {/* Cabeçalho: capa, autoria e os arquivos (o motivo da visita) logo abaixo */}
        <Card className="gap-0 overflow-hidden rounded-2xl py-0">
          <SubjectCover subject={data.subject} className="h-[200px] sm:h-[240px]">
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-7">
              <Badge className="gap-1.5 bg-card/90 text-primary backdrop-blur">
                <Folder />
                {data.subject}
              </Badge>
              <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">{data.title}</h1>
            </div>
          </SubjectCover>

          <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <UserAvatar avatarUrl={data.user?.avatarUrl} name={data.createdBy} className="size-6 text-xs" fallbackClassName="bg-accent text-accent-foreground" />
                <span>
                  Por <span className="font-medium text-foreground">{data.createdBy}</span>
                </span>
              </span>
              <span className="flex items-center gap-2">
                <GraduationCap className="size-4 text-primary" />
                {data.course}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="size-4 text-primary" />
                {formatDate(data.createdAt)}
              </span>
            </div>

            {isOwner && (
              <Button variant="outline" size="lg" className="h-10" onClick={() => router.push(`/materiais/${data.id}/editar`)}>
                <Pencil />
                Editar
              </Button>
            )}
          </div>

          <div className="border-t bg-muted/30 px-5 py-4 sm:px-8">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold">Arquivos{!loadingFiles && ` (${files.length})`}</h2>
              {files.length > 1 && (
                <Button size="sm" disabled={downloading !== null} onClick={() => handleDownload("all")}>
                  {downloading === "all" ? <Loader2 className="animate-spin" /> : <Download />}
                  {downloading === "all" ? "Baixando..." : "Baixar tudo"}
                </Button>
              )}
            </div>

            {loadingFiles && (
              <SkeletonGroup label="Carregando arquivos">
                <Skeleton className="h-12 w-full rounded-lg" />
              </SkeletonGroup>
            )}

            {!loadingFiles && files.length === 0 && <p className="text-sm text-muted-foreground">Este material não tem arquivos anexados.</p>}

            <ul className="space-y-2">
              {files.map((file) => (
                <li key={file.id} className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <FileText className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{fileDetails(file)}</p>
                  </div>
                  <Button
                    variant={files.length === 1 ? "default" : "outline"}
                    disabled={downloading !== null}
                    onClick={() => handleDownload(file)}
                    aria-label={`Baixar ${file.name}`}
                  >
                    {downloading === file.id ? <Loader2 className="animate-spin" /> : <Download />}
                    <span className="hidden sm:inline">{downloading === file.id ? "Baixando..." : "Baixar"}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* Conteúdo e comentários */}
        <Card className="mt-6 gap-0 rounded-2xl px-6 py-7 sm:px-10 sm:py-9">
          <section>
            <h2 className="text-xl font-bold text-brand-ink">Conteúdo</h2>
            <div className="mt-3 max-w-[70ch] space-y-3">
              {paragraphs.map((paragraph, index) => (
                <p key={index} className="text-base leading-7 text-foreground/80">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <Separator className="my-8" />

          <Comments materialId={data.id} />
        </Card>
      </div>
    </main>
  );
}

// Tipo pela extensão e tamanho legível (a API manda os bytes como texto), ex.: "PDF · 1,2 MB"
function fileDetails(file: MaterialFile) {
  const extension = file.name.includes(".") ? file.name.split(".").pop()!.toUpperCase() : null;
  const bytes = Number(file.size);
  const size =
    file.size && Number.isFinite(bytes)
      ? bytes < 1024 * 1024
        ? `${Math.max(1, Math.round(bytes / 1024))} KB`
        : `${(bytes / (1024 * 1024)).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`
      : file.size;
  return [extension, size].filter(Boolean).join(" · ") || "Arquivo";
}
