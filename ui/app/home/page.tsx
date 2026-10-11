"use client";

import Link from "next/link";

import {
    ArrowRight,
    BookOpen,
    FileText,
    Search,
    Upload,
    Compass,
    FolderOpen,
    Clock3,
} from "lucide-react";

import Navbar from "@/components/navbar";

const materiaisAcessados = [
    {
        id: 1,
        title: "Resumo de Banco de Dados",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
        category: "Banco de Dados",
        accessed: "Há 2 horas",
    },
    {
        id: 2,
        title: "Material de Programação",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
        category: "Programação",
        accessed: "Ontem",
    },
    {
        id: 3,
        title: "Resumo de Engenharia de Software",
        image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32",
        category: "Engenharia de Software",
        accessed: "Há 2 dias",
    },
];

const novosMateriais = [
    {
        id: 1,
        author: "Ana da Silva",
        course: "Publicidade 2º período",
        title: "Resumos de Direito Penal",
        description:
            "CF/88, conceitos e princípios fundamentais do Direito Penal, aplicação da lei penal no tempo e no espaço...",
        type: "PDF",
        pages: "12 páginas",
        time: "Há 10 min",
    },
    {
        id: 2,
        author: "Ana da Silva",
        course: "Publicidade 2º período",
        title: "Resumo de Banco de Dados",
        description:
            "Conceitos fundamentais de banco de dados, modelos relacionais, entidades, atributos e relacionamentos...",
        type: "PDF",
        pages: "18 páginas",
        time: "Há 25 min",
    },
    {
        id: 3,
        author: "Ana da Silva",
        course: "Publicidade 2º período",
        title: "Introdução à Programação",
        description:
            "Variáveis, estruturas condicionais, funções, vetores e os principais conceitos utilizados na programação...",
        type: "PDF",
        pages: "15 páginas",
        time: "Há 40 min",
    },
    {
        id: 4,
        author: "Ana da Silva",
        course: "Publicidade 2º período",
        title: "Resumo de Engenharia",
        description:
            "Principais conceitos de engenharia de software, levantamento de requisitos, processos e desenvolvimento...",
        type: "PDF",
        pages: "21 páginas",
        time: "Há 1 hora",
    },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#f8f7fc]">

            {/* =====================================================
                NAVBAR
            ====================================================== */}

            <Navbar />


            {/* =====================================================
                CONTEÚDO
            ====================================================== */}

            <main>

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1250px]
                        px-5
                        py-8
                        sm:px-8
                        sm:py-10
                        lg:px-10
                        lg:py-12
                    "
                >

                    {/* =================================================
                        BOAS-VINDAS
                    ================================================== */}

                    <section className="mb-8">

                        <div
                            className="
                                flex
                                flex-col
                                gap-5
                                lg:flex-row
                                lg:items-end
                                lg:justify-between
                            "
                        >

                            <div>

                                <p
                                    className="
                                        mb-1
                                        text-sm
                                        font-medium
                                        text-purple-600
                                    "
                                >
                                    Bom dia, Gilberto 
                                </p>

                                <h1
                                    className="
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-[#21005f]
                                        sm:text-3xl
                                    "
                                >
                                    O que você quer estudar hoje?
                                </h1>

                                <p
                                    className="
                                        mt-2
                                        max-w-xl
                                        text-sm
                                        leading-relaxed
                                        text-gray-500
                                    "
                                >
                                    Encontre materiais para continuar seus
                                    estudos ou compartilhe algo com a comunidade.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            BUSCA
                        ================================================== */}

                        <div className="mt-6">

                            <div
                                className="
                                    flex
                                    h-12
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    px-4
                                    shadow-sm
                                    transition
                                    focus-within:border-purple-400
                                    focus-within:ring-4
                                    focus-within:ring-purple-500/10
                                "
                            >

                                <Search
                                    size={19}
                                    className="shrink-0 text-gray-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Buscar materiais, disciplinas ou assuntos..."
                                    className="
                                        h-full
                                        min-w-0
                                        flex-1
                                        bg-transparent
                                        text-sm
                                        text-gray-800
                                        outline-none
                                        placeholder:text-gray-400
                                    "
                                />

                                <Link
                                    href="/explorar"
                                    className="
                                        hidden
                                        h-8
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        bg-purple-600
                                        px-3
                                        text-xs
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-purple-700
                                        sm:flex
                                    "
                                >
                                    Buscar
                                    <ArrowRight size={14} />
                                </Link>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        ACESSO RÁPIDO
                    ================================================== */}

                    <section className="mb-10">

                        <div className="mb-4">

                            <h2
                                className="
                                    text-base
                                    font-bold
                                    text-[#21005f]
                                    sm:text-lg
                                "
                            >
                                Acesso rápido
                            </h2>

                        </div>


                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-3
                                sm:grid-cols-2
                                lg:grid-cols-2
                            "
                        >

                            {/* Explorar */}

                            <Link
                                href="/explorar"
                                className="
                                    group
                                    flex
                                    items-center
                                    gap-4
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    p-4
                                    shadow-sm
                                    transition
                                    hover:-translate-y-0.5
                                    hover:border-purple-200
                                    hover:shadow-md
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-purple-50
                                        text-purple-600
                                        transition
                                        group-hover:bg-purple-100
                                    "
                                >
                                    <Compass size={20} />
                                </div>

                                <div className="min-w-0">

                                    <p className="text-sm font-semibold text-gray-800">
                                        Explorar materiais
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Encontre novos conteúdos
                                    </p>

                                </div>

                                <ArrowRight
                                    size={16}
                                    className="
                                        ml-auto
                                        shrink-0
                                        text-gray-300
                                        transition
                                        group-hover:translate-x-0.5
                                        group-hover:text-purple-600
                                    "
                                />

                            </Link>


                            {/* Meus materiais */}

                            <Link
                                href="/meusmateriais"
                                className="
                                    group
                                    flex
                                    items-center
                                    gap-4
                                    rounded-xl
                                    border
                                    border-gray-200
                                    bg-white
                                    p-4
                                    shadow-sm
                                    transition
                                    hover:-translate-y-0.5
                                    hover:border-purple-200
                                    hover:shadow-md
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-purple-50
                                        text-purple-600
                                        transition
                                        group-hover:bg-purple-100
                                    "
                                >
                                    <FolderOpen size={20} />
                                </div>

                                <div className="min-w-0">

                                    <p className="text-sm font-semibold text-gray-800">
                                        Meus materiais
                                    </p>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        Acesse seus conteúdos salvos
                                    </p>

                                </div>

                                <ArrowRight
                                    size={16}
                                    className="
                                        ml-auto
                                        shrink-0
                                        text-gray-300
                                        transition
                                        group-hover:translate-x-0.5
                                        group-hover:text-purple-600
                                    "
                                />

                            </Link>

                        </div>

                    </section>


                    {/* =================================================
                        ÚLTIMOS MATERIAIS ACESSADOS
                    ================================================== */}

                    <section>

                        {/* Cabeçalho */}

                        <div className="mb-5 flex items-center justify-between">

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-[#21005f]
                                        sm:text-xl
                                    "
                                >
                                    Continue estudando
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Seus materiais acessados recentemente
                                </p>

                            </div>


                            <Link
                                href="/meusmateriais"
                                className="
                                    hidden
                                    items-center
                                    gap-1
                                    text-xs
                                    font-medium
                                    text-purple-600
                                    transition
                                    hover:text-purple-800
                                    sm:flex
                                "
                            >
                                Ver todos
                                <ArrowRight size={14} />
                            </Link>

                        </div>


                        {/* Cards */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                sm:grid-cols-2
                                lg:grid-cols-3
                            "
                        >

                            {materiaisAcessados.map((material) => (

                                <Link
                                    key={material.id}
                                    href={`/materiais/${material.id}`}
                                    className="
                                        group
                                        block
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-white
                                        shadow-sm
                                        transition
                                        hover:-translate-y-1
                                        hover:border-purple-200
                                        hover:shadow-lg
                                    "
                                >

                                    {/* Imagem */}

                                    <div
                                        className="
                                            relative
                                            h-[160px]
                                            overflow-hidden
                                            bg-purple-100
                                        "
                                    >

                                        <img
                                            src={material.image}
                                            alt={material.title}
                                            className="
                                                h-full
                                                w-full
                                                object-cover
                                                transition
                                                duration-500
                                                group-hover:scale-105
                                            "
                                        />

                                        {/* Categoria */}

                                        <div
                                            className="
                                                absolute
                                                left-3
                                                top-3
                                                rounded-md
                                                bg-white/90
                                                px-2.5
                                                py-1
                                                text-[10px]
                                                font-medium
                                                text-purple-700
                                                shadow-sm
                                                backdrop-blur-sm
                                            "
                                        >
                                            {material.category}
                                        </div>

                                    </div>


                                    {/* Informações */}

                                    <div className="p-4">

                                        <div className="flex items-start gap-3">

                                            <div
                                                className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-lg
                                                    bg-purple-50
                                                    text-purple-600
                                                "
                                            >
                                                <BookOpen size={17} />
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <h3
                                                    className="
                                                        line-clamp-2
                                                        text-sm
                                                        font-semibold
                                                        leading-snug
                                                        text-gray-800
                                                    "
                                                >
                                                    {material.title}
                                                </h3>

                                                <div
                                                    className="
                                                        mt-2
                                                        flex
                                                        items-center
                                                        gap-1.5
                                                        text-[11px]
                                                        text-gray-400
                                                    "
                                                >
                                                    <Clock3 size={12} />

                                                    <span>
                                                        Acessado {material.accessed}
                                                    </span>
                                                </div>

                                            </div>

                                            <ArrowRight
                                                size={16}
                                                className="
                                                    mt-1
                                                    shrink-0
                                                    text-gray-300
                                                    transition
                                                    group-hover:translate-x-0.5
                                                    group-hover:text-purple-600
                                                "
                                            />

                                        </div>

                                    </div>

                                </Link>

                            ))}

                        </div>


                        {/* Mobile */}

                        <Link
                            href="/meusmateriais"
                            className="
                                mt-4
                                flex
                                items-center
                                gap-1
                                text-xs
                                font-medium
                                text-purple-600
                                sm:hidden
                            "
                        >
                            Ver todos
                            <ArrowRight size={14} />
                        </Link>

                    </section>


                    {/* =================================================
                        NOVOS MATERIAIS
                    ================================================== */}

                    <section className="mt-12 sm:mt-14">

                        {/* Cabeçalho */}

                        <div className="mb-5 flex items-center justify-between">

                            <div>

                                <h2
                                    className="
                                        text-lg
                                        font-bold
                                        text-[#21005f]
                                        sm:text-xl
                                    "
                                >
                                    Novos materiais
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Conteúdos publicados recentemente pela comunidade
                                </p>

                            </div>


                            <Link
                                href="/explorar"
                                className="
                                    hidden
                                    items-center
                                    gap-1
                                    text-xs
                                    font-medium
                                    text-purple-600
                                    transition
                                    hover:text-purple-800
                                    sm:flex
                                "
                            >
                                Explorar
                                <ArrowRight size={14} />
                            </Link>

                        </div>


                        {/* Cards */}

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            {novosMateriais.map((material) => (

                                <Link
                                    key={material.id}
                                    href={`/materiais/${material.id}`}
                                    className="
                                        group
                                        flex
                                        min-h-[280px]
                                        flex-col
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-gray-200
                                        bg-white
                                        shadow-sm
                                        transition
                                        hover:-translate-y-1
                                        hover:border-purple-200
                                        hover:shadow-lg
                                    "
                                >

                                    {/* Usuário */}

                                    <div className="flex items-center gap-2.5 px-4 pt-4">

                                        <div
                                            className="
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-purple-100
                                                text-xs
                                                font-semibold
                                                text-purple-700
                                            "
                                        >
                                            A
                                        </div>


                                        <div className="min-w-0">

                                            <p
                                                className="
                                                    truncate
                                                    text-xs
                                                    font-semibold
                                                    text-gray-800
                                                "
                                            >
                                                {material.author}
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    truncate
                                                    text-[10px]
                                                    text-gray-400
                                                "
                                            >
                                                {material.course}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Conteúdo */}

                                    <div className="flex flex-1 flex-col px-4 pb-4 pt-4">

                                        {/* Tipo */}

                                        <div className="mb-3 flex items-center gap-2">

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-1
                                                    rounded-md
                                                    bg-purple-50
                                                    px-2
                                                    py-1
                                                    text-[10px]
                                                    font-medium
                                                    text-purple-700
                                                "
                                            >
                                                <FileText size={11} />
                                                {material.type}
                                            </span>

                                            <span className="text-[10px] text-gray-400">
                                                {material.pages}
                                            </span>

                                        </div>


                                        {/* Título */}

                                        <h3
                                            className="
                                                line-clamp-2
                                                text-sm
                                                font-semibold
                                                leading-snug
                                                text-gray-800
                                            "
                                        >
                                            {material.title}
                                        </h3>


                                        {/* Descrição */}

                                        <p
                                            className="
                                                mt-2
                                                line-clamp-3
                                                text-xs
                                                leading-relaxed
                                                text-gray-500
                                            "
                                        >
                                            {material.description}
                                        </p>


                                        {/* Preview */}

                                        <div
                                            className="
                                                mt-4
                                                flex-1
                                                overflow-hidden
                                                rounded-lg
                                                border
                                                border-gray-100
                                                bg-gray-50
                                                p-3
                                            "
                                        >

                                            <div className="space-y-2">

                                                <div className="h-1.5 w-[88%] rounded bg-gray-200" />

                                                <div className="h-1.5 w-full rounded bg-gray-200" />

                                                <div className="h-1.5 w-[94%] rounded bg-gray-200" />

                                                <div className="h-1.5 w-[78%] rounded bg-gray-200" />

                                                <div className="h-1.5 w-[91%] rounded bg-gray-200" />

                                                <div className="h-1.5 w-[70%] rounded bg-gray-200" />

                                            </div>

                                        </div>


                                        {/* Rodapé */}

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                items-center
                                                justify-between
                                                border-t
                                                border-gray-100
                                                pt-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1.5
                                                    text-[10px]
                                                    text-gray-400
                                                "
                                            >
                                                <Clock3 size={12} />
                                                {material.time}
                                            </div>

                                            <span
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1
                                                    text-[10px]
                                                    font-medium
                                                    text-purple-600
                                                    transition
                                                    group-hover:text-purple-800
                                                "
                                            >
                                                Ver material
                                                <ArrowRight size={12} />
                                            </span>

                                        </div>

                                    </div>

                                </Link>

                            ))}

                        </div>


                        {/* Mobile */}

                        <Link
                            href="/explorar"
                            className="
                                mt-4
                                flex
                                items-center
                                gap-1
                                text-xs
                                font-medium
                                text-purple-600
                                sm:hidden
                            "
                        >
                            Explorar todos
                            <ArrowRight size={14} />
                        </Link>

                    </section>


                    {/* =================================================
                        ESPAÇAMENTO FINAL
                    ================================================== */}

                    <div className="h-10 sm:h-14" />

                </div>

            </main>

        </div>
    );
}