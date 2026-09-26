"use client";

import { useState } from "react";

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

const meusMateriais = [
    {
        id: 1,
        titulo: "Resumo de Direito Penal",
        categoria: "Direito",
        paginas: "12 páginas",
        tempo: "2 dias atrás",
        imagem:
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 2,
        titulo: "Resumo de Banco de Dados",
        categoria: "Tecnologia",
        paginas: "18 páginas",
        tempo: "4 dias atrás",
        imagem:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 3,
        titulo: "Introdução à Programação",
        categoria: "Programação",
        paginas: "25 páginas",
        tempo: "1 semana atrás",
        imagem:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 4,
        titulo: "Engenharia de Software",
        categoria: "Tecnologia",
        paginas: "20 páginas",
        tempo: "1 semana atrás",
        imagem:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 5,
        titulo: "Modelagem de Banco de Dados",
        categoria: "Banco de Dados",
        paginas: "15 páginas",
        tempo: "2 semanas atrás",
        imagem:
            "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 6,
        titulo: "Lógica de Programação",
        categoria: "Programação",
        paginas: "10 páginas",
        tempo: "2 semanas atrás",
        imagem:
            "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 7,
        titulo: "Redes de Computadores",
        categoria: "Redes",
        paginas: "22 páginas",
        tempo: "3 semanas atrás",
        imagem:
            "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 8,
        titulo: "Sistemas Operacionais",
        categoria: "Computação",
        paginas: "16 páginas",
        tempo: "1 mês atrás",
        imagem:
            "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    },
    {
        id: 9,
        titulo: "Estrutura de Dados",
        categoria: "Programação",
        paginas: "30 páginas",
        tempo: "1 mês atrás",
        imagem:
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    },
];

export default function MateriaisPage() {
    const [menuAberto, setMenuAberto] = useState<number | null>(null);
    const [modalAberto, setModalAberto] = useState<number | null>(null);

    const materialSelecionado = meusMateriais.find(
        (material) => material.id === modalAberto
    );

    return (
        <>
            <main className="min-h-screen bg-[#faf9ff]">
                <Navbar />

                <div className="mx-auto w-full max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">

                    {/* =====================================================
                        CABEÇALHO
                    ====================================================== */}

                    <section className="mb-8">
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-purple-100
                                    text-purple-600
                                "
                            >
                                <Folder
                                    size={25}
                                    strokeWidth={1.8}
                                />
                            </div>

                            <div>
                                <h1
                                    className="
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-[#171052]
                                        sm:text-3xl
                                    "
                                >
                                    Meus materiais
                                </h1>

                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-[#6875a0]
                                    "
                                >
                                    Todos os materiais que você publicou na plataforma.
                                </p>
                            </div>
                        </div>
                    </section>


                    {/* =====================================================
                        CONTADOR
                    ====================================================== */}

                    <div
                        className="
                            mb-5
                            flex
                            items-center
                            justify-between
                            rounded-xl
                            border
                            border-purple-100
                            bg-white
                            px-4
                            py-3
                            shadow-[0_3px_15px_rgba(89,57,180,0.04)]
                        "
                    >
                        <div className="flex items-center gap-2">
                            <FileText
                                size={18}
                                className="text-purple-600"
                            />

                            <span className="text-sm font-medium text-[#454b70]">
                                {meusMateriais.length} materiais publicados
                            </span>
                        </div>
                    </div>


                    {/* =====================================================
                        GRID DE MATERIAIS
                    ====================================================== */}

                    <section>
                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-5
                                sm:grid-cols-2
                                lg:grid-cols-3
                                xl:grid-cols-4
                            "
                        >

                            {meusMateriais.map((material) => (

                                <article
                                    key={material.id}
                                    className="
                                        group
                                        relative
                                        cursor-pointer
                                        rounded-2xl
                                        border
                                        border-purple-100
                                        bg-white
                                        shadow-[0_3px_15px_rgba(89,57,180,0.06)]
                                        transition
                                        hover:-translate-y-1
                                        hover:border-purple-200
                                        hover:shadow-[0_8px_25px_rgba(89,57,180,0.12)]
                                    "
                                >

                                    {/* =================================================
                                        IMAGEM
                                    ================================================== */}

                                    <div className="relative h-[165px] px-3 pt-3">

                                        <div
                                            className="
                                                h-full
                                                overflow-hidden
                                                rounded-xl
                                                bg-gray-100
                                            "
                                        >
                                            <img
                                                src={material.imagem}
                                                alt={material.titulo}
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


                                        {/* =================================================
                                            BOTÃO DOS TRÊS PONTOS
                                        ================================================== */}

                                        <button
                                            onClick={(event) => {
                                                event.stopPropagation();

                                                setMenuAberto(
                                                    menuAberto === material.id
                                                        ? null
                                                        : material.id
                                                );
                                            }}
                                            className="
                                                absolute
                                                right-5
                                                top-5
                                                z-50
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-full
                                                bg-white/95
                                                text-[#18204d]
                                                shadow-sm
                                                transition
                                                hover:scale-105
                                                hover:bg-white
                                            "
                                        >
                                            <MoreVertical size={18} />
                                        </button>


                                        {/* =================================================
                                            DROPDOWN
                                        ================================================== */}

                                        {menuAberto === material.id && (
                                            <div
                                                onClick={(event) =>
                                                    event.stopPropagation()
                                                }
                                                className="
                                                    absolute
                                                    right-5
                                                    top-16
                                                    z-[999]
                                                    w-48
                                                    overflow-hidden
                                                    rounded-xl
                                                    border
                                                    border-gray-100
                                                    bg-white
                                                    p-1.5
                                                    shadow-[0_10px_30px_rgba(30,20,80,0.15)]
                                                "
                                            >
                                                <button
                                                    onClick={() => {
                                                        setModalAberto(material.id);
                                                        setMenuAberto(null);
                                                    }}
                                                    className="
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-3
                                                        rounded-lg
                                                        px-3
                                                        py-2.5
                                                        text-sm
                                                        text-[#25294d]
                                                        transition
                                                        hover:bg-purple-50
                                                        hover:text-purple-700
                                                    "
                                                >
                                                    <Eye size={17} />
                                                    Ações
                                                </button>
                                            </div>
                                        )}
                                    </div>


                                    {/* =================================================
                                        CONTEÚDO
                                    ================================================== */}

                                    <div className="px-4 pb-4 pt-3">

                                        {/* Categoria */}

                                        <div
                                            className="
                                                mb-3
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-md
                                                bg-purple-100
                                                px-2.5
                                                py-1
                                                text-xs
                                                font-semibold
                                                text-purple-700
                                            "
                                        >
                                            <Folder size={13} />

                                            {material.categoria}
                                        </div>


                                        {/* Título */}

                                        <h2
                                            className="
                                                line-clamp-2
                                                min-h-[48px]
                                                text-base
                                                font-bold
                                                text-[#171c45]
                                            "
                                        >
                                            {material.titulo}
                                        </h2>


                                        {/* Autor */}

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-[#6875a0]
                                            "
                                        >
                                            Minhas publicações
                                        </p>


                                        {/* Rodapé */}

                                        <div
                                            className="
                                                mt-5
                                                flex
                                                items-center
                                                justify-between
                                                border-t
                                                border-gray-100
                                                pt-4
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-xs
                                                    text-[#7380a5]
                                                "
                                            >
                                                <FileText size={16} />

                                                {material.paginas}
                                            </div>


                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-xs
                                                    text-[#7380a5]
                                                "
                                            >
                                                <Clock3 size={16} />

                                                {material.tempo}
                                            </div>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>
                    </section>

                </div>
            </main>


            {/* =====================================================
                MODAL DE AÇÕES
            ====================================================== */}

            {modalAberto !== null && materialSelecionado && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[9999]
                        flex
                        items-center
                        justify-center
                        bg-black/50
                        px-4
                        backdrop-blur-sm
                    "
                    onClick={() => setModalAberto(null)}
                >

                    <div
                        onClick={(event) => event.stopPropagation()}
                        className="
                            w-full
                            max-w-md
                            rounded-2xl
                            border
                            border-purple-100
                            bg-white
                            p-6
                            shadow-2xl
                        "
                    >

                        {/* Cabeçalho */}

                        <div className="flex items-start justify-between">

                            <div>

                                <div
                                    className="
                                        mb-3
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-purple-100
                                        text-purple-600
                                    "
                                >
                                    <FileText size={22} />
                                </div>

                                <h3 className="text-lg font-bold text-[#171052]">
                                    Ações do material
                                </h3>

                                <p className="mt-1 text-sm text-[#6875a0]">
                                    O que você deseja fazer com este material?
                                </p>

                            </div>


                            <button
                                onClick={() => setModalAberto(null)}
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    text-gray-400
                                    transition
                                    hover:bg-gray-100
                                    hover:text-gray-700
                                "
                            >
                                <X size={19} />
                            </button>

                        </div>


                        {/* Material selecionado */}

                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                gap-3
                                rounded-xl
                                bg-[#f7f5ff]
                                p-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    overflow-hidden
                                    rounded-lg
                                    bg-purple-100
                                "
                            >
                                <img
                                    src={materialSelecionado.imagem}
                                    alt={materialSelecionado.titulo}
                                    className="h-full w-full object-cover"
                                />
                            </div>


                            <div className="min-w-0">

                                <p className="truncate text-sm font-bold text-[#171c45]">
                                    {materialSelecionado.titulo}
                                </p>

                                <p className="mt-0.5 text-xs text-[#6875a0]">
                                    {materialSelecionado.categoria}
                                </p>

                            </div>

                        </div>


                        {/* Ações */}

                        <div className="mt-5 space-y-2">

                            {/* Visualizar */}

                            <button
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-gray-100
                                    px-4
                                    py-3
                                    text-left
                                    transition
                                    hover:border-purple-100
                                    hover:bg-purple-50
                                "
                            >
                                <Eye
                                    size={19}
                                    className="text-purple-600"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#25294d]">
                                        Visualizar material
                                    </p>

                                    <p className="text-xs text-[#7b84a5]">
                                        Abrir e visualizar o conteúdo
                                    </p>
                                </div>
                            </button>


                            {/* Editar */}

                            <button
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-gray-100
                                    px-4
                                    py-3
                                    text-left
                                    transition
                                    hover:border-purple-100
                                    hover:bg-purple-50
                                "
                            >
                                <Pencil
                                    size={19}
                                    className="text-purple-600"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#25294d]">
                                        Editar material
                                    </p>

                                    <p className="text-xs text-[#7b84a5]">
                                        Alterar informações da publicação
                                    </p>
                                </div>
                            </button>


                            {/* Baixar */}

                            <button
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-gray-100
                                    px-4
                                    py-3
                                    text-left
                                    transition
                                    hover:border-purple-100
                                    hover:bg-purple-50
                                "
                            >
                                <Download
                                    size={19}
                                    className="text-purple-600"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#25294d]">
                                        Baixar material
                                    </p>

                                    <p className="text-xs text-[#7b84a5]">
                                        Fazer download do arquivo
                                    </p>
                                </div>
                            </button>


                            <div className="my-1 border-t border-gray-100" />


                            {/* Excluir */}

                            <button
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-xl
                                    border
                                    border-red-100
                                    px-4
                                    py-3
                                    text-left
                                    transition
                                    hover:bg-red-50
                                "
                            >
                                <Trash2
                                    size={19}
                                    className="text-red-500"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-red-600">
                                        Excluir material
                                    </p>

                                    <p className="text-xs text-red-400">
                                        Remover esta publicação
                                    </p>
                                </div>
                            </button>

                        </div>


                        {/* Cancelar */}

                        <button
                            onClick={() => setModalAberto(null)}
                            className="
                                mt-5
                                w-full
                                rounded-xl
                                border
                                border-gray-200
                                py-2.5
                                text-sm
                                font-medium
                                text-gray-600
                                transition
                                hover:bg-gray-50
                            "
                        >
                            Cancelar
                        </button>

                    </div>
                </div>
            )}
        </>
    );
}