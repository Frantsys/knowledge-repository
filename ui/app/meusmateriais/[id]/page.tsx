"use client";

import { useRouter, useParams } from "next/navigation";

import {
    ArrowLeft,
    BookOpen,
    Clock3,
    Download,
    FileText,
    Folder,
    Pencil,
} from "lucide-react";

import Navbar from "@/components/navbar";

const materiais = [
    {
        id: 1,
        titulo: "Resumo de Direito Penal",
        categoria: "Direito",
        paginas: "12 páginas",
        tempo: "2 dias atrás",
        autor: "Gilberto",
        imagem:
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
        descricao:
            "Resumo dos principais conceitos e fundamentos do Direito Penal.",
        conteudo: [
            {
                titulo: "1. Introdução ao Direito Penal",
                paragrafos: [
                    "O Direito Penal é o ramo do Direito responsável por definir quais condutas são consideradas crimes e quais sanções podem ser aplicadas a quem pratica essas condutas.",
                    "Seu principal objetivo é proteger os bens jurídicos considerados fundamentais para a sociedade, estabelecendo limites para o comportamento dos indivíduos."
                ],
            },
            {
                titulo: "2. Princípios do Direito Penal",
                paragrafos: [
                    "Os princípios do Direito Penal estabelecem regras fundamentais que devem ser observadas na criação, interpretação e aplicação das normas penais.",
                    "Entre os principais princípios estão o princípio da legalidade, da anterioridade, da humanidade das penas e da individualização da pena."
                ],
            },
            {
                titulo: "3. Princípio da Legalidade",
                paragrafos: [
                    "O princípio da legalidade estabelece que não existe crime sem uma lei anterior que o defina, assim como não existe pena sem prévia previsão legal.",
                    "Esse princípio busca impedir que uma pessoa seja punida por uma conduta que não era considerada crime no momento em que foi praticada."
                ],
            },
            {
                titulo: "4. Aplicação da Lei Penal",
                paragrafos: [
                    "A aplicação da lei penal envolve a análise de quando e onde determinada norma pode ser aplicada.",
                    "Como regra geral, considera-se o momento da prática da conduta para determinar a aplicação da lei penal."
                ],
            },
            {
                titulo: "5. Conclusão",
                paragrafos: [
                    "O Direito Penal possui papel fundamental na organização da sociedade, estabelecendo limites para determinadas condutas e protegendo bens jurídicos relevantes.",
                    "O conhecimento de seus princípios é essencial para compreender como as normas penais são criadas e aplicadas."
                ],
            },
        ],
    },

    {
        id: 2,
        titulo: "Resumo de Banco de Dados",
        categoria: "Tecnologia",
        paginas: "18 páginas",
        tempo: "4 dias atrás",
        autor: "Gilberto",
        imagem:
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
        descricao:
            "Resumo sobre conceitos fundamentais de banco de dados e modelo relacional.",
        conteudo: [
            {
                titulo: "1. Introdução a Banco de Dados",
                paragrafos: [
                    "Um banco de dados é uma coleção organizada de informações que pode ser armazenada, consultada e modificada por sistemas computacionais.",
                    "Os bancos de dados são utilizados em praticamente todos os sistemas modernos que precisam armazenar informações."
                ],
            },
            {
                titulo: "2. Modelo Relacional",
                paragrafos: [
                    "O modelo relacional organiza os dados em tabelas compostas por linhas e colunas.",
                    "Cada tabela representa uma entidade ou conjunto de informações relacionadas."
                ],
            },
            {
                titulo: "3. Tabelas e Registros",
                paragrafos: [
                    "As tabelas armazenam os dados de uma determinada entidade.",
                    "Cada linha representa um registro e cada coluna representa um atributo desse registro."
                ],
            },
            {
                titulo: "4. Chaves",
                paragrafos: [
                    "As chaves são utilizadas para identificar registros e estabelecer relacionamentos entre tabelas.",
                    "A chave primária identifica unicamente cada registro de uma tabela."
                ],
            },
        ],
    },

    {
        id: 3,
        titulo: "Introdução à Programação",
        categoria: "Programação",
        paginas: "25 páginas",
        tempo: "1 semana atrás",
        autor: "Gilberto",
        imagem:
            "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
        descricao:
            "Material introdutório sobre lógica e conceitos fundamentais de programação.",
        conteudo: [
            {
                titulo: "1. O que é programação?",
                paragrafos: [
                    "Programação é o processo de criação de instruções que podem ser executadas por um computador.",
                    "Essas instruções são escritas utilizando linguagens de programação."
                ],
            },
            {
                titulo: "2. Variáveis",
                paragrafos: [
                    "Variáveis são utilizadas para armazenar valores que podem ser utilizados durante a execução de um programa.",
                    "Uma variável pode armazenar diferentes tipos de dados, como números, textos e valores booleanos."
                ],
            },
            {
                titulo: "3. Estruturas Condicionais",
                paragrafos: [
                    "Estruturas condicionais permitem que um programa tome decisões de acordo com determinadas condições.",
                    "O exemplo mais comum é a estrutura if/else."
                ],
            },
            {
                titulo: "4. Funções",
                paragrafos: [
                    "Funções permitem organizar o código em blocos reutilizáveis.",
                    "Elas podem receber dados como parâmetros e retornar resultados."
                ],
            },
        ],
    },

    {
        id: 4,
        titulo: "Engenharia de Software",
        categoria: "Tecnologia",
        paginas: "20 páginas",
        tempo: "1 semana atrás",
        autor: "Gilberto",
        imagem:
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80",
        descricao:
            "Principais conceitos relacionados à engenharia de software.",
        conteudo: [
            {
                titulo: "1. Introdução",
                paragrafos: [
                    "A Engenharia de Software reúne métodos, técnicas e práticas utilizadas para desenvolver e manter sistemas de software.",
                ],
            },
            {
                titulo: "2. Levantamento de Requisitos",
                paragrafos: [
                    "O levantamento de requisitos busca identificar as necessidades dos usuários e as funcionalidades que o sistema deverá possuir.",
                ],
            },
            {
                titulo: "3. Desenvolvimento",
                paragrafos: [
                    "O desenvolvimento transforma os requisitos definidos anteriormente em uma solução de software funcional.",
                ],
            },
        ],
    },
];

