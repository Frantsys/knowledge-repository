"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
} from "lucide-react";
import { getMaterial, updateMaterial, type Material } from "@/lib/api/materials";
import { listFiles, uploadFile } from "@/lib/api/files";

const CATEGORIES = ["Direito", "Tecnologia", "Administração", "Engenharia", "Outros"];

export default function EditarMaterialPage() {
  const router = useRouter();
  const params = useParams();

  const id = String(params.id);

  const [material, setMaterial] = useState<Material | null>(null);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    Promise.all([
      getMaterial(id).then((data) => {
        setMaterial(data);
        setTitle(data.title);
        setDescription(data.body);
        setCategory(data.subject);
      }),
      listFiles(id).then((page) => setCurrentFileName(page.content[0]?.name ?? null)),
    ])
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <p role="status" className="py-24 text-center text-sm text-gray-500">
          Carregando material...
        </p>
      </main>
    );
  }

  if (!material) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Material não encontrado
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              O material que você tentou editar não existe.
            </p>

            <button
              onClick={() => router.push("/meusmateriais")}
              className="
                mt-5
                rounded-lg
                bg-purple-600
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-purple-700
              "
            >
              Voltar para meus materiais
            </button>
          </div>
        </div>
      </main>
    );
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
      }

      router.push(`/materiais/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível salvar.");
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ===========================================
            VOLTAR
        ============================================ */}

        <button
          type="button"
          onClick={() => router.push(`/materiais/${id}`)}
          className="
            mb-5
            flex
            items-center
            gap-2
            text-sm
            font-medium
            text-gray-500
            transition
            hover:text-gray-800
          "
        >
          <ArrowLeft size={17} />

          Voltar para o material
        </button>

        {/* ===========================================
            CARD
        ============================================ */}

        <motion.form
          onSubmit={handleSubmit}
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.2,
          }}
          className="
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-sm
          "
        >

          {/* ===========================================
              CABEÇALHO
          ============================================ */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-gray-100
              px-5
              py-4
              sm:px-6
            "
          >
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Editar material
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                Atualize as informações do seu material.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(`/materiais/${id}`)
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-md
                text-gray-500
                transition
                hover:bg-gray-100
                hover:text-gray-700
              "
              aria-label="Fechar"
            >
              <X size={18} />
            </button>
          </div>

          {/* ===========================================
              CONTEÚDO
          ============================================ */}

          <div className="space-y-5 p-5 sm:p-6">

            {/* Título */}

            <div>
              <label
                htmlFor="material-title"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-700
                "
              >
                Título
              </label>

              <input
                id="material-title"
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Ex.: Resumo de Direito Penal"
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-3
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-500/10
                "
              />
            </div>

            {/* Descrição */}

            <div>
              <label
                htmlFor="material-description"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-700
                "
              >
                Descrição
              </label>

              <textarea
                id="material-description"
                rows={3}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Descreva brevemente o material..."
                className="
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-gray-900
                  outline-none
                  transition
                  placeholder:text-gray-400
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-500/10
                "
              />
            </div>

            {/* Categoria */}

            <div>
              <label
                htmlFor="material-category"
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-700
                "
              >
                Categoria
              </label>

              <select
                id="material-category"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-3
                  text-sm
                  text-gray-700
                  outline-none
                  transition
                  focus:border-purple-500
                  focus:ring-2
                  focus:ring-purple-500/10
                "
              >
                <option value="" disabled>
                  Selecione uma categoria
                </option>

                <option value="Direito">
                  Direito
                </option>

                <option value="Tecnologia">
                  Tecnologia
                </option>

                <option value="Administração">
                  Administração
                </option>

                <option value="Engenharia">
                  Engenharia
                </option>

                <option value="Outros">
                  Outros
                </option>

                {category && !CATEGORIES.includes(category) && (
                  <option value={category}>{category}</option>
                )}
              </select>
            </div>

            {/* Arquivo atual */}

            <div>
              <label
                className="
                  mb-1.5
                  block
                  text-xs
                  font-medium
                  text-gray-700
                "
              >
                Arquivo
              </label>

              <div
                className="
                  mb-3
                  flex
                  items-center
                  justify-between
                  rounded-lg
                  border
                  border-gray-200
                  bg-gray-50
                  px-3
                  py-2.5
                "
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-700">
                    {file?.name ?? currentFileName ?? "Nenhum arquivo anexado"}
                  </p>

                  {!file && currentFileName && (
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      Arquivo atual
                    </p>
                  )}
                </div>
              </div>

              <label
                htmlFor="material-file"
                className="
                  flex
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-xl
                  border-2
                  border-dashed
                  border-gray-300
                  px-5
                  py-7
                  text-center
                  transition
                  hover:border-purple-400
                  hover:bg-purple-50/50
                "
              >
                <div
                  className="
                    mb-2
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-purple-100
                    text-purple-600
                  "
                >
                  <Upload size={19} />
                </div>

                <p className="text-xs font-medium text-gray-700">
                  Clique para substituir o arquivo
                </p>

                <p className="mt-1 text-[11px] text-gray-400">
                  PDF, DOC, DOCX ou PPTX
                </p>

                <input
                  id="material-file"
                  type="file"
                  accept=".pdf,.doc,.docx,.pptx"
                  className="hidden"
                  onChange={(event) => {
                    const selectedFile =
                      event.target.files?.[0] ?? null;

                    setFile(selectedFile);
                  }}
                />
              </label>
            </div>
          </div>

          {/* ===========================================
              RODAPÉ
          ============================================ */}

          <div
            className="
              flex
              flex-col-reverse
              gap-2
              border-t
              border-gray-100
              bg-gray-50/50
              px-5
              py-4
              sm:flex-row
              sm:justify-end
              sm:px-6
            "
          >
            <button
              type="button"
              onClick={() =>
                router.push(`/materiais/${id}`)
              }
              className="
                h-10
                rounded-lg
                px-4
                text-xs
                font-medium
                text-gray-600
                transition
                hover:bg-gray-100
              "
            >
              Cancelar
            </button>

            {error && (
              <p role="alert" className="whitespace-pre-line text-xs text-red-600 sm:mr-auto">
                {error}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={saving}
              whileTap={{
                scale: 0.97,
              }}
              className="
                flex
                h-10
                items-center
                justify-center
                gap-2
                rounded-lg
                bg-purple-600
                px-5
                text-xs
                font-medium
                text-white
                transition
                hover:bg-purple-700
              "
            >
              <Save size={15} />

              {saving ? "Salvando..." : "Salvar alterações"}
            </motion.button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}