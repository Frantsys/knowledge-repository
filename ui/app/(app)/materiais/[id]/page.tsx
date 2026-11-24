"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import {
    ArrowLeft,
    Clock3,
    Download,
    FileText,
    Folder,
    Pencil,
} from "lucide-react";

import SubjectCover from "@/components/subject-cover";
import UserAvatar from "@/components/user-avatar";
import MaterialSkeleton from "./material-skeleton";
import { toast } from "@/components/toast";
import { getMaterial, type Material } from "@/lib/api/materials";
import { downloadFile, listFiles, type MaterialFile } from "@/lib/api/files";
import { createComment, listComments, type Comment } from "@/lib/api/comments";
import { getMe } from "@/lib/api/perfil";

function formatDate(date: string) {
    return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

export default function MaterialPage() {
    const router = useRouter();
    const params = useParams();

    const id = Number(params.id);

    const [data, setData] = useState<Material | null>(null);
    const [files, setFiles] = useState<MaterialFile[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [myId, setMyId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [commentError, setCommentError] = useState<string | null>(null);
    const [sendingComment, setSendingComment] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [downloading, setDownloading] = useState<number | "all" | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        Promise.all([
            getMaterial(id).then(setData),
            listFiles(id).then((page) => setFiles(page.content)),
            listComments(id).then((page) => setComments(page.content)),
            getMe().then((me) => setMyId(me.id)),
        ])
            // 404 vira "não encontrado"; qualquer outra falha mostra o erro com opção de tentar de novo
            .catch((error: Error & { status?: number }) => {
                if (error.status !== 404) setLoadError(error.message);
            })
            .finally(() => setLoading(false));
    }, [id, attempt]);

    // Volta para a tela de onde o usuário veio (Explorar, Meus materiais, Início); sem histórico, vai ao Explorar
    function goBack() {
        if (window.history.length > 1) router.back();
        else router.push("/explorar");
    }

    async function handleDownload(target: MaterialFile | "all") {
        setDownloading(target === "all" ? "all" : target.id);

        try {
            for (const file of target === "all" ? files : [target]) {
                await downloadFile(file);
            }
        } catch (error) {
            toast(error instanceof Error ? error.message : "Não foi possível baixar o arquivo.", { type: "error" });
        } finally {
            setDownloading(null);
        }
    }

    async function handleComment(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setCommentError(null);
        setSendingComment(true);

        try {
            const comment = await createComment(id, newComment.trim());
            setComments((current) => [comment, ...current]);
            setNewComment("");
        } catch (error) {
            setCommentError(error instanceof Error ? error.message : "Não foi possível comentar.");
        } finally {
            setSendingComment(false);
        }
    }

    // Adapta o MaterialResponse ao formato que o layout já usa
    const material = data && data.isActive
        ? {
              id: data.id,
              titulo: data.title,
              categoria: data.subject,
              paginas: `${files.length} ${files.length === 1 ? "arquivo" : "arquivos"}`,
              tempo: formatDate(data.createdAt),
              autor: data.createdBy,
              autorFoto: data.user?.avatarUrl ?? null,
              descricao: data.course,
              conteudo: [{ titulo: "Conteúdo", paragrafos: data.body.split(/\n+/).filter(Boolean) }],
          }
        : null;

    const isOwner = data !== null && myId !== null && data.userId === myId;

    if (loading) {
        return <MaterialSkeleton />;
    }

    if (loadError) {
        return (
            <>
                <main className="min-h-[calc(100dvh-4rem)] bg-surface">
                    <div role="alert" className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
                        <h1 className="text-2xl font-bold text-brand-ink">Não foi possível carregar o material</h1>
                        <p className="mt-2 whitespace-pre-line text-sm text-gray-600">{loadError}</p>
                        <div className="mt-6 flex gap-2">
                            <button
                                type="button"
                                onClick={goBack}
                                className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                            >
                                Voltar
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setLoading(true);
                                    setLoadError(null);
                                    setAttempt((current) => current + 1);
                                }}
                                className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                            >
                                Tentar novamente
                            </button>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (!material) {
        return (
            <>

                <main className="min-h-[calc(100dvh-4rem)] bg-surface">
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

                            <h1 className="mt-5 text-2xl font-bold text-brand-ink">
                                Material não encontrado
                            </h1>

                            <p className="mt-2 text-sm text-gray-600">
                                Ele pode ter sido removido pelo autor ou o link está incorreto.
                            </p>

                            <button
                                onClick={() => router.push("/explorar")}
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
                                Voltar para explorar materiais
                            </button>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>

            <main className="min-h-[calc(100dvh-4rem)] bg-surface">

                <div className="mx-auto w-full max-w-[1200px] px-5 py-7 sm:px-8 lg:px-10">

                    {/* =====================================================
                        VOLTAR
                    ====================================================== */}

                    <button
                        type="button"
                        onClick={goBack}
                        className="
                            mb-6
                            flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-gray-600
                            transition
                            hover:text-purple-700
                        "
                    >
                        <ArrowLeft size={18} />

                        Voltar
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

                        <SubjectCover subject={material.categoria} className="h-[220px] sm:h-[280px]">

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

                        </SubjectCover>


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
                                        text-gray-600
                                    "
                                >
                                    <UserAvatar
                                        avatarUrl={material.autorFoto}
                                        name={material.autor}
                                        className="h-6 w-6 rounded-full text-xs"
                                        fallbackClassName="bg-purple-100 text-purple-700"
                                    />

                                    Por {material.autor}
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        text-gray-600
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
                                        text-gray-600
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
                                    type="button"
                                    disabled={files.length === 0 || downloading !== null}
                                    onClick={() => handleDownload("all")}
                                    title={files.length === 0 ? "Este material não tem arquivos anexados" : undefined}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-xl
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
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

                                    {downloading === "all"
                                        ? "Baixando..."
                                        : files.length > 1
                                            ? `Baixar ${files.length} arquivos`
                                            : "Baixar"}
                                </button>

                                {isOwner && (
                                <button
                                    type="button"
                                    onClick={() => router.push(`/materiais/${material.id}/editar`)}
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
                                )}

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

                                <h2 className="text-xl font-bold text-brand-ink">
                                    Sobre este material
                                </h2>

                                <p
                                    className="
                                        mt-3
                                        text-sm
                                        leading-7
                                        text-gray-600
                                    "
                                >
                                    Material do curso de {material.descricao}.
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
                                                text-brand-ink
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
                                                            text-gray-600
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

                            {/* Comentários */}

                            <section className="mt-10 border-t border-gray-100 pt-8">
                                <h2 className="text-lg font-bold text-brand-ink">
                                    Comentários ({comments.length})
                                </h2>

                                <form onSubmit={handleComment} className="mt-4">
                                    <label htmlFor="new-comment" className="sr-only">
                                        Escreva um comentário
                                    </label>
                                    <textarea
                                        id="new-comment"
                                        rows={3}
                                        value={newComment}
                                        onChange={(event) => setNewComment(event.target.value)}
                                        placeholder="Escreva um comentário..."
                                        className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/10"
                                    />
                                    {commentError && (
                                        <p role="alert" className="mt-2 whitespace-pre-line text-xs text-red-600">
                                            {commentError}
                                        </p>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim() || sendingComment}
                                        className="mt-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {sendingComment ? "Enviando..." : "Comentar"}
                                    </button>
                                </form>

                                {comments.length === 0 && (
                                    <p className="mt-6 text-sm text-gray-500">Ainda não há comentários. Tire uma dúvida ou deixe um agradecimento ao autor.</p>
                                )}

                                <ul className="mt-6 space-y-4">
                                    {comments.map((comment) => (
                                        <li key={comment.id} className="flex gap-3 rounded-xl border border-gray-100 bg-white p-4">
                                            <UserAvatar
                                                avatarUrl={comment.authorAvatarUrl}
                                                name={comment.createdBy}
                                                className="h-9 w-9 rounded-full text-xs"
                                                fallbackClassName="bg-purple-100 text-purple-700"
                                            />
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500">
                                                    <span className="font-semibold text-gray-800">{comment.createdBy}</span>
                                                    {" · "}
                                                    {formatDate(comment.createdAt)}
                                                </p>
                                                <p className="mt-1 whitespace-pre-line text-sm leading-6 text-gray-600">
                                                    {comment.body}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </section>

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
                                        text-brand-ink
                                    "
                                >
                                    Informações
                                </h3>


                                <div className="mt-5 space-y-4">

                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Categoria
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
                                            {material.categoria}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Autor
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
                                            {material.autor}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Quantidade
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
                                            {material.paginas}
                                        </p>
                                    </div>


                                    <div>
                                        <p className="text-xs text-gray-500">
                                            Publicado
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-gray-800">
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
                                        text-brand-ink
                                    "
                                >
                                    Arquivos
                                </h3>

                                <div className="mt-4 space-y-2">

                                    {files.length === 0 && (
                                        <p className="px-3 text-xs text-gray-500">Nenhum arquivo anexado.</p>
                                    )}

                                    {files.map((file) => (
                                        <button
                                            key={file.id}
                                            type="button"
                                            onClick={() => handleDownload(file)}
                                            disabled={downloading !== null}
                                            aria-label={`Baixar ${file.name}`}
                                            className="
                                                flex
                                                w-full
                                                items-center
                                                gap-2
                                                rounded-lg
                                                px-3
                                                py-2
                                                text-left
                                                text-xs
                                                text-gray-600
                                                transition
                                                hover:bg-purple-50
                                                hover:text-purple-700
                                            "
                                        >
                                            <Download size={13} className="shrink-0" />
                                            <span className="truncate">{downloading === file.id ? "Baixando..." : file.name}</span>
                                        </button>
                                    ))}

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </main>
        </>
    );
}