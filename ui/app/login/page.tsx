"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { login } from "@/lib/api/login";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await login(email, password);

            localStorage.setItem("token", data.token);

            window.location.href = "/home";
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Erro ao realizar login."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen w-full">

            <div className="flex min-h-screen w-full flex-col md:flex-row">

                {/* LADO ESQUERDO */}
                <section
                    className="
                        relative flex
                        min-h-[320px]
                        w-full
                        flex-col
                        justify-center
                        overflow-hidden
                        bg-gradient-to-br
                        from-[#18004f]
                        via-[#4211c9]
                        to-[#6828ff]
                        px-8
                        py-12
                        text-white
                        md:min-h-screen
                        md:w-[36%]
                        md:px-12
                        lg:px-16
                    "
                >

                    {/* Decoração superior esquerda */}
                    <div
                        className="
                            absolute
                            -left-20
                            -top-24
                            h-64
                            w-64
                            rounded-full
                            border-[28px]
                            border-purple-500/30
                        "
                    />

                    {/* Decoração inferior direita */}
                    <div
                        className="
                            absolute
                            -bottom-32
                            -right-20
                            h-64
                            w-64
                            rounded-full
                            border-[25px]
                            border-purple-300/10
                        "
                    />

                    {/* Conteúdo */}
                    <div className="relative mx-auto w-full max-w-[340px]">

                        {/* Logo */}
                        <div className="mb-6 flex justify-center md:justify-start">
                            <div className="relative flex h-24 w-24 items-center justify-center">

                                <BookOpen
                                    size={82}
                                    strokeWidth={1.7}
                                    className="
                                        absolute
                                        translate-x-1
                                        translate-y-1
                                        text-black/50
                                    "
                                />

                                <BookOpen
                                    size={82}
                                    strokeWidth={1.7}
                                    className="relative text-white"
                                />

                            </div>
                        </div>

                        <h1
                            className="
                                text-center
                                text-3xl
                                font-bold
                                md:text-left
                            "
                        >
                            Banca de Materiais
                        </h1>

                        <p
                            className="
                                mt-3
                                max-w-[280px]
                                text-center
                                text-sm
                                leading-relaxed
                                text-purple-100
                                md:text-left
                            "
                        >
                            Compartilhe conhecimento. Encontre o que
                            precisa para estudar.
                        </p>

                    </div>
                </section>

                {/* LADO DIREITO */}
                <section
                    className="
                        flex
                        min-h-screen
                        w-full
                        items-center
                        justify-center
                        bg-[#faf9ff]
                        px-7
                        py-12
                        sm:px-12
                        md:w-[64%]
                        md:px-16
                        lg:px-20
                        xl:px-28
                    "
                >

                    <div className="w-full max-w-[500px]">

                        {/* Título */}
                        <div>

                            <h2
                                className="
                                    text-[28px]
                                    font-bold
                                    leading-tight
                                    text-[#100047]
                                    sm:text-[30px]
                                "
                            >
                                Bem-vindo de volta
                            </h2>

                            <p className="mt-1 text-sm text-[#16094d]">
                                Entre para acessar a comunidade
                            </p>

                        </div>

                        {/* Formulário */}
                        <form
                            onSubmit={handleSubmit}
                            className="mt-10"
                        >

                            {/* E-mail */}
                            <div>

                                <label
                                    htmlFor="email"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        text-gray-800
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
                                    required
                                    autoComplete="email"
                                    className="
                                        h-11
                                        w-full
                                        rounded-md
                                        border
                                        border-gray-400
                                        bg-transparent
                                        px-3
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        transition
                                        focus:border-purple-600
                                        focus:ring-1
                                        focus:ring-purple-600
                                    "
                                />

                            </div>

                            {/* Senha */}
                            <div className="mt-5">

                                <label
                                    htmlFor="password"
                                    className="
                                        mb-1.5
                                        block
                                        text-sm
                                        text-gray-800
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
                                    required
                                    minLength={8}
                                    autoComplete="current-password"
                                    className="
                                        h-11
                                        w-full
                                        rounded-md
                                        border
                                        border-gray-400
                                        bg-transparent
                                        px-3
                                        text-sm
                                        text-gray-900
                                        outline-none
                                        transition
                                        focus:border-purple-600
                                        focus:ring-1
                                        focus:ring-purple-600
                                    "
                                />

                            </div>

                            {/* Esqueci senha */}
                            <div className="mt-2">

                                <Link
                                    href="/recuperar-senha"
                                    className="
                                        text-xs
                                        text-purple-600
                                        hover:underline
                                    "
                                >
                                    Esqueci minha senha
                                </Link>

                            </div>

                            {/* Erro */}
                            {error && (
                                <div
                                    className="
                                        mt-4
                                        rounded-md
                                        bg-red-50
                                        px-3
                                        py-2
                                        text-sm
                                        text-red-600
                                    "
                                >
                                    {error}
                                </div>
                            )}

                            {/* Entrar */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="
                                    mt-7
                                    h-11
                                    w-full
                                    rounded-xl
                                    bg-purple-600
                                    text-sm
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-purple-700
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {loading
                                    ? "Entrando..."
                                    : "Entrar"}
                            </button>

                        </form>

                        {/* Separador */}
                        <div className="my-6 flex items-center gap-5">

                            <div className="h-px flex-1 bg-gray-400" />

                            <span className="text-xs text-gray-600">
                                ou
                            </span>

                            <div className="h-px flex-1 bg-gray-400" />

                        </div>

                        {/* Cadastro */}
                        <p className="text-center text-xs text-gray-700">

                            Ainda não tem uma conta?{" "}

                            <Link
                                href="/cadastro"
                                className="
                                    font-medium
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

        </main>
    );
}