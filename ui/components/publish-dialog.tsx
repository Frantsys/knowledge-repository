"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createMaterial } from "@/lib/api/materials";
import { uploadFile } from "@/lib/api/files";
import { invalidateMaterials } from "@/lib/api/swr";
import { ACCEPTED_FILES, ACCEPTED_FILES_HINT, MAX_FILE_BYTES, SUBJECTS } from "@/lib/hooks";

// Diálogo "Publicar material" (Dialog do shadcn/ui). Fica montado na navbar:
// o rascunho continua lá se a pessoa fechar e reabrir na mesma página.
export default function PublishDialog({
  open,
  onOpenChange,
  course,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: string | undefined;
}) {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clicar fora só fecha se não houver nada digitado, para não perder texto por engano
  const dirty = Boolean(title.trim() || body.trim() || subject || file);

  function selectFile(selected: File | null) {
    if (selected && selected.size > MAX_FILE_BYTES) {
      setError("O arquivo passa de 10 MB. Escolha um arquivo menor.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selected);
  }

  async function handlePublish(event: React.FormEvent) {
    event.preventDefault();
    setPublishing(true);
    setError(null);

    try {
      const material = await createMaterial({
        title: title.trim(),
        body: body.trim(),
        subject,
        course: course ?? "",
      });

      if (file) {
        await uploadFile(material.id, file);
      }

      onOpenChange(false);
      setTitle("");
      setBody("");
      setSubject("");
      setFile(null);

      // Listas em cache (Início, Explorar, Meus materiais) passam a incluir o material novo
      invalidateMaterials();
      router.push(`/materiais/${material.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível publicar.");
    } finally {
      setPublishing(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="gap-0 p-0 sm:max-w-[560px]"
        onInteractOutside={(event) => {
          if (dirty) event.preventDefault();
        }}
      >
        <form onSubmit={handlePublish}>
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle className="text-base font-semibold">Publicar material</DialogTitle>
            <DialogDescription>Compartilhe um material com a comunidade.</DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-6 py-5">
            <div className="space-y-2">
              <Label htmlFor="material-title">Título</Label>
              <Input
                id="material-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Ex.: Resumo de Direito Penal"
                autoFocus
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material-description">Descrição</Label>
              <Textarea
                id="material-description"
                rows={3}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                placeholder="Descreva brevemente o material..."
                className="min-h-20 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="material-category">Disciplina</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger id="material-category" className="h-10 w-full">
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">
                Arquivo <span className="font-normal text-muted-foreground">(opcional)</span>
              </p>

              <label
                htmlFor="material-file"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-7 text-center transition-colors hover:border-primary/60 hover:bg-accent/50"
              >
                <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <Upload className="size-5" />
                </span>
                <span className="text-sm font-medium">{file ? file.name : "Clique para selecionar um arquivo"}</span>
                <span className="mt-1 text-xs text-muted-foreground">{ACCEPTED_FILES_HINT}</span>
                <input
                  id="material-file"
                  type="file"
                  accept={ACCEPTED_FILES}
                  onChange={(event) => {
                    selectFile(event.target.files?.[0] ?? null);
                    event.target.value = "";
                  }}
                  className="sr-only"
                />
              </label>

              {file && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive">
                  <X />
                  Remover arquivo
                </Button>
              )}
            </div>

            {error && (
              <p role="alert" className="whitespace-pre-line text-sm text-destructive">
                {error}
              </p>
            )}
          </div>

          <DialogFooter className="mx-0 mb-0 px-6 py-4">
            <Button type="button" variant="ghost" size="lg" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={publishing || !course || !title.trim() || !body.trim() || !subject}
            >
              {publishing ? <Loader2 className="animate-spin" /> : <Upload />}
              {publishing ? "Publicando..." : "Publicar material"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
