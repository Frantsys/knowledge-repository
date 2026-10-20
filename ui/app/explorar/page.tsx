"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowDownAZ,
    ArrowRight,
    BookOpen,
    CalendarDays,
    Check,
    Filter,
    Search,
    SlidersHorizontal,
    X,
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
    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`));
}

export default function ExplorarPage() {
    const router = useRouter();

    const [search, setSearch] = useState("");
    const [submittedSearch, setSubmittedSearch] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("Todas");
    const [order, setOrder] = useState("recentes");
    const [filtersOpen, setFiltersOpen] = useState(false);

    /*
- Integração futura com a API:
     *
- import { getMaterials } from "@/lib/explorar";
     *
- Substituir mockMaterials pelos dados retornados por getMaterials().
- Manter busca, filtros e ordenação funcionando sobre os dados da API.
- Considerar estados de carregamento, erro e lista vazia na integração.
     *
- Perfil do autor:
- Quando a API de usuários estiver conectada, usar o identificador do autor
- retornado pelo material para abrir o perfil público correspondente.
- Não depender do nome do autor como identificador permanente.
     */

    const filteredMaterials = useMemo(() => {
        let result = [...mockMaterials];

        if (selectedSubject !== "Todas") {
            result = result.filter(
                (material) => material.subject === selectedSubject
            );
        }

        if (submittedSearch.trim()) {
            const searchTerm = submittedSearch.trim().toLocaleLowerCase("pt-BR");

            result = result.filter((material) =>
                [
                    material.title,
                    material.body,
                    material.subject,
                    material.course,
                    material.createdBy,
                ].some((value) =>
                    value.toLocaleLowerCase("pt-BR").includes(searchTerm)
                )
            );
        }

        if (order === "recentes") {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
        } else if (order === "alfabetica") {
            result.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
        }

        return result;
    }, [submittedSearch, selectedSubject, order]);

    const activeFiltersCount =
        Number(selectedSubject !== "Todas") +
        Number(order !== "recentes");

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmittedSearch(search);
    }

    function clearFilters() {
        setSearch("");
        setSubmittedSearch("");
        setSelectedSubject("Todas");
        setOrder("recentes");
    }

    function openMaterial(id: number) {
        router.push(`/materiais/${id}`);
    }

    return (
        <div className="min-h-screen bg-[#f8f7fc]">
            <Navbar />

            <main className="mx-auto w-full max-w-[1250px] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
                <section className="relative mb-7 overflow-hidden rounded-2xl bg-gradient-to-r from-[#250080] via-purple-700 to-indigo-600 px-5 py-7 text-white shadow-sm sm:px-8 sm:py-9">
                    <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border border-white/10" />
                    <div className="pointer-events-none absolute -bottom-28 right-1/4 h-64 w-64 rounded-full bg-white/5" />

                    <div className="relative max-w-2xl">
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-purple-200">
                            Biblioteca da comunidade
                        </p>
                        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                            Explore novos conhecimentos
                        </h1>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-purple-100 sm:text-base">
                            Encontre resumos, anotações e conteúdos compartilhados
                            por estudantes para apoiar sua jornada acadêmica.
                        </p>
                    </div>

                    {/* A busca filtra os dados locais neste momento.
                        Na integração, encaminhar o termo à API se houver busca no servidor. */}
                    <form
                        onSubmit={handleSearch}
                        className="relative mt-6 flex max-w-3xl flex-col gap-2 rounded-xl bg-white p-2 shadow-lg sm:flex-row"
                        role="search"
                    >
                        <div className="flex min-w-0 flex-1 items-center gap-3 px-2">
                            <Search size={19} className="shrink-0 text-purple-500" />
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Buscar por material, disciplina ou assunto..."
                                aria-label="Buscar materiais"
                                className="h-10 min-w-0 flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                            />
                        </div>
                        <button
                            type="submit"
                            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-purple-600 px-5 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                        >
                            <Search size={16} />
                            Buscar materiais
                        </button>
                    </form>
                </section>

                <div className="mb-5 flex items-center justify-between gap-3 lg:justify-end">
                    <button
                        type="button"
                        onClick={() => setFiltersOpen(true)}
                        aria-controls="explorar-filtros"
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-700 shadow-sm transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700 lg:hidden"
                    >
                        <SlidersHorizontal size={16} />
                        Filtros
                        {activeFiltersCount > 0 && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-100 px-1.5 text-xs font-semibold text-purple-700">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    <label className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-500 shadow-sm">
                        <ArrowDownAZ size={16} className="shrink-0 text-purple-500" />
                        <span className="hidden sm:inline">Ordenar:</span>
                        <select
                            value={order}
                            onChange={(event) => setOrder(event.target.value)}
                            aria-label="Ordenar materiais"
                            className="max-w-[150px] bg-transparent font-medium text-gray-700 outline-none"
                        >
                            <option value="recentes">Mais recentes</option>
                            <option value="alfabetica">Ordem alfabética</option>
                        </select>
                    </label>
                </div>

                <div className="grid items-start gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
                    <aside
                        id="explorar-filtros"
                        className={`${filtersOpen ? "block" : "hidden"} rounded-2xl border border-gray-200 bg-white p-5 shadow-sm lg:sticky lg:top-5 lg:block`}
                    >
                        <div className="mb-5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                    <Filter size={17} />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900">
                                        Filtrar materiais
                                    </h2>
                                    <p className="text-xs text-gray-400">
                                        Refine sua busca
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFiltersOpen(false)}
                                aria-label="Fechar filtros"
                                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 lg:hidden"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label
                                    htmlFor="subject"
                                    className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                                >
                                    Disciplina
                                </label>
                                <select
                                    id="subject"
                                    value={selectedSubject}
                                    onChange={(event) => setSelectedSubject(event.target.value)}
                                    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                                >
                                    {subjects.map((subject) => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="rounded-xl bg-[#f8f7fc] p-3.5">
                                <p className="text-xs font-semibold text-gray-700">
                                    Dica de pesquisa
                                </p>
                                <p className="mt-1 text-xs leading-5 text-gray-500">
                                    Você também pode buscar pelo nome do autor ou pelo curso.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={clearFilters}
                                className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                            >
                                <X size={15} />
                                Limpar filtros
                            </button>
                        </div>
                    </aside>

                    <section aria-live="polite" aria-label="Resultados dos materiais">
                        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                            <p className="text-sm text-gray-500">
                                <span className="font-semibold text-gray-800">
                                    {filteredMaterials.length}
                                </span>{" "}
                                {filteredMaterials.length === 1
                                    ? "material encontrado"
                                    : "materiais encontrados"}
                                {submittedSearch && (
                                    <span>
                                        {" "}para{" "}
                                        <span className="font-medium text-purple-700">
                                            “{submittedSearch}”
                                        </span>
                                    </span>
                                )}
                            </p>

                            {(selectedSubject !== "Todas" || submittedSearch) && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="text-xs font-semibold text-purple-600 transition hover:text-purple-800"
                                >
                                    Limpar busca e filtros
                                </button>
                            )}
                        </div>

                        {filteredMaterials.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2">
                                {filteredMaterials.map((material) => (
                                    <Link
                                        key={material.id}
                                        href={`/materiais/${material.id}`}
                                        className="group flex min-h-[255px] flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                    >
                                        <div className="mb-4 flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 transition group-hover:bg-purple-100">
                                                    <BookOpen size={20} />
                                                </div>
                                                <div className="min-w-0">
                                                    <span className="inline-flex max-w-full items-center rounded-md bg-purple-50 px-2 py-1 text-[11px] font-semibold text-purple-700">
                                                        <span className="truncate">{material.subject}</span>
                                                    </span>
                                                    <p className="mt-1 truncate text-xs text-gray-400">
                                                        {material.course}
                                                    </p>
                                                </div>
                                            </div>
                                            <ArrowRight
                                                size={17}
                                                className="mt-1 shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-purple-600"
                                            />
                                        </div>

                                        <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-gray-900 transition group-hover:text-[#3b168c]">
                                            {material.title}
                                        </h3>
                                        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-6 text-gray-500">
                                            {material.body}
                                        </p>

                                        {/* AUTOR E DATA
                                            Futuramente, vincular o autor ao perfil público
                                            usando o ID retornado pela API. */}
                                        <div className="mt-auto flex items-end justify-between gap-3 border-t border-gray-100 pt-4">
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                                                    Compartilhado por
                                                </p>
                                                <p className="mt-1 truncate text-xs font-semibold text-gray-700">
                                                    {material.createdBy}
                                                </p>
                                            </div>
                                            <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-gray-400">
                                                <CalendarDays size={13} />
                                                {formatDate(material.createdAt)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            /* =================================================
                               ESTADO VAZIO
                               Na integração com a API, diferenciar lista vazia
                               de falha de carregamento ou ausência de conexão.
                            ================================================== */
                            <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-14 text-center shadow-sm sm:px-8">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-500">
                                    <BookOpen size={25} />
                                </div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    Nenhum material encontrado
                                </h2>
                                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-gray-500">
                                    Não encontramos materiais com esses critérios.
                                    Experimente outro termo ou remova os filtros.
                                </p>
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 text-sm font-semibold text-white transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                                >
                                    <Check size={16} />
                                    Ver todos os materiais
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}