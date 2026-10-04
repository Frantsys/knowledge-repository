"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
} from "lucide-react";

const materiais = [
  {
    id: "1",
    title: "Resumo de Direito Penal",
    category: "direito",
    categoryLabel: "Direito",
    description:
      "Resumo dos principais conceitos de Direito Penal para revisão acadêmica.",
    image: "/images/direito.jpg",
    file: "resumo-direito-penal.pdf",
  },
  {
    id: "2",
    title: "Resumo de Banco de Dados",
    category: "tecnologia",
    categoryLabel: "Tecnologia",
    description:
      "Material com os principais conceitos de banco de dados, SQL e modelagem.",
    image: "/images/banco.jpg",
    file: "resumo-banco-de-dados.pdf",
  },
  {
    id: "3",
    title: "Introdução à Programação",
    category: "tecnologia",
    categoryLabel: "Tecnologia",
    description:
      "Material introdutório sobre lógica de programação e conceitos fundamentais.",
    image: "/images/programacao.jpg",
    file: "introducao-programacao.pdf",
  },
  {
    id: "4",
    title: "Engenharia de Software",
    category: "engenharia",
    categoryLabel: "Engenharia",
    description:
      "Resumo sobre processos, metodologias e conceitos de Engenharia de Software.",
    image: "/images/engenharia.jpg",
    file: "engenharia-software.pdf",
  },
];

export default function EditarMaterialPage() {
  const router = useRouter();
  const params = useParams();

  const id = String(params.id);

  const material = materiais.find(
    (material) => material.id === id
  );

  const [title, setTitle] = useState(material?.title ?? "");
  const [description, setDescription] = useState(
    material?.description ?? ""
  );
  const [category, setCategory] = useState(
    material?.category ?? ""
  );
  const [file, setFile] = useState<File | null>(null);

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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Futuramente:
    // PUT/PATCH para atualizar o material na API.

    console.log({
      id,
      title,
      description,
      category,
      file,
    });

    router.push(`/meusmateriais/${id}`);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ===========================================
            VOLTAR
        ============================================ */}

        <button
          type="button"
          onClick={() => router.push(`/meusmateriais/${id}`)}
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
                router.push(`/meusmateriais/${id}`)
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

                <option value="direito">
                  Direito
                </option>

                <option value="tecnologia">
                  Tecnologia
                </option>

                <option value="administracao">
                  Administração
                </option>

                <option value="engenharia">
                  Engenharia
                </option>

                <option value="outros">
                  Outros
                </option>
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
                    {file?.name ?? material.file}
                  </p>

                  {!file && (
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
                router.push(`/meusmateriais/${id}`)
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

            <motion.button
              type="submit"
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

              Salvar alterações
            </motion.button>
          </div>
        </motion.form>
      </div>
    </main>
  );
}