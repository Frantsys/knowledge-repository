"use client";

import Link from "next/link";
import LinkProgress from "@/components/link-progress";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
    ArrowRight,
    BookOpen,
    FileText,
    Search,
    Upload,
    Compass,
    FolderOpen,
    Clock3,
    Plus,
} from "lucide-react";

import { listMaterials, listMyMaterials, type Material } from "@/lib/api/materials";
import { getMe } from "@/lib/api/perfil";
import SubjectCover from "@/components/subject-cover";
import { requestPublishModal } from "@/lib/hooks";

function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export default function HomePage() {
    const [meusMateriais, setMeusMateriais] = useState<Material[]>([]);
    const [recentes, setRecentes] = useState<Material[]>([]);
    const [nome, setNome] = useState("");
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const router = useRouter();

    useEffect(() => {
        getMe().then((me) => setNome(me.firstName)).catch(() => setNome(""));
        Promise.all([
            listMyMaterials(3).then((page) => setMeusMateriais(page.content)).catch(() => setMeusMateriais([])),
            listMaterials(8)
                .then((page) => setRecentes(page.content.filter((material) => material.isActive).slice(0, 4)))
                .catch(() => setRecentes([])),
        ]).finally(() => setLoading(false));
    }, []);

    // A busca acontece no Explorar: leva o termo pela URL (?q=)
    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const term = query.trim();
        router.push(term ? `/explorar?q=${encodeURIComponent(term)}` : "/explorar");
    }

    const materiaisAcessados = meusMateriais.map((material) => ({
        id: material.id,
        title: material.title,
        category: material.subject,
        accessed: formatDate(material.createdAt),
    }));

    const novosMateriais = recentes.map((material) => ({
        id: material.id,
        author: material.createdBy,
        course: material.course,
        title: material.title,
        description: material.body,
        type: material.subject,
        time: formatDate(material.createdAt),
    }));

    return (
        <div className="min-h-[calc(100dvh-4rem)] bg-surface">

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
                                    Olá{nome && `, ${nome}`} 
                                </p>

                                <h1
                                    className="
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-brand-ink
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

                            <form
                                onSubmit={handleSearch}
                                role="search"
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
                                    className="shrink-0 text-gray-500"
                                />

                                <input
                                    type="search"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    aria-label="Buscar materiais"
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

                                <button
                                    type="submit"
                                    aria-label="Buscar"
                                    className="
                                        flex
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
                                    "
                                >
                                        <span className="hidden sm:inline">Buscar</span>
                                        <ArrowRight size={14} />
                                </button>

                            </form>

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
                                    text-brand-ink
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
                                transitionTypes={["nav-forward"]}
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

                              <LinkProgress />
                            </Link>


                            {/* Meus materiais */}

                            <Link
                                href="/meusmateriais"
                                transitionTypes={["nav-forward"]}
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

                              <LinkProgress />
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
                                        text-brand-ink
                                        sm:text-xl
                                    "
                                >
                                    Continue estudando
                                </h2>

                                <p className="mt-1 text-xs text-gray-500">
                                    Seus materiais publicados recentemente
                                </p>

                            </div>


                            <Link
                                href="/meusmateriais"
                                transitionTypes={["nav-forward"]}
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
                              <LinkProgress />
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

                            {loading && [0, 1, 2].map((item) => (
                                <div key={item} aria-hidden="true" className="h-[250px] animate-pulse rounded-xl border border-gray-200 bg-white">
                                    <div className="h-[160px] rounded-t-xl bg-gray-100" />
                                    <div className="space-y-2 p-4">
                                        <div className="h-3 w-3/4 rounded bg-gray-100" />
                                        <div className="h-3 w-1/3 rounded bg-gray-100" />
                                    </div>
                                </div>
                            ))}

                            {!loading && materiaisAcessados.length === 0 && (
                                <div className="col-span-full flex flex-col items-center rounded-xl border border-dashed border-purple-200 bg-white px-6 py-10 text-center">
                                    <p className="text-sm font-semibold text-gray-800">Você ainda não publicou nenhum material</p>
                                    <p className="mt-1 max-w-sm text-sm text-gray-600">
                                        Compartilhe um resumo ou anotação; ele aparece aqui para você retomar depois.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={requestPublishModal}
                                        className="mt-4 inline-flex h-10 items-center gap-2 rounded-lg bg-purple-600 px-4 text-sm font-medium text-white transition hover:bg-purple-700"
                                    >
                                        <Plus size={16} />
                                        Publicar meu primeiro material
                                    </button>
                                </div>
                            )}

                            {materiaisAcessados.map((material) => (

                                <Link
                                    key={material.id}
                                    href={`/materiais/${material.id}`}
                                    transitionTypes={["nav-forward"]}
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

                                    <SubjectCover subject={material.category} className="h-[160px]">

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
                                                text-xs
                                                font-medium
                                                text-purple-700
                                                shadow-sm
                                                backdrop-blur-sm
                                            "
                                        >
                                            {material.category}
                                        </div>

                                    </SubjectCover>


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
                                                        text-xs
                                                        text-gray-500
                                                    "
                                                >
                                                    <Clock3 size={12} />

                                                    <span>
                                                        Publicado em {material.accessed}
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

                                  <LinkProgress />
                                </Link>

                            ))}

                        </div>


                        {/* Mobile */}

                        <Link
                            href="/meusmateriais"
                            transitionTypes={["nav-forward"]}
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
                          <LinkProgress />
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
                                        text-brand-ink
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
                                transitionTypes={["nav-forward"]}
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
                              <LinkProgress />
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

                            {loading && [0, 1, 2, 3].map((item) => (
                                <div key={item} aria-hidden="true" className="h-[220px] animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                                    <div className="h-9 w-9 rounded-full bg-gray-100" />
                                    <div className="mt-6 h-3 w-3/4 rounded bg-gray-100" />
                                    <div className="mt-2 h-3 w-full rounded bg-gray-100" />
                                    <div className="mt-2 h-3 w-2/3 rounded bg-gray-100" />
                                </div>
                            ))}

                            {!loading && novosMateriais.length === 0 && (
                                <p className="col-span-full rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-600">
                                    Ainda não há materiais da comunidade. Que tal ser o primeiro a publicar?
                                </p>
                            )}

                            {novosMateriais.map((material) => (

                                <Link
                                    key={material.id}
                                    href={`/materiais/${material.id}`}
                                    transitionTypes={["nav-forward"]}
                                    className="
                                        group
                                        flex
                                        min-h-[220px]
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
                                            {material.author.charAt(0).toUpperCase()}
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
                                                    text-xs
                                                    text-gray-500
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
                                                    text-xs
                                                    font-medium
                                                    text-purple-700
                                                "
                                            >
                                                <FileText size={11} />
                                                {material.type}
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
                                                flex-1
                                                text-xs
                                                leading-relaxed
                                                text-gray-500
                                            "
                                        >
                                            {material.description}
                                        </p>


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
                                                    text-xs
                                                    text-gray-500
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
                                                    text-xs
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

                                  <LinkProgress />
                                </Link>

                            ))}

                        </div>


                        {/* Mobile */}

                        <Link
                            href="/explorar"
                            transitionTypes={["nav-forward"]}
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
                          <LinkProgress />
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