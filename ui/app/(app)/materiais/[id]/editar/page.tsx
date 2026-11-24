"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { mutate } from "swr";
import { AlertCircle, ArrowLeft, FileText, Loader2, Save, Upload, X } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/toast";
import { updateMaterial } from "@/lib/api/materials";
import { uploadFile } from "@/lib/api/files";
import { invalidateMaterials, keys, useFiles, useMaterial } from "@/lib/api/swr";
import { ACCEPTED_FILES, ACCEPTED_FILES_HINT, MAX_FILE_BYTES, SUBJECTS, useEscapeKey } from "@/lib/hooks";
import EditSkeleton from "./edit-skeleton";

export default function EditarMaterialPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id);

  // Vindo da página do material, os dados já estão em cache (SWR): o formulário abre sem esqueleto
  const { data: material, isLoading: loading } = useMaterial(id);
  const { data: filesPage } = useFiles(id);
  const currentFileName = filesPage?.content[0]?.name ?? null;

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Esc sai da edição sem salvar (mesmo efeito do botão Cancelar)
  useEscapeKey(!saving, () => router.push(`/materiais/${id}`));

  // Preenche o formulário uma única vez, quando o material chega (ajuste durante a renderização, sem efeito)
  const [filledFrom, setFilledFrom] = useState<number | null>(null);
  if (material && filledFrom !== material.id) {
    setFilledFrom(material.id);
    setTitle(material.title);
    setDescription(material.body);
    setCategory(material.subject);
  }

  if (loading) {
    return <EditSkeleton />;
  }

  if (!material) {
    return (
      <main className="flex min-h-[calc(100dvh-4rem)] items-center justify-center bg-background px-6">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Material não encontrado</h1>
          <p className="mt-2 text-sm text-muted-foreground">O material que você tentou editar não existe.</p>
          <Button size="lg" className="mt-5" onClick={() => router.push("/meusmateriais")}>
            Voltar para meus materiais
          </Button>
        </div>
      </main>
    );
  }

  function selectFile(selected: File | null) {
    if (selected && selected.size > MAX_FILE_BYTES) {
      setError("O arquivo passa de 10 MB. Escolha um arquivo menor.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selected);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await updateMaterial(id, {
        title: title.trim(),
        body: description.trim(),
        subject: category,
        course: material!.course,
      });

      if (file) {
        await uploadFile(id, file);
        mutate(keys.files(id));
      }

      // Página do material e listas mostram o título, a descrição e a disciplina novos
      await invalidateMaterials();
      toast("Alterações salvas.");
      router.push(`/materiais/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
      setSaving(false);
    }
  }

  return (
    <main className="min-h-[calc(100dvh-4rem)] bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={() => router.push(`/materiais/${id}`)} className="mb-5 -ml-2 text-muted-foreground">
          <ArrowLeft />
          Voltar para o material
        </Button>

        <Card className="gap-0 overflow-hidden rounded-2xl py-0 animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
          <form onSubmit={handleSubmit}>
            <CardHeader className="border-b px-6 py-4">
              <CardTitle className="text-base font-semibold">Editar material</CardTitle>
              <CardDescription>Atualize as informações do seu material.</CardDescription>
            </CardHeader>

            <CardContent className="space-y-5 px-6 py-6">
              <div className="space-y-2">
                <Label htmlFor="material-title">Título</Label>
                <Input
                  id="material-title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Ex.: Resumo de Direito Penal"
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material-description">Descrição</Label>
                <Textarea
                  id="material-description"
                  rows={3}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Descreva brevemente o material..."
                  className="min-h-20 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material-category">Disciplina</Label>
                <Select value={category} onValueChange={setCategory}>
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
                <p className="text-sm font-medium">Arquivo</p>

                <div className="flex items-center gap-3 rounded-lg border bg-muted/50 px-3 py-2.5">
                  <FileText className="size-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{file?.name ?? currentFileName ?? "Nenhum arquivo anexado"}</p>
                    {!file && currentFileName && <p className="text-xs text-muted-foreground">Arquivo atual</p>}
                  </div>
                </div>

                <label
                  htmlFor="material-file"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-7 text-center transition-colors hover:border-primary/60 hover:bg-accent/50"
                >
                  <span className="mb-2 flex size-10 items-center justify-center rounded-full bg-accent text-accent-foreground">
                    <Upload className="size-5" />
                  </span>
                  {/* O upload adiciona um arquivo novo; o atual continua anexado */}
                  <span className="text-sm font-medium">{file ? file.name : "Clique para adicionar outro arquivo"}</span>
                  <span className="mt-1 text-xs text-muted-foreground">{ACCEPTED_FILES_HINT}</span>
                  <input
                    id="material-file"
                    type="file"
                    accept={ACCEPTED_FILES}
                    className="sr-only"
                    onChange={(event) => {
                      selectFile(event.target.files?.[0] ?? null);
                      event.target.value = "";
                    }}
                  />
                </label>

                {file && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)} className="text-muted-foreground hover:text-destructive">
                    <X />
                    Remover arquivo selecionado
                  </Button>
                )}
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertDescription className="whitespace-pre-line">{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="flex-col-reverse gap-2 border-t bg-muted/50 px-6 py-4 sm:flex-row sm:justify-end">
              <Button type="button" variant="ghost" size="lg" onClick={() => router.push(`/materiais/${id}`)}>
                Cancelar
              </Button>
              <Button type="submit" size="lg" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
