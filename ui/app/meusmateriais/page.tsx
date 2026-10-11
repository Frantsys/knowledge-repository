"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock3,
  FileText,
  Folder,
  MoreVertical,
  Eye,
  Pencil,
  Download,
  Trash2,
  X,
} from "lucide-react";

import Navbar from "@/components/navbar";

type Material = {
  id: number;
  titulo: string;
  categoria: string;
  paginas: number;
  tempo: string;
  imagem: string;
};

const materiaisIniciais: Material[] = [
  {
    id: 1,
    titulo: "Resumo de Direito Penal",
    categoria: "Direito",
    paginas: 12,
    tempo: "2 dias atrás",
    imagem:
      "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    titulo: "Resumo de Banco de Dados",
    categoria: "Tecnologia",
    paginas: 18,
    tempo: "4 dias atrás",
    imagem:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    titulo: "Introdução à Programação",
    categoria: "Programação",
    paginas: 25,
    tempo: "1 semana atrás",
    imagem:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    titulo: "Engenharia de Software",
    categoria: "Tecnologia",
    paginas: 20,
    tempo: "1 semana atrás",
    imagem:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    titulo: "Modelagem de Banco de Dados",
    categoria: "Banco de Dados",
    paginas: 15,
    tempo: "2 semanas atrás",
    imagem:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    titulo: "Lógica de Programação",
    categoria: "Programação",
    paginas: 10,
    tempo: "2 semanas atrás",
    imagem:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    titulo: "Redes de Computadores",
    categoria: "Redes",
    paginas: 22,
    tempo: "3 semanas atrás",
    imagem:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    titulo: "Sistemas Operacionais",
    categoria: "Computação",
    paginas: 16,
    tempo: "1 mês atrás",
    imagem:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 9,
    titulo: "Estrutura de Dados",
    categoria: "Programação",
    paginas: 30,
    tempo: "1 mês atrás",
    imagem:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=900&q=80",
  },
];

