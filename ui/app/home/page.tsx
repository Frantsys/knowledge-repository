"use client";

import Link from "next/link";

import {
    ArrowRight,
    BookOpen,
    FileText,
} from "lucide-react";

import Navbar from "@/components/navbar";

const materiaisAcessados = [
    {
        id: 1,
        title: "Resumo de Banco de Dados",
        image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66",
    },
    {
        id: 2,
        title: "Material de Programação",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    },
    {
        id: 3,
        title: "Resumo de Engenharia de Software",
        image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32",
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
    },
    {
        id: 2,
        author: "Ana da Silva",
        course: "Publicidade 2º período",
        title: "Resumo de Banco de Dados",
        description:
            "Conceitos fundamentais de banco de dados, modelos relacionais, entidades, atributos e relacionamentos...",
    },
    {
        id: 3,
        author: "Ana da Silva",
        course: "Publicidade 2º período",
        title: "Introdução à Programação",
        description:
            "Variáveis, estruturas condicionais, funções, vetores e os principais conceitos utilizados na programação...",
    },
    {
        id: 4,
        author: "Ana da Silva",
        course: "Publicidade 2º período",
        title: "Resumo de Engenharia",
        description:
            "Principais conceitos de engenharia de software, levantamento de requisitos, processos e desenvolvimento...",
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
                        ÚLTIMOS MATERIAIS ACESSADOS
                    ================================================== */}

                    <section>

                        {/* Cabeçalho */}

                        <div className="mb-6 flex items-center justify-between">

                            <h1
                                className="
                                    text-lg
                                    font-bold
                                    text-[#21005f]

                                    sm:text-xl
                                "
                            >
                                Meus últimos materiais acessados
                            </h1>


                            {/* Desktop */}

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

                                <article
                                    key={material.id}
                                    className="
                                        group
                                        cursor-pointer
                                        overflow-hidden

                                        rounded-xl
                                        bg-white

                                        shadow-sm

                                        transition

                                        hover:-translate-y-1
                                        hover:shadow-lg
                                    "
                                >

                                    {/* Imagem */}

                                    <div
                                        className="
                                            relative
                                            h-[150px]

                                            overflow-hidden

                                            bg-purple-100

                                            sm:h-[145px]
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
                                                duration-300

                                                group-hover:scale-105
                                            "
                                        />
                                    </div>


                                    {/* Parte roxa */}

                                    <div
                                        className="
                                            flex
                                            h-[82px]

                                            items-end

                                            bg-gradient-to-br
                                            from-[#7731e8]
                                            to-[#6d2ae0]

                                            px-4
                                            py-3
                                        "
                                    >

                                        <div className="flex items-center gap-2">

                                            <BookOpen
                                                size={16}
                                                className="text-white/80"
                                            />

                                            <h2
                                                className="
                                                    line-clamp-1

                                                    text-xs
                                                    font-medium
                                                    text-white
                                                "
                                            >
                                                {material.title}
                                            </h2>

                                        </div>

                                    </div>

                                </article>

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

                    <section className="mt-10 sm:mt-12">

                        {/* Cabeçalho */}

                        <div className="mb-5 flex items-center justify-between">

                            <h2
                                className="
                                    text-base
                                    font-bold
                                    text-[#21005f]

                                    sm:text-lg
                                "
                            >
                                Novos materiais postados
                            </h2>


                            {/* Desktop */}

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

                                <article
                                    key={material.id}
                                    className="
                                        group
                                        cursor-pointer

                                        overflow-hidden
                                        rounded-xl

                                        border
                                        border-purple-100

                                        bg-white

                                        shadow-[0_3px_12px_rgba(115,45,220,0.12)]

                                        transition

                                        hover:-translate-y-1

                                        hover:shadow-[0_6px_20px_rgba(115,45,220,0.18)]
                                    "
                                >

                                    {/* =================================================
                                        USUÁRIO
                                    ================================================== */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2

                                            px-3
                                            pt-3
                                        "
                                    >

                                        {/* Avatar */}

                                        <div
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                shrink-0

                                                items-center
                                                justify-center

                                                overflow-hidden
                                                rounded-full

                                                bg-purple-100
                                            "
                                        >
                                            <span
                                                className="
                                                    text-xs
                                                    font-semibold
                                                    text-purple-700
                                                "
                                            >
                                                A
                                            </span>
                                        </div>


                                        {/* Informações */}

                                        <div className="min-w-0">

                                            <p
                                                className="
                                                    truncate

                                                    text-[9px]
                                                    font-semibold
                                                    text-gray-800
                                                "
                                            >
                                                {material.author}
                                            </p>

                                            <p
                                                className="
                                                    truncate

                                                    text-[8px]
                                                    text-gray-400
                                                "
                                            >
                                                {material.course}
                                            </p>

                                        </div>

                                    </div>


                                    {/* =================================================
                                        PREVIEW DO MATERIAL
                                    ================================================== */}

                                    <div className="px-3 pb-3 pt-2">

                                        <div
                                            className="
                                                relative

                                                h-[125px]

                                                overflow-hidden

                                                rounded-md

                                                bg-[#fdfdfd]

                                                shadow-inner
                                            "
                                        >

                                            <div className="px-3 py-2">

                                                {/* Título */}

                                                <div
                                                    className="
                                                        mb-2

                                                        flex
                                                        items-center
                                                        gap-1
                                                    "
                                                >

                                                    <FileText
                                                        size={10}
                                                        className="text-purple-600"
                                                    />

                                                    <span
                                                        className="
                                                            text-[8px]
                                                            font-semibold
                                                            text-gray-700
                                                        "
                                                    >
                                                        {material.title}
                                                    </span>

                                                </div>


                                                {/* Descrição */}

                                                <p
                                                    className="
                                                        text-[6px]
                                                        leading-[1.5]
                                                        text-gray-500
                                                    "
                                                >
                                                    {material.description}
                                                </p>


                                                {/* Linhas */}

                                                <div className="mt-2 space-y-1">

                                                    <div className="h-[3px] w-full rounded bg-gray-200" />

                                                    <div className="h-[3px] w-[92%] rounded bg-gray-200" />

                                                    <div className="h-[3px] w-[96%] rounded bg-gray-200" />

                                                    <div className="h-[3px] w-[78%] rounded bg-gray-200" />

                                                    <div className="h-[3px] w-[88%] rounded bg-gray-200" />

                                                </div>

                                            </div>


                                            {/* Fade inferior */}

                                            <div
                                                className="
                                                    pointer-events-none

                                                    absolute
                                                    bottom-0
                                                    left-0
                                                    right-0

                                                    h-10

                                                    bg-gradient-to-t
                                                    from-white
                                                    to-transparent
                                                "
                                            />

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}