export default function MaterialPage() {
    const router = useRouter();
    const params = useParams();

    const id = Number(params.id);

    const material = materiais.find(
        (material) => material.id === id
    );

    if (!material) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen bg-[#faf9ff]">
                    <div className="mx-auto flex min-h-[70vh] w-full max-w-[900px] items-center justify-center px-5">
                        <div className="text-center">
                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-purple-100
                                    text-purple-600
                                "
                            >
                                <FileText size={30} />
                            </div>

                            <h1 className="mt-5 text-2xl font-bold text-[#171052]">
                                Material não encontrado
                            </h1>

                            <p className="mt-2 text-sm text-[#6875a0]">
                                O material que você tentou acessar não existe.
                            </p>

                            <button
                                onClick={() => router.push("/meusmateriais")}
                                className="
                                    mt-6
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-purple-600
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-purple-700
                                "
                            >
                                <ArrowLeft size={17} />
                                Voltar para meus materiais
                            </button>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-[#faf9ff]">

                <div className="mx-auto w-full max-w-[1200px] px-5 py-7 sm:px-8 lg:px-10">

                    {/* =====================================================
                        VOLTAR
                    ====================================================== */}

                    <button
                        onClick={() => router.push("/meusmateriais")}
                        className="
                            mb-6
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-[#6875a0]
                            transition
                            hover:text-purple-700
                        "
                    >
                        <ArrowLeft size={18} />

                        Voltar para meus materiais
                    </button>


                    {/* =====================================================
                        CABEÇALHO DO MATERIAL
                    ====================================================== */}

                    <section
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-purple-100
                            bg-white
                            shadow-[0_3px_20px_rgba(70,50,140,0.05)]
                        "
                    >

                        {/* Imagem */}

                        <div className="relative h-[220px] sm:h-[280px]">

                            <img
                                src={material.imagem}
                                alt={material.titulo}
                                className="h-full w-full object-cover"
                            />

                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-gradient-to-t
                                    from-black/60
                                    via-black/10
                                    to-transparent
                                "
                            />

                            <div
                                className="
                                    absolute
                                    bottom-5
                                    left-5
                                    right-5
                                    sm:bottom-7
                                    sm:left-8
                                "
                            >
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-md
                                        bg-white/90
                                        px-2.5
                                        py-1
                                        text-xs
                                        font-semibold
                                        text-purple-700
                                        backdrop-blur
                                    "
                                >
                                    <Folder size={13} />

                                    {material.categoria}
                                </span>

                                <h1
                                    className="
                                        mt-3
                                        text-2xl
                                        font-bold
                                        text-white
                                        sm:text-3xl
                                        lg:text-4xl
                                    "
                                >
                                    {material.titulo}
                                </h1>
                            </div>

                        </div>


                        {/* Informações */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                px-5
                                py-5
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                                sm:px-8
                            "
                        >

                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-[#6875a0]
                                    "
                                >
                                    <BookOpen
                                        size={17}
                                        className="text-purple-600"
                                    />

                                    Por {material.autor}
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-[#6875a0]
                                    "
                                >
                                    <FileText
                                        size={17}
                                        className="text-purple-600"
                                    />

                                    {material.paginas}
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-[#6875a0]
                                    "
                                >
                                    <Clock3
                                        size={17}
                                        className="text-purple-600"
                                    />

                                    {material.tempo}
                                </div>

                            </div>


                            {/* Ações */}

                            <div className="flex items-center gap-2">

                                <button
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-purple-100
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-purple-700
                                        transition
                                        hover:bg-purple-50
                                    "
                                >
                                    <Download size={17} />

                                    Baixar
                                </button>

                                <button
                                    onClick={() => router.push(`/meusmateriais/${material.id}/editar`)}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        bg-purple-600
                                        px-4
                                        py-2.5
                                        text-sm
                                        font-medium
                                        text-white
                                        transition
                                        hover:bg-purple-700
                                    "
                                    >
                                    <Pencil size={17} />

                                    Editar
                                </button>

                            </div>

                        </div>

                    </section>


                    {/* =====================================================
                        CONTEÚDO
                    ====================================================== */}

                    <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">

                        {/* Conteúdo principal */}

                        <article
                            className="
                                rounded-2xl
                                border
                                border-gray-100
                                bg-white
                                px-6
                                py-7
                                shadow-[0_3px_20px_rgba(70,50,140,0.04)]
                                sm:px-10
                                sm:py-9
                            "
                        >

                            {/* Introdução */}

                            <div className="mb-8">

                                <h2 className="text-xl font-bold text-[#171052]">
                                    Sobre este material
                                </h2>

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        leading-7
                                        text-[#6875a0]
                                    "
                                >
                                    {material.descricao}
                                </p>

                            </div>


                            {/* Linha */}

                            <div className="mb-8 border-t border-gray-100" />


                            {/* Conteúdo */}

                            <div className="space-y-9">

                                {material.conteudo.map((secao, index) => (

                                    <section key={index}>

                                        <h2
                                            className="
                                                text-lg
                                                font-bold
                                                text-[#171052]
                                                sm:text-xl
                                            "
                                        >
                                            {secao.titulo}
                                        </h2>

                                        <div className="mt-3 space-y-3">

                                            {secao.paragrafos.map(
                                                (paragrafo, paragraphIndex) => (

                                                    <p
                                                        key={paragraphIndex}
                                                        className="
                                                            text-sm
                                                            leading-7
                                                            text-[#59638f]
                                                            sm:text-base
                                                        "
                                                    >
                                                        {paragrafo}
                                                    </p>

                                                )
                                            )}

                                        </div>

                                    </section>

                                ))}

                            </div>

                        </article>


                        {/* =================================================
                            MENU LATERAL
                        ================================================== */}

                        <aside className="h-fit lg:sticky lg:top-24">

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-purple-100
                                    bg-white
                                    p-5
                                    shadow-[0_3px_20px_rgba(70,50,140,0.04)]
                                "
                            >

                                <h3
                                    className="
                                        text-sm
                                        font-bold
                                        text-[#171052]
                                    "
                                >
                                    Informações
                                </h3>


                                <div className="mt-5 space-y-4">

                                    <div>
                                        <p className="text-xs text-[#8992b2]">
                                            Categoria
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-[#303657]">
                                            {material.categoria}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-xs text-[#8992b2]">
                                            Autor
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-[#303657]">
                                            {material.autor}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-xs text-[#8992b2]">
                                            Quantidade
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-[#303657]">
                                            {material.paginas}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-xs text-[#8992b2]">
                                            Publicado
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-[#303657]">
                                            {material.tempo}
                                        </p>
                                    </div>

                                </div>

                            </div>


                            {/* Índice */}

                            <div
                                className="
                                    mt-4
                                    rounded-2xl
                                    border
                                    border-gray-100
                                    bg-white
                                    p-5
                                    shadow-[0_3px_20px_rgba(70,50,140,0.04)]
                                "
                            >

                                <h3
                                    className="
                                        text-sm
                                        font-bold
                                        text-[#171052]
                                    "
                                >
                                    Conteúdo
                                </h3>

                                <div className="mt-4 space-y-2">

                                    {material.conteudo.map(
                                        (secao, index) => (

                                            <button
                                                key={index}
                                                className="
                                                    block
                                                    w-full
                                                    rounded-lg
                                                    px-3
                                                    py-2
                                                    text-left
                                                    text-xs
                                                    text-[#6875a0]
                                                    transition
                                                    hover:bg-purple-50
                                                    hover:text-purple-700
                                                "
                                            >
                                                {secao.titulo}
                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </main>
        </>
    );
}