export default function MeusMateriaisPage() {
  const router = useRouter();

  const [materiais, setMateriais] = useState<Material[]>(materiaisIniciais);
  const [menuAberto, setMenuAberto] = useState<number | null>(null);
  const [modalAberto, setModalAberto] = useState<number | null>(null);

  const materialSelecionado = materiais.find(
    (material) => material.id === modalAberto
  );

  function abrirMaterial(id: number) {
    router.push(`/materiais/${id}`);
  }

  function abrirModalAcoes(
    event: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) {
    event.stopPropagation();

    setMenuAberto(null);
    document.body.style.overflow = "hidden"; // Impede o scroll do body quando o modal estiver aberto
    setModalAberto(id);
  }

  function fecharModal() {
    setModalAberto(null);
    document.body.style.overflow = ""; // Restaura o scroll do body quando o modal estiver fechado
  }

  function editarMaterial() {
    if (!materialSelecionado) return;

    setModalAberto(null);

    router.push(`/materiais/${materialSelecionado.id}/editar`);
  }

  function baixarMaterial() {
    if (!materialSelecionado) return;

    alert(
      `Showcase: download de "${materialSelecionado.titulo}" seria iniciado aqui.`
    );
  }

  function excluirMaterial() {
    if (!materialSelecionado) return;

    const confirmar = window.confirm(
      `Deseja realmente excluir "${materialSelecionado.titulo}"?`
    );

    if (!confirmar) return;

    setMateriais((atual) =>
      atual.filter((material) => material.id !== materialSelecionado.id)
    );

    setModalAberto(null);
  }

  return (
    <div className="min-h-screen bg-[#faf9ff]">
      <Navbar />

      <main className="mx-auto w-full max-w-[1500px] px-5 pb-16 pt-10 sm:px-8 lg:px-10">
        {/* Cabeçalho */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100">
                <Folder className="h-6 w-6 text-purple-600" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#171052] sm:text-4xl">
                Meus materiais
              </h1>
            </div>

            <p className="text-sm text-[#6875a0] sm:text-base">
              Todos os materiais que você publicou na plataforma.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 shadow-sm ring-1 ring-black/5 sm:self-auto">
            <FileText className="h-4 w-4 text-purple-600" />

            <span className="text-sm font-semibold text-[#171052]">
              {materiais.length}{" "}
              {materiais.length === 1 ? "material publicado" : "materiais publicados"}
            </span>
          </div>
        </div>

        {/* Estado vazio */}
        {materiais.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-white px-6 text-center shadow-sm">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100">
              <Folder className="h-8 w-8 text-purple-600" />
            </div>

            <h2 className="text-xl font-bold text-[#171052]">
              Nenhum material encontrado
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-[#6875a0]">
              Você ainda não possui materiais publicados. Quando publicar um
              material, ele aparecerá aqui.
            </p>
          </div>
        ) : (
          /* Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {materiais.map((material) => (
              <div
                key={material.id}
                onClick={() => abrirMaterial(material.id)}
                className="group relative cursor-pointer overflow-visible rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Imagem */}
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={material.imagem}
                    alt={material.titulo}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                  {/* Categoria */}
                  <div className="absolute left-4 top-4">
                    <span className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-purple-700 shadow-sm backdrop-blur">
                      {material.categoria}
                    </span>
                  </div>

                  {/* Menu */}
                  <div className="absolute right-3 top-3">
                    <button
                      type="button"
                      onClick={(event) =>
                            abrirModalAcoes(event, material.id)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-[#171052] shadow-md backdrop-blur transition hover:bg-white"
                      aria-label={`Ações de ${material.titulo}`}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>              
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="p-5">
                  <h2 className="line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-[#171052]">
                    {material.titulo}
                  </h2>

                  <div className="mt-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100">
                      <FileText className="h-3.5 w-3.5 text-purple-600" />
                    </div>

                    <span className="text-xs font-medium text-[#6875a0]">
                      Minhas publicações
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-[#6875a0]">
                      <FileText className="h-4 w-4" />
                      <span>
                        {material.paginas}{" "}
                        {material.paginas === 1 ? "página" : "páginas"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-[#6875a0]">
                      <Clock3 className="h-4 w-4" />
                      <span>{material.tempo}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de ações */}
      {materialSelecionado && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]"
          onClick={fecharModal}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
              <div>
                <h2 className="text-lg font-bold text-[#171052]">
                  Ações do material
                </h2>

                <p className="mt-1 line-clamp-1 text-sm text-[#6875a0]">
                  {materialSelecionado.titulo}
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModal}
                className="flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Ações */}
            <div className="space-y-2 p-4">
              <button
                type="button"
                onClick={() => abrirMaterial(materialSelecionado.id)}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-purple-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100">
                  <Eye className="h-5 w-5 text-purple-600" />
                </div>

                <div>
                  <p className="font-semibold text-[#171052]">
                    Visualizar material
                  </p>

                  <p className="text-xs text-[#6875a0]">
                    Abrir o material completo
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={editarMaterial}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-purple-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
                  <Pencil className="h-5 w-5 text-blue-600" />
                </div>

                <div>
                  <p className="font-semibold text-[#171052]">
                    Editar material
                  </p>

                  <p className="text-xs text-[#6875a0]">
                    Alterar informações da publicação
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={baixarMaterial}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-purple-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
                  <Download className="h-5 w-5 text-green-600" />
                </div>

                <div>
                  <p className="font-semibold text-[#171052]">
                    Baixar material
                  </p>

                  <p className="text-xs text-[#6875a0]">
                    Simular download do arquivo
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={excluirMaterial}
                className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left transition hover:bg-red-50"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>

                <div>
                  <p className="font-semibold text-red-600">
                    Excluir material
                  </p>

                  <p className="text-xs text-[#6875a0]">
                    Remover esta publicação
                  </p>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
              <button
                type="button"
                onClick={fecharModal}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-[#171052] transition hover:bg-gray-100"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}