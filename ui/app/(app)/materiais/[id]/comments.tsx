"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, Loader2, MoreHorizontal, Pencil, Reply, Send, Trash2 } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton, SkeletonGroup } from "@/components/skeleton";
import { formatMaterialDate } from "@/components/material-card";
import { toast } from "@/components/toast";
import UserAvatar from "@/components/user-avatar";
import { createComment, deleteComment, replyComment, updateComment, type Comment } from "@/lib/api/comments";
import { useComments, useMe } from "@/lib/api/swr";

// Campo de texto com botão de enviar que só aparece quando há texto (evita o botão "apagado" sem explicação)
function CommentForm({
  id,
  label,
  placeholder,
  submitLabel,
  initialValue = "",
  autoFocus = false,
  onSubmit,
  onCancel,
}: {
  id: string;
  label: string;
  placeholder: string;
  submitLabel: string;
  initialValue?: string;
  autoFocus?: boolean;
  onSubmit: (body: string) => Promise<void>;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState(initialValue);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasText = value.trim().length > 0;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!hasText) return;
    setSending(true);
    setError(null);
    try {
      await onSubmit(value.trim());
      setValue("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível enviar.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <Textarea
        id={id}
        rows={onCancel ? 2 : 3}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="min-h-16 resize-none"
      />

      {error && (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
        </Alert>
      )}

      {(hasText || onCancel) && (
        <div className="flex gap-2 animate-in fade-in-0 duration-150">
          <Button type="submit" disabled={!hasText || sending}>
            {sending ? <Loader2 className="animate-spin" /> : <Send />}
            {sending ? "Enviando..." : submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancelar
            </Button>
          )}
        </div>
      )}
    </form>
  );
}

function CommentItem({
  comment,
  isOwn,
  onReply,
  onEdit,
  onDelete,
  children,
}: {
  comment: Comment;
  isOwn: boolean;
  onReply?: () => void;
  onEdit: (body: string) => Promise<void>;
  onDelete: () => void;
  children?: React.ReactNode;
}) {
  const [editing, setEditing] = useState(false);

  return (
    <li className="flex gap-3">
      <UserAvatar
        avatarUrl={comment.authorAvatarUrl}
        name={comment.createdBy}
        className="size-9 text-xs"
        fallbackClassName="bg-accent text-accent-foreground"
      />
      <div className="min-w-0 flex-1">
        <div className="rounded-xl border bg-card px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{comment.createdBy}</span>
              {" · "}
              <span className="whitespace-nowrap">{formatMaterialDate(comment.createdAt)}</span>
              {comment.updatedAt && " · editado"}
            </p>

            {isOwn && !editing && (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" aria-label="Ações do comentário" className="-mr-2 -mt-1 text-muted-foreground">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onSelect={() => setEditing(true)}>
                    <Pencil />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                    <Trash2 />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {editing ? (
            <div className="mt-2">
              <CommentForm
                id={`edit-${comment.id}`}
                label="Editar comentário"
                placeholder="Escreva seu comentário..."
                submitLabel="Salvar"
                initialValue={comment.body}
                autoFocus
                onSubmit={async (body) => {
                  await onEdit(body);
                  setEditing(false);
                }}
                onCancel={() => setEditing(false)}
              />
            </div>
          ) : (
            <p className="mt-1 whitespace-pre-line text-sm leading-6 text-foreground/80">{comment.body}</p>
          )}
        </div>

        {onReply && !editing && (
          <Button variant="ghost" size="sm" onClick={onReply} className="mt-1 -ml-2 text-muted-foreground">
            <Reply />
            Responder
          </Button>
        )}

        {children}
      </div>
    </li>
  );
}

// Comentários do material: um nível de respostas, e o autor pode editar ou excluir os próprios
export default function Comments({ materialId }: { materialId: number }) {
  const { data: commentsPage, isLoading, mutate } = useComments(materialId);
  const { data: me } = useMe();
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [toDelete, setToDelete] = useState<Comment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const comments = commentsPage?.content ?? [];
  const roots = comments.filter((comment) => comment.parentId === null);
  // Respostas de um comentário excluído não aparecem, então também não entram na contagem
  const rootIds = new Set(roots.map((comment) => comment.id));
  const visibleCount = comments.filter((comment) => comment.parentId === null || rootIds.has(comment.parentId)).length;
  // Respostas em ordem de chegada, abaixo do comentário respondido
  const repliesOf = (parentId: number) =>
    comments
      .filter((comment) => comment.parentId === parentId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  // Atualiza o cache sem buscar todos os comentários de novo
  const addToList = (comment: Comment) => mutate((page) => page && { ...page, content: [comment, ...page.content] }, { revalidate: false });
  const replaceInList = (comment: Comment) =>
    mutate((page) => page && { ...page, content: page.content.map((item) => (item.id === comment.id ? comment : item)) }, { revalidate: false });

  async function confirmDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await deleteComment(toDelete.id);
      // Some o comentário e as respostas dele
      await mutate(
        (page) => page && { ...page, content: page.content.filter((item) => item.id !== toDelete.id && item.parentId !== toDelete.id) },
        { revalidate: false }
      );
      toast("Comentário excluído.");
      setToDelete(null);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Não foi possível excluir o comentário.", { type: "error" });
    } finally {
      setDeleting(false);
    }
  }

  function renderItem(comment: Comment, rootId: number | null) {
    return (
      <CommentItem
        key={comment.id}
        comment={comment}
        isOwn={me !== undefined && comment.userId === me.id}
        // Responder a uma resposta continua a conversa no mesmo comentário principal
        onReply={() => setReplyingTo(rootId ?? comment.id)}
        onEdit={async (body) => {
          replaceInList(await updateComment(comment.id, body));
        }}
        onDelete={() => setToDelete(comment)}
      >
        {rootId === null && (repliesOf(comment.id).length > 0 || replyingTo === comment.id) && (
          <ul className="mt-3 space-y-3 border-l-2 border-border pl-4">
            {repliesOf(comment.id).map((reply) => renderItem(reply, comment.id))}
            {replyingTo === comment.id && (
              <li>
                <CommentForm
                  id={`reply-${comment.id}`}
                  label={`Responder ${comment.createdBy}`}
                  placeholder={`Responder ${comment.createdBy}...`}
                  submitLabel="Responder"
                  autoFocus
                  onSubmit={async (body) => {
                    await addToList(await replyComment(comment.id, body));
                    setReplyingTo(null);
                  }}
                  onCancel={() => setReplyingTo(null)}
                />
              </li>
            )}
          </ul>
        )}
      </CommentItem>
    );
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-brand-ink">Comentários{isLoading ? "" : ` (${visibleCount})`}</h2>

      <div className="mt-4">
        <CommentForm
          id="new-comment"
          label="Escreva um comentário"
          placeholder="Escreva um comentário..."
          submitLabel="Comentar"
          onSubmit={async (body) => {
            await addToList(await createComment(materialId, body));
          }}
        />
      </div>

      {isLoading && (
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

      {!isLoading && visibleCount === 0 && (
        <p className="mt-6 text-sm text-muted-foreground">Ainda não há comentários. Tire uma dúvida ou deixe um agradecimento ao autor.</p>
      )}

      <ul className="mt-6 space-y-5">{roots.map((comment) => renderItem(comment, null))}</ul>

      <Dialog open={toDelete !== null} onOpenChange={(open) => !open && setToDelete(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir comentário?</DialogTitle>
            <DialogDescription>
              O comentário{toDelete && repliesOf(toDelete.id).length > 0 ? " e as respostas dele deixam" : " deixa"} de aparecer para
              todos. Não é possível desfazer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
