"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createUser } from "@/lib/api/signup";
import {
  BookOpen,
  Search,
  Share2,
  Users,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

const INPUT_CLASS =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-purple-600 outline-none transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600";

// Máscaras nos formatos que a API valida: CPF 000.000.000-00 e CEP 00000-000
function maskCpf(value: string) {
  return value
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskCep(value: string) {
  return value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
}

const ADDRESS_FIELDS: { name: string; label: string; placeholder?: string }[] = [
  { name: "zipcode", label: "CEP", placeholder: "00000-000" },
  { name: "street", label: "Rua" },
  { name: "number", label: "Número" },
  { name: "district", label: "Bairro" },
  { name: "city", label: "Cidade" },
  { name: "state", label: "Estado" },
];

export default function Signup() {
  const router = useRouter();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const confirmEmail = formData.get("confirmEmail") as string;

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;


    if (email !== confirmEmail) {
      alert("Os e-mails não coincidem.");
      return;
    }

  
    if (password !== confirmPassword) {
      alert("As senhas não coincidem.");
      return;
    }


    if (!acceptedTerms) {
      alert("Você precisa aceitar os termos de uso.");
      return;
    }

    const field = (name: string) => String(formData.get(name) ?? "").trim();

    setSubmitting(true);

    try {
      await createUser({
        firstName: field("firstName"),
        lastName: field("lastName"),
        email,
        password,
        cpf: field("cpf"),
        phoneNumber: field("phoneNumber"),
        gender: field("gender"),
        course: field("course"),
        birthDate: field("birthDate"),
        address: {
          country: field("country"),
          state: field("state"),
          city: field("city"),
          street: field("street"),
          number: field("number"),
          district: field("district"),
          zipcode: field("zipcode"),
        },
      });

      alert("Conta criada com sucesso!");

      router.push("/login");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível criar a conta.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#ddd6fe] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-xl">


        <section className="relative hidden w-[34%] overflow-hidden bg-gradient-to-br from-[#250080] to-[#4c13b8] p-8 text-white lg:flex lg:flex-col">

    
          <div className="absolute -left-16 -top-16 h-40 w-40 rounded-full bg-purple-500/20" />

          <div className="absolute -left-20 top-24 h-20 w-56 rotate-12 rounded-full bg-purple-400/20" />

          <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-purple-400/10" />

          <div className="relative z-10 flex h-full flex-col">


            <div className="mb-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                <BookOpen size={26} strokeWidth={1.8} />
              </div>

              <h2 className="text-xl font-bold xl:text-2xl">
                Banca de{" "}
                <span className="text-purple-300">
                  Materiais
                </span>
              </h2>

              <div className="mt-3 h-px bg-purple-300/20" />
            </div>

            <div>
              <h1 className="text-2xl font-bold leading-tight xl:text-3xl">
                Faça parte da
                <br />
                comunidade
              </h1>

              <p className="mt-4 max-w-xs text-sm leading-relaxed text-purple-100">
                Compartilhe materiais, ajude outros estudantes e aprenda
                em conjunto.
              </p>
            </div>

  
            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Search size={19} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Encontre conteúdos
                  </p>

                  <p className="mt-0.5 text-xs text-purple-200">
                    Acesse materiais úteis para seus estudos
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Share2 size={19} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Compartilhe conhecimento
                  </p>

                  <p className="mt-0.5 text-xs text-purple-200">
                    Contribua com seus próprios materiais
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10">
                  <Users size={19} strokeWidth={1.8} />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Conecte-se
                  </p>

                  <p className="mt-0.5 text-xs text-purple-200">
                    Faça parte de uma comunidade acadêmica
                  </p>
                </div>
              </div>

            </div>


            <div className="mt-auto pt-10">
              <div className="flex items-center gap-2 text-xs text-purple-200">
                <Check size={15} />
                <span>Comunidade acadêmica colaborativa</span>
              </div>
            </div>

          </div>
        </section>


        <section className="w-full bg-[#faf9ff] px-5 py-8 sm:px-8 lg:w-[66%] lg:px-10">

          <div className="mx-auto w-full max-w-2xl">


            <div className="mb-7">
              <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
                Crie sua conta
              </h1>

              <p className="mt-2 text-xs text-gray-600 sm:text-sm">
                Comece a compartilhar conhecimento gratuitamente
              </p>
            </div>

            <form onSubmit={handleSubmit}>


              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Nome
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-purple-600 outline-none transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Sobrenome
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-purple-600 outline-none transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                  />
                </div>

              </div>


              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    E-mail
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-purple-600 outline-none transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmEmail"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Confirmar e-mail
                  </label>

                  <input
                    id="confirmEmail"
                    name="confirmEmail"
                    type="email"
                    required
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-purple-600 outline-none transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                  />
                </div>

              </div>


              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Senha
                  </label>

                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 pr-10 text-sm text-purple-600 outline-none transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-purple-600"
                      aria-label={
                        showPassword
                          ? "Ocultar senha"
                          : "Mostrar senha"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Confirmar senha
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      required
                      minLength={8}
                      className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 pr-10 text-sm text-purple-600 outline-none transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-purple-600"
                      aria-label={
                        showConfirmPassword
                          ? "Ocultar confirmação da senha"
                          : "Mostrar confirmação da senha"
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}
                    </button>
                  </div>
                </div>

              </div>


              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <label
                    htmlFor="cpf"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    CPF
                  </label>

                  <input
                    id="cpf"
                    name="cpf"
                    type="text"
                    required
                    inputMode="numeric"
                    placeholder="000.000.000-00"
                    onChange={(event) => {
                      event.target.value = maskCpf(event.target.value);
                    }}
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-purple-600 outline-none transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    Telefone
                  </label>

                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-purple-600 outline-none transition focus:border-purple-600 focus:ring-1 focus:ring-purple-600"
                  />
                </div>

              </div>


              <div className="mb-6">
                <label
                  htmlFor="course"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Curso
                </label>

                <input
                  id="course"
                  name="course"
                  type="text"
                  required
                  className={INPUT_CLASS}
                />
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="gender" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Gênero
                  </label>

                  <select id="gender" name="gender" required defaultValue="" className={INPUT_CLASS}>
                    <option value="" disabled>Selecione</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Outro">Outro</option>
                    <option value="Prefiro não informar">Prefiro não informar</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="birthDate" className="mb-1.5 block text-sm font-medium text-gray-700">
                    Data de nascimento
                  </label>

                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    required
                    max={new Date().toISOString().slice(0, 10)}
                    className={INPUT_CLASS}
                  />
                </div>
              </div>

              <fieldset className="mb-6">
                <legend className="mb-3 text-sm font-semibold text-gray-800">Endereço</legend>

                <input type="hidden" name="country" value="Brasil" />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {ADDRESS_FIELDS.map((addressField) => (
                    <div key={addressField.name}>
                      <label
                        htmlFor={addressField.name}
                        className="mb-1.5 block text-sm font-medium text-gray-700"
                      >
                        {addressField.label}
                      </label>

                      <input
                        id={addressField.name}
                        name={addressField.name}
                        type="text"
                        required
                        placeholder={addressField.placeholder}
                        inputMode={addressField.name === "zipcode" ? "numeric" : undefined}
                        onChange={
                          addressField.name === "zipcode"
                            ? (event) => {
                                event.target.value = maskCep(event.target.value);
                              }
                            : undefined
                        }
                        className={INPUT_CLASS}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>


              <div className="mb-5 flex items-start gap-2">

                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(event) =>
                    setAcceptedTerms(event.target.checked)
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 accent-purple-600"
                />

                <label
                  htmlFor="terms"
                  className="text-xs leading-5 text-gray-700"
                >
                  Li e aceito os{" "}
                  <span className="font-medium text-purple-600">
                    Termos de Uso
                  </span>{" "}
                  e a{" "}
                  <span className="font-medium text-purple-600">
                    Política de Privacidade
                  </span>
                </label>

              </div>


              <button
                type="submit"
                disabled={submitting}
                className="h-11 w-full rounded-lg bg-purple-600 font-medium text-white transition hover:bg-purple-700 disabled:opacity-60"
              >
                {submitting ? "Criando conta..." : "Criar conta"}
              </button>

            </form>

            {/* LOGIN */}
            <p className="mt-5 text-center text-xs text-gray-600">
              Já possui uma conta?{" "}
              <a
                href="/login"
                className="font-medium text-purple-600 hover:underline"
              >
                Entrar
              </a>
            </p>

          </div>
        </section>
      </div>
    </div>
  );
}