"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, Clock3, Download, FileText, Folder, Loader2, Pencil, RotateCcw, Send } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton, SkeletonGroup } from "@/components/skeleton";
import SubjectCover from "@/components/subject-cover";
import { toast } from "@/components/toast";
import UserAvatar from "@/components/user-avatar";
import { createComment, type Comment } from "@/lib/api/comments";
import { downloadFile, type MaterialFile } from "@/lib/api/files";
import { useComments, useFiles, useMaterial, useMe } from "@/lib/api/swr";
import MaterialSkeleton from "./material-skeleton";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export default function MaterialPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [sendingComment, setSendingComment] = useState(false);
  const [downloading, setDownloading] = useState<number | "all" | null>(null);

  // O material decide quando a página aparece; arquivos e comentários carregam em paralelo,
  // cada um com o próprio esqueleto, em vez de a página inteira esperar as quatro respostas
  const { data, error, isLoading: loading, mutate: retryMaterial } = useMaterial(id);
  const { data: filesPage, isLoading: loadingFiles } = useFiles(id);
  const { data: commentsPage, isLoading: loadingComments, mutate: mutateComments } = useComments(id);
  const { data: me } = useMe();

  const files: MaterialFile[] = filesPage?.content ?? [];
  const comments: Comment[] = commentsPage?.content ?? [];
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

  async function handleComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCommentError(null);
    setSendingComment(true);

    try {
      const comment = await createComment(id, newComment.trim());
      // Entra no topo da lista na hora, sem buscar todos os comentários de novo
      await mutateComments((page) => page && { ...page, content: [comment, ...page.content] }, { revalidate: false });
      setNewComment("");
    } catch (err) {
      setCommentError(err instanceof Error ? err.message : "Não foi possível comentar.");
    } finally {
      setSendingComment(false);
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
  const filesLabel = loadingFiles ? "Arquivos…" : `${files.length} ${files.length === 1 ? "arquivo" : "arquivos"}`;
  const publishedAt = formatDate(data.createdAt);

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-background">
      <div className="page-container pt-8 pb-16 lg:pt-10">
        <Button variant="ghost" onClick={goBack} className="mb-6 -ml-2 text-muted-foreground">
          <ArrowLeft />
          Voltar
        </Button>

        {/* Cabeçalho do material */}
        <Card className="gap-0 overflow-hidden rounded-2xl py-0">
          <SubjectCover subject={data.subject} className="h-[220px] sm:h-[280px]">
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
                Por {data.createdBy}
              </span>
              <span className="flex items-center gap-2">
                <FileText className="size-4 text-primary" />
                {filesLabel}
              </span>
              <span className="flex items-center gap-2">
                <Clock3 className="size-4 text-primary" />
                {publishedAt}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="lg"
                disabled={loadingFiles || files.length === 0 || downloading !== null}
                onClick={() => handleDownload("all")}
                title={files.length === 0 ? "Este material não tem arquivos anexados" : undefined}
                className="h-10 text-primary hover:text-primary"
              >
                {downloading === "all" ? <Loader2 className="animate-spin" /> : <Download />}
                {downloading === "all" ? "Baixando..." : files.length > 1 ? `Baixar ${files.length} arquivos` : "Baixar"}
              </Button>

              {isOwner && (
                <Button size="lg" className="h-10" onClick={() => router.push(`/materiais/${data.id}/editar`)}>
                  <Pencil />
                  Editar
                </Button>
              )}
            </div>
          </div>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
          {/* Conteúdo e comentários */}
          <Card className="gap-0 rounded-2xl px-6 py-7 sm:px-10 sm:py-9">
            <section>
              <h2 className="text-xl font-bold text-brand-ink">Sobre este material</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">Material do curso de {data.course}.</p>
            </section>

            <Separator className="my-8" />

            <section>
              <h2 className="text-xl font-bold text-brand-ink">Conteúdo</h2>
              <div className="mt-3 space-y-3">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-base leading-7 text-foreground/80">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>

            <Separator className="my-8" />

            <section>
              <h2 className="text-lg font-bold text-brand-ink">
                Comentários{loadingComments ? "" : ` (${comments.length})`}
              </h2>

              <form onSubmit={handleComment} className="mt-4 space-y-2">
                <Label htmlFor="new-comment" className="sr-only">
                  Escreva um comentário
                </Label>
                <Textarea
                  id="new-comment"
                  rows={3}
                  value={newComment}
                  onChange={(event) => setNewComment(event.target.value)}
                  placeholder="Escreva um comentário..."
                  className="min-h-20 resize-none"
                />

                {commentError && (
                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertDescription className="whitespace-pre-line">{commentError}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={!newComment.trim() || sendingComment}>
                  {sendingComment ? <Loader2 className="animate-spin" /> : <Send />}
                  {sendingComment ? "Enviando..." : "Comentar"}
                </Button>
              </form>

              {loadingComments && (
                <SkeletonGroup label="Carregando comentários" className="mt-6 space-y-4">
                  {[0, 1].map((item) => (
                    <div key={item} className="flex gap-3 rounded-xl border p-4">
                      <Skeleton className="size-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3 w-40" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    </div>
                  ))}
                </SkeletonGroup>
              )}

              {!loadingComments && comments.length === 0 && (
                <p className="mt-6 text-sm text-muted-foreground">
                  Ainda não há comentários. Tire uma dúvida ou deixe um agradecimento ao autor.
                </p>
              )}

              <ul className="mt-6 space-y-4">
                {comments.map((comment) => (
                  <li key={comment.id} className="flex gap-3 rounded-xl border bg-card p-4">
                    <UserAvatar
                      avatarUrl={comment.authorAvatarUrl}
                      name={comment.createdBy}
                      className="size-9 text-xs"
                      fallbackClassName="bg-accent text-accent-foreground"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-muted-foreground">
                        <span className="font-semibold text-foreground">{comment.createdBy}</span>
                        {" · "}
                        {formatDate(comment.createdAt)}
                      </p>
                      <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground/80">{comment.body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </Card>

          {/* Lateral */}
          <aside className="h-fit space-y-5 lg:sticky lg:top-24">
            <Card className="gap-0 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-brand-ink">Informações</h3>
              <dl className="mt-5 space-y-4 text-sm">
                <Info label="Categoria" value={data.subject} />
                <Info label="Autor" value={data.createdBy} />
                <Info label="Quantidade" value={filesLabel} />
                <Info label="Publicado" value={publishedAt} />
              </dl>
            </Card>

            <Card className="gap-0 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-brand-ink">Arquivos</h3>
              <div className="mt-3 space-y-1">
                {loadingFiles && (
                  <SkeletonGroup label="Carregando arquivos" className="px-2 py-1">
                    <Skeleton className="h-4 w-40" />
                  </SkeletonGroup>
                )}

                {!loadingFiles && files.length === 0 && <p className="px-2 text-xs text-muted-foreground">Nenhum arquivo anexado.</p>}

                {files.map((file) => (
                  <Button
                    key={file.id}
                    variant="ghost"
                    onClick={() => handleDownload(file)}
                    disabled={downloading !== null}
                    aria-label={`Baixar ${file.name}`}
                    className="h-9 w-full justify-start px-2 text-xs font-normal text-muted-foreground hover:text-primary"
                  >
                    {downloading === file.id ? <Loader2 className="animate-spin" /> : <Download />}
                    <span className="truncate">{downloading === file.id ? "Baixando..." : file.name}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
