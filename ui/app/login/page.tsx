"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        // Showcase:
        // não existe API, banco ou autenticação real.
        setLoading(true);

        // Simula um pequeno carregamento
        setTimeout(() => {
            window.location.href = "/home";
        }, 700);
    }

    return (
        <main
            className="
                min-h-screen
                w-full
                bg-[#eeeeF1]
                flex
                items-center
                justify-center
                px-4
                py-6
            "
        >
            <div
                className="
                    flex
                    w-full
                    max-w-[900px]
                    overflow-hidden
                    rounded-lg
                    bg-white
                    shadow-[0_8px_30px_rgba(0,0,0,0.15)]
                    min-h-[560px]
                    md:min-h-[500px]
                "
            >
                {/* ================================================= */}
                {/* PAINEL ESQUERDO */}
                {/* ================================================= */}

                <section
                    className="
                        relative
                        hidden
                        overflow-hidden
                        bg-gradient-to-br
                        from-[#26005f]
                        via-[#4210c5]
                        to-[#7025ff]
                        text-white
                        md:flex
                        md:w-[32%]
                        md:flex-col
                        md:items-center
                        md:px-5
                        md:py-8
                    "
                >
                    {/* Círculo decorativo superior */}
                    <div
                        className="
                            absolute
                            -left-12
                            -top-16
                            h-32
                            w-32
                            rounded-full
                            border-[16px]
                            border-purple-400/20
                        "
                    />

                    {/* Círculo decorativo inferior */}
                    <div
                        className="
                            absolute
                            -bottom-16
                            -right-16
                            h-32
                            w-32
                            rounded-full
                            border-[14px]
                            border-purple-300/10
                        "
                    />

                    {/* Conteúdo */}
                    <div
                        className="
                            relative
                            z-10
                            flex
                            w-full
                            flex-col
                            items-center
                            text-center
                        "
                    >
                        {/* Logo */}
                        <div
                            className="
                                mt-5
                                flex
                                items-center
                                justify-center
                            "
                        >
                            <BookOpen
                                size={76}
                                strokeWidth={1.5}
                            />
                        </div>

                        {/* Nome */}
                        <h1
                            className="
                                mt-5
                                text-[17px]
                                font-semibold
                                leading-tight
                            "
                        >
                            Banca de Materiais
                        </h1>

                        {/* Descrição */}
                        <p
                            className="
                                mt-2
                                max-w-[190px]
                                text-[9px]
                                leading-relaxed
                                text-purple-100
                            "
                        >
                            Compartilhe conhecimento.
                            Encontre o que precisa
                            para estudar.
                        </p>
                    </div>

                    {/* Rodapé */}
                    <div
                        className="
                            absolute
                            bottom-6
                            left-0
                            right-0
                            px-5
                            text-center
                        "
                    >
                        <p
                            className="
                                text-[9px]
                                text-purple-100
                            "
                        >
                            Comunidade acadêmica colaborativa
                        </p>
                    </div>
                </section>

                {/* ================================================= */}
                {/* FORMULÁRIO */}
                {/* ================================================= */}

                <section
                    className="
                        flex
                        w-full
                        flex-col
                        justify-center
                        bg-[#faf9ff]
                        px-10
                        py-10
                        sm:px-12
                        md:w-[68%]
                        md:px-12
                        lg:px-16
                    "
                >
                    <div
                        className="
                            mx-auto
                            w-full
                            max-w-[440px]
                        "
                    >
                        {/* TÍTULO */}
                        <div>
                            <h2
                                className="
                                    text-[24px]
                                    font-bold
                                    leading-tight
                                    text-[#12004c]
                                    sm:text-[26px]
                                "
                            >
                                Bem-vindo de volta
                            </h2>

                            <p
                                className="
                                    mt-0.5
                                    text-[10px]
                                    text-gray-600
                                "
                            >
                                Entre para acessar a comunidade
                            </p>
                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="mt-7"
                        >
                            {/* E-MAIL */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="
                                        mb-1
                                        block
                                        text-[12px]
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    E-mail
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="seu@email.com"
                                    required
                                    autoComplete="email"
                                    className="
                                        h-10
                                        w-full
                                        rounded-md
                                        border
                                        border-gray-300
                                        bg-white
                                        px-3
                                        text-xs
                                        text-gray-900
                                        outline-none
                                        transition
                                        focus:border-purple-600
                                        focus:ring-1
                                        focus:ring-purple-600
                                    "
                                />
                            </div>

                            {/* SENHA */}
                            <div className="mt-5">
                                <label
                                    htmlFor="password"
                                    className="
                                        mb-1
                                        block
                                        text-[12px]
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    Senha
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(event.target.value)
                                    }
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                    className="
                                        h-10
                                        w-full
                                        rounded-md
                                        border
                                        border-gray-300
                                        bg-white
                                        px-3
                                        text-xs
                                        text-gray-900
                                        outline-none
                                        transition
                                        focus:border-purple-600
                                        focus:ring-1
                                        focus:ring-purple-600
                                    "
                                />

                                {/* Esqueci minha senha */}
                                {/*<div className="mt-1">
                                    <Link
                                        href="/recuperar-senha"
                                        className="
                                            font-medium
                                            text-[10px]
                                            text-purple-600
                                            hover:underline
                                        "
                                    >
                                        Esqueci minha senha
                                    </Link>
                                </div>*/}
                            </div>

                            {/* BOTÃO */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    mx-auto
                                    mt-5
                                    flex
                                    h-10
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-purple-600
                                    text-xs
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-purple-700
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-purple-600/30
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {loading
                                    ? "Entrando..."
                                    : "Entrar"}
                            </button>
                        </form>

                        {/* DIVISOR */}
                        <div
                            className="
                                my-5
                                flex
                                items-center
                                gap-4
                            "
                        >
                            <div
                                className="
                                    h-px
                                    flex-1
                                    bg-gray-300
                                "
                            />

                            <span
                                className="
                                    text-[9px]
                                    text-gray-500
                                "
                            >
                                ou
                            </span>

                            <div
                                className="
                                    h-px
                                    flex-1
                                    bg-gray-300
                                "
                            />
                        </div>

                        {/* CADASTRO */}
                        <p
                            className="
                                font-medium
                                text-center
                                text-[11px]
                                text-gray-600
                            "
                        >
                            Ainda não tem uma conta?{" "}

                            <Link
                                href="/signup"
                                className="
                                    font-bold
                                    text-purple-600
                                    hover:underline
                                "
                            >
                                Cadastre-se
                            </Link>
                        </p>
                    </div>
                </section>
            </div>

            {/* ================================================= */}
            {/* VERSÃO MOBILE */}
            {/* ================================================= */}

            <div
                className="
                    fixed
                    left-0
                    right-0
                    top-0
                    flex
                    h-[72px]
                    items-center
                    bg-gradient-to-r
                    from-[#26005f]
                    to-[#5c20e8]
                    px-5
                    text-white
                    md:hidden
                "
            >
                <div className="flex items-center gap-3">
                    <BookOpen
                        size={30}
                        strokeWidth={1.6}
                    />

                    <div>
                        <p
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            Banca de Materiais
                        </p>

                        <p
                            className="
                                text-[10px]
                                text-purple-100
                            "
                        >
                            Entre para acessar a comunidade
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}