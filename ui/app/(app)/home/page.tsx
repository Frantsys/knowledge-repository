"use client";

import Link from "next/link";
import LinkProgress from "@/components/link-progress";
import { FormEvent, useState } from "react";
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

import { type Material } from "@/lib/api/materials";
import { useMaterials, useMe, useMyMaterials } from "@/lib/api/swr";
import SubjectCover from "@/components/subject-cover";
import UserAvatar from "@/components/user-avatar";
import { Skeleton } from "@/components/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPublishModal } from "@/lib/hooks";

function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export default function HomePage() {
    const [query, setQuery] = useState("");
    const router = useRouter();

    // Dados em cache (SWR): voltar ao Início mostra o que já foi carregado e atualiza em segundo plano
    const { data: me } = useMe();
    const { data: myPage, isLoading: loadingMine } = useMyMaterials(3);
    const { data: recentPage, isLoading: loadingRecent } = useMaterials(8);

    const nome = me?.firstName ?? "";
    const meusMateriais: Material[] = myPage?.content ?? [];
    const recentes: Material[] = (recentPage?.content ?? []).filter((material) => material.isActive).slice(0, 4);

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
        authorAvatarUrl: material.user?.avatarUrl ?? null,
        course: material.course,
        title: material.title,
        description: material.body,
        type: material.subject,
        time: formatDate(material.createdAt),
    }));

    return (
        <div className="min-h-[calc(100dvh-4rem)] bg-background">

            {/* =====================================================
                CONTEÚDO
            ====================================================== */}

            <main>

                <div
                    className="page-container pt-8 pb-16 lg:pt-10"
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
                                        text-primary
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
                                        text-muted-foreground
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
                                className="flex h-12 w-full items-center gap-2 rounded-xl border bg-card pl-4 pr-2 shadow-sm transition focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30"
                            >
                                <Search className="size-[19px] shrink-0 text-muted-foreground" />
                                <Input
                                    type="search"
                                    value={query}
                                    onChange={(event) => setQuery(event.target.value)}
                                    aria-label="Buscar materiais"
                                    placeholder="Buscar materiais, disciplinas ou assuntos..."
                                    className="h-full min-w-0 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0 dark:bg-transparent"
                                />
                                <Button type="submit" aria-label="Buscar" className="h-8 px-3 text-xs">
                                    <span className="hidden sm:inline">Buscar</span>
                                    <ArrowRight />
                                </Button>
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
                                    border-border
                                    bg-card
                                    p-4
                                    shadow-sm
                                    transition
                                    hover:border-primary/40
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
                                        bg-accent
                                        text-primary
                                        transition
                                        group-hover:bg-accent
                                    "
                                >
                                    <Compass size={20} />
                                </div>

                                <div className="min-w-0">

                                    <p className="text-sm font-semibold text-foreground">
                                        Explorar materiais
                                    </p>

                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Encontre novos conteúdos
                                    </p>

                                </div>

                                <ArrowRight
                                    size={16}
                                    className="
                                        ml-auto
                                        shrink-0
                                        text-muted-foreground/70
                                        transition
                                        group-hover:translate-x-0.5
                                        group-hover:text-primary/80
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
                                    border-border
                                    bg-card
                                    p-4
                                    shadow-sm
                                    transition
                                    hover:border-primary/40
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
                                        bg-accent
                                        text-primary
                                        transition
                                        group-hover:bg-accent
                                    "
                                >
                                    <FolderOpen size={20} />
                                </div>

                                <div className="min-w-0">

                                    <p className="text-sm font-semibold text-foreground">
                                        Meus materiais
                                    </p>

                                    <p className="mt-0.5 text-xs text-muted-foreground">
                                        Acesse seus conteúdos salvos
                                    </p>

                                </div>

                                <ArrowRight
                                    size={16}
                                    className="
                                        ml-auto
                                        shrink-0
                                        text-muted-foreground/70
                                        transition
                                        group-hover:translate-x-0.5
                                        group-hover:text-primary/80
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

                                <p className="mt-1 text-xs text-muted-foreground">
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
                                    text-primary
                                    transition
                                    hover:text-primary/80
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

                            {/* Esqueletos com a mesma estrutura do card real (capa 160px + linha de título e data) */}
                            {loadingMine && [0, 1, 2].map((item) => (
                                <div
                                    key={item}
                                    role={item === 0 ? "status" : undefined}
                                    aria-label={item === 0 ? "Carregando seus materiais" : undefined}
                                    className="skeleton-delayed overflow-hidden rounded-xl border border-border bg-card"
                                >
                                    <Skeleton className="h-[160px] rounded-none" />
                                    <div className="flex items-start gap-3 p-4">
                                        <Skeleton className="h-9 w-9 rounded-lg" />
                                        <div className="flex-1 space-y-2.5 pt-0.5">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {!loadingMine && materiaisAcessados.length === 0 && (
                                <div className="col-span-full flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
                                    <p className="text-sm font-semibold text-foreground">Você ainda não publicou nenhum material</p>
                                    <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                                        Compartilhe um resumo ou anotação; ele aparece aqui para você retomar depois.
                                    </p>
                                    <Button size="lg" className="mt-4 h-10" onClick={requestPublishModal}>
                                        <Plus />
                                        Publicar meu primeiro material
                                    </Button>
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
                                        border-border
                                        bg-card
                                        shadow-sm
                                        transition
                                        hover:border-primary/40
                                        hover:shadow-lg
                                    "
                                >

                                    {/* Imagem */}

                                    <SubjectCover subject={material.category} className="h-[160px]">

                                        {/* Categoria */}

                                        <Badge className="absolute left-3 top-3 bg-card/90 text-primary shadow-sm backdrop-blur-sm">{material.category}</Badge>

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
                                                    bg-accent
                                                    text-primary
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
                                                        text-foreground
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
                                                        text-muted-foreground
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
                                                    text-muted-foreground/70
                                                    transition
                                                    group-hover:translate-x-0.5
                                                    group-hover:text-primary/80
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
                                text-primary
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

                                <p className="mt-1 text-xs text-muted-foreground">
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
                                    text-primary
                                    transition
                                    hover:text-primary/80
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

                            {loadingRecent && [0, 1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    role={item === 0 ? "status" : undefined}
                                    aria-label={item === 0 ? "Carregando novos materiais" : undefined}
                                    className="skeleton-delayed flex min-h-[220px] flex-col rounded-xl border border-border bg-card p-4"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Skeleton className="h-9 w-9 rounded-full" />
                                        <div className="space-y-1.5">
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                    <Skeleton className="mt-5 h-5 w-20" />
                                    <Skeleton className="mt-3 h-4 w-3/4" />
                                    <Skeleton className="mt-2 h-3 w-full" />
                                    <div className="mt-auto flex justify-between border-t border-border pt-3">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                </div>
                            ))}

                            {!loadingRecent && novosMateriais.length === 0 && (
                                <p className="col-span-full rounded-xl border border-dashed border-input bg-card px-6 py-10 text-center text-sm text-muted-foreground">
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
                                        border-border
                                        bg-card
                                        shadow-sm
                                        transition
                                        hover:border-primary/40
                                        hover:shadow-lg
                                    "
                                >

                                    {/* Usuário */}

                                    <div className="flex items-center gap-2.5 px-4 pt-4">

                                        <UserAvatar
                                            avatarUrl={material.authorAvatarUrl}
                                            name={material.author}
                                            className="h-9 w-9 rounded-full text-xs"
                                            fallbackClassName="bg-accent text-primary"
                                        />


                                        <div className="min-w-0">

                                            <p
                                                className="
                                                    truncate
                                                    text-xs
                                                    font-semibold
                                                    text-foreground
                                                "
                                            >
                                                {material.author}
                                            </p>

                                            <p
                                                className="
                                                    mt-0.5
                                                    truncate
                                                    text-xs
                                                    text-muted-foreground
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

                                            <Badge variant="secondary" className="bg-accent text-accent-foreground"><FileText />{material.type}</Badge>

                                        </div>


                                        {/* Título */}

                                        <h3
                                            className="
                                                line-clamp-2
                                                text-sm
                                                font-semibold
                                                leading-snug
                                                text-foreground
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
                                                text-muted-foreground
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
                                                border-border
                                                pt-3
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    gap-1.5
                                                    text-xs
                                                    text-muted-foreground
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
                                                    text-primary
                                                    transition
                                                    group-hover:text-primary/80
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
                                text-primary
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