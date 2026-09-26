"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  BookOpen,
  CalendarDays,
} from "lucide-react";

import Navbar from "@/components/navbar";

type Material = {
  id: number;
  title: string;
  body: string;
  subject: string;
  course: string;
  createdBy: string;
  createdAt: string;
};

const mockMaterials: Material[] = [
  {
    id: 1,
    title: "Introdução à Programação Orientada a Objetos",
    body: "Material introdutório sobre os principais conceitos de POO, incluindo classes, objetos, atributos e métodos.",
    subject: "Programação",
    course: "Análise e Desenvolvimento de Sistemas",
    createdBy: "Maria Silva",
    createdAt: "2026-09-20",
  },
  {
    id: 2,
    title: "Banco de Dados — Modelo Relacional",
    body: "Resumo sobre tabelas, relacionamentos, chaves primárias, chaves estrangeiras e normalização.",
    subject: "Banco de Dados",
    course: "Análise e Desenvolvimento de Sistemas",
    createdBy: "João Santos",
    createdAt: "2026-09-18",
  },
  {
    id: 3,
    title: "Fundamentos de Desenvolvimento Web",
    body: "Material com conceitos fundamentais de HTML, CSS, JavaScript e funcionamento de aplicações web.",
    subject: "Desenvolvimento Web",
    course: "Sistemas para Internet",
    createdBy: "Ana Costa",
    createdAt: "2026-09-16",
  },
  {
    id: 4,
    title: "Engenharia de Software — Ciclo de Vida",
    body: "Resumo sobre processos de desenvolvimento, modelos de ciclo de vida e etapas de um projeto de software.",
    subject: "Engenharia de Software",
    course: "Análise e Desenvolvimento de Sistemas",
    createdBy: "Lucas Oliveira",
    createdAt: "2026-09-14",
  },
  {
    id: 5,
    title: "SQL para Iniciantes",
    body: "Introdução aos principais comandos SQL para consulta, inserção, atualização e exclusão de dados.",
    subject: "Banco de Dados",
    course: "Análise e Desenvolvimento de Sistemas",
    createdBy: "Carlos Souza",
    createdAt: "2026-09-12",
  },
  {
    id: 6,
    title: "Classes e Objetos em Java",
    body: "Material prático sobre criação de classes, objetos, construtores, encapsulamento e métodos em Java.",
    subject: "Programação",
    course: "Ciência da Computação",
    createdBy: "Fernanda Lima",
    createdAt: "2026-09-10",
  },
  {
    id: 7,
    title: "React — Componentes e Props",
    body: "Introdução aos componentes React, propriedades, composição e organização de interfaces.",
    subject: "Desenvolvimento Web",
    course: "Sistemas para Internet",
    createdBy: "Pedro Almeida",
    createdAt: "2026-09-08",
  },
  {
    id: 8,
    title: "Levantamento de Requisitos",
    body: "Conceitos e técnicas utilizadas para identificar, documentar e validar requisitos de software.",
    subject: "Engenharia de Software",
    course: "Análise e Desenvolvimento de Sistemas",
    createdBy: "Beatriz Martins",
    createdAt: "2026-09-05",
  },
];

const subjects = [
  "Todas",
  "Programação",
  "Banco de Dados",
  "Engenharia de Software",
  "Desenvolvimento Web",
];

function formatDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export default function ExplorarPage() {
  const [search, setSearch] = useState("");
  const [selectedSubject, setSelectedSubject] =
    useState("Todas");

  const [order, setOrder] = useState("recentes");

  /*
   * O arquivo:
   *
   *     lib/explorar.ts
   *
   *
   * import { getMaterials } from "@/lib/explorar";
   *
   * const materials = await getMaterials();
   *
   */

  const filteredMaterials = useMemo(() => {
    let result = [...mockMaterials];

    if (selectedSubject !== "Todas") {
      result = result.filter(
        (material) =>
          material.subject === selectedSubject
      );
    }

    if (search.trim()) {
      const searchTerm = search.toLowerCase();

      result = result.filter(
        (material) =>
          material.title
            .toLowerCase()
            .includes(searchTerm) ||
          material.body
            .toLowerCase()
            .includes(searchTerm) ||
          material.subject
            .toLowerCase()
            .includes(searchTerm) ||
          material.course
            .toLowerCase()
            .includes(searchTerm) ||
          material.createdBy
            .toLowerCase()
            .includes(searchTerm)
      );
    }

    if (order === "recentes") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );
    }

    if (order === "alfabetica") {
      result.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }

    return result;
  }, [search, selectedSubject, order]);

  function clearFilters() {
    setSearch("");
    setSelectedSubject("Todas");
    setOrder("recentes");
  }

  return (
    <div className="min-h-screen bg-[#f8f7fc]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Explorar materiais
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Encontre materiais compartilhados por outros
            estudantes.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">

          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center gap-2">
              <Filter
                size={18}
                className="text-purple-600"
              />

              <h2 className="font-semibold text-gray-900">
                Filtros
              </h2>
            </div>

            <div className="space-y-5">

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Disciplina
                </label>

                <select
                  id="subject"
                  value={selectedSubject}
                  onChange={(event) =>
                    setSelectedSubject(
                      event.target.value
                    )
                  }
                  className="
                    w-full rounded-lg
                    border border-gray-300
                    bg-white px-3 py-2
                    text-sm text-gray-700
                    outline-none transition
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "
                >
                  {subjects.map((subject) => (
                    <option
                      key={subject}
                      value={subject}
                    >
                      {subject}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="order"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Ordenar por
                </label>

                <select
                  id="order"
                  value={order}
                  onChange={(event) =>
                    setOrder(event.target.value)
                  }
                  className="
                    w-full rounded-lg
                    border border-gray-300
                    bg-white px-3 py-2
                    text-sm text-gray-700
                    outline-none transition
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "
                >
                  <option value="recentes">
                    Mais recentes
                  </option>

                  <option value="alfabetica">
                    Ordem alfabética
                  </option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="
                  w-full rounded-lg
                  border border-gray-300
                  px-3 py-2
                  text-sm font-medium
                  text-gray-600
                  transition
                  hover:bg-gray-50
                "
              >
                Limpar filtros
              </button>
            </div>
          </aside>

          <section>

            <div className="mb-5 flex flex-col gap-3 sm:flex-row">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="
                    absolute left-3 top-1/2
                    -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  placeholder="Pesquisar materiais..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="
                    h-11 w-full rounded-lg
                    border border-gray-300
                    bg-white pl-10 pr-4
                    text-sm text-gray-700
                    outline-none transition
                    placeholder:text-gray-400
                    focus:border-purple-500
                    focus:ring-2
                    focus:ring-purple-100
                  "
                />
              </div>

              <button
                type="button"
                className="
                  flex h-11
                  items-center justify-center
                  gap-2 rounded-lg
                  bg-purple-600 px-5
                  text-sm font-medium
                  text-white transition
                  hover:bg-purple-700
                "
              >
                <Search size={17} />
                Buscar
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {filteredMaterials.length}{" "}
                {filteredMaterials.length === 1
                  ? "material encontrado"
                  : "materiais encontrados"}
              </p>
            </div>

            {filteredMaterials.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">

                {filteredMaterials.map((material) => (
                  <article
                    key={material.id}
                    className="
                      group rounded-xl
                      border border-gray-200
                      bg-white p-5
                      shadow-sm
                      transition duration-200
                      hover:-translate-y-0.5
                      hover:shadow-md
                    "
                  >

                    <div className="mb-4 flex items-start justify-between gap-3">

                      <div className="flex min-w-0 items-center gap-2">

                        <div
                          className="
                            flex h-9 w-9 shrink-0
                            items-center justify-center
                            rounded-lg
                            bg-purple-50
                            text-purple-600
                          "
                        >
                          <BookOpen size={18} />
                        </div>

                        <div className="min-w-0">

                          <p className="
                            truncate text-xs
                            font-medium text-purple-600
                          ">
                            {material.subject}
                          </p>

                          <p className="
                            truncate text-xs
                            text-gray-400
                          ">
                            {material.course}
                          </p>

                        </div>
                      </div>
                    </div>

                    <h2 className="
                      mb-2 line-clamp-2
                      text-base font-semibold
                      text-gray-900
                    ">
                      {material.title}
                    </h2>

                    <p className="
                      mb-5 line-clamp-3
                      text-sm leading-6
                      text-gray-500
                    ">
                      {material.body}
                    </p>

                    <div className="
                      mb-4 flex items-center
                      justify-between
                      text-xs text-gray-400
                    ">
                      <span>
                        Publicado por{" "}
                        <strong className="
                          font-medium text-gray-600
                        ">
                          {material.createdBy}
                        </strong>
                      </span>
                    </div>

                    <div className="
                      flex items-center
                      justify-end
                      border-t border-gray-100
                      pt-4 text-xs text-gray-400
                    ">
                      <span className="
                        flex items-center gap-1.5
                      ">
                        <CalendarDays size={14} />

                        {formatDate(material.createdAt)}
                      </span>
                    </div>
                  </article>
                ))}

              </div>
            ) : (
              <div className="
                rounded-xl
                border border-dashed
                border-gray-300
                bg-white
                px-6 py-12
                text-center
              ">

                <BookOpen
                  size={32}
                  className="
                    mx-auto mb-3
                    text-gray-300
                  "
                />

                <h2 className="
                  font-semibold text-gray-800
                ">
                  Nenhum material encontrado
                </h2>

                <p className="
                  mt-1 text-sm
                  text-gray-500
                ">
                  Tente alterar os filtros
                  ou realizar outra pesquisa.
                </p>

              </div>
            )}

          </section>
        </div>
      </main>
    </div>
  );
}