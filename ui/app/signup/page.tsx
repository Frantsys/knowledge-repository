"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, Search, Share2, Users } from "lucide-react";
import { createUser } from "@/lib/api/signup";
import { toast } from "@/components/toast";
import AuthShell from "@/components/auth-shell";
import FormField, { INPUT_CLASS } from "@/components/form-field";
import PasswordInput from "@/components/password-input";
import { maskPhone } from "@/lib/masks";

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

// Larguras proporcionais ao conteúdo (grade de 6 colunas): CEP curto, rua longa, estado curto
const ADDRESS_FIELDS: { name: string; label: string; placeholder?: string; autoComplete: string; span: string }[] = [
  { name: "zipcode", label: "CEP", placeholder: "00000-000", autoComplete: "postal-code", span: "sm:col-span-2" },
  { name: "street", label: "Rua", autoComplete: "address-line1", span: "sm:col-span-4" },
  { name: "number", label: "Número", autoComplete: "address-line2", span: "sm:col-span-2" },
  { name: "district", label: "Bairro", autoComplete: "off", span: "sm:col-span-4" },
  { name: "city", label: "Cidade", autoComplete: "address-level2", span: "sm:col-span-4" },
  { name: "state", label: "Estado", placeholder: "Ex.: SP", autoComplete: "address-level1", span: "sm:col-span-2" },
];

const BENEFITS = [
  { icon: Search, title: "Encontre conteúdos", text: "Acesse materiais úteis para seus estudos" },
  { icon: Share2, title: "Compartilhe conhecimento", text: "Contribua com seus próprios materiais" },
  { icon: Users, title: "Conecte-se", text: "Faça parte de uma comunidade acadêmica" },
];

function Section({ title, first = false, children }: { title: string; first?: boolean; children: React.ReactNode }) {
  return (
    <fieldset className={first ? "" : "mt-9 border-t border-gray-200 pt-7"}>
      <legend className="sr-only">{title}</legend>
      <p aria-hidden="true" className="mb-5 text-base font-semibold text-brand-ink">
        {title}
      </p>
      {children}
    </fieldset>
  );
}

export default function Signup() {
  const router = useRouter();

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  // Erros mostrados ao lado de cada campo, no lugar de alert()
  const [errors, setErrors] = useState<{ email?: string; password?: string; terms?: string; form?: string }>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const confirmEmail = formData.get("confirmEmail") as string;

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const nextErrors: typeof errors = {};
    if (email !== confirmEmail) nextErrors.email = "Os e-mails não são iguais. Confira a digitação.";
    if (password !== confirmPassword) nextErrors.password = "As senhas não são iguais. Digite a mesma senha nos dois campos.";
    if (!acceptedTerms) nextErrors.terms = "Marque a caixa para aceitar os termos e continuar.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

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

      toast("Conta criada! Entre com seu e-mail e senha.");

      router.push("/login");
    } catch (error) {
      setErrors({ form: error instanceof Error ? error.message : "Não foi possível criar a conta." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      wide
      aside={
        <div className="max-w-sm">
          <p className="text-4xl font-semibold leading-[1.1] tracking-tight text-balance">Faça parte da comunidade</p>

          <p className="mt-4 text-base leading-relaxed text-purple-100">
            Compartilhe materiais, ajude outros estudantes e aprenda em conjunto.
          </p>

          <ul className="mt-10 space-y-6">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" className="mt-0.5 shrink-0 text-purple-200" />
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-purple-200">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-brand-ink">Crie sua conta</h1>
      <p className="mt-2 text-sm text-gray-600">
        Comece a compartilhar conhecimento gratuitamente. Campos marcados com{" "}
        <span className="font-semibold text-red-600">*</span> são obrigatórios.
      </p>

      <form onSubmit={handleSubmit} className="mt-9">
        <Section title="Acesso" first>
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <FormField id="firstName" label="Nome" required>
              <input id="firstName" name="firstName" type="text" required autoComplete="given-name" className={INPUT_CLASS} />
            </FormField>

            <FormField id="lastName" label="Sobrenome" required>
              <input id="lastName" name="lastName" type="text" required autoComplete="family-name" className={INPUT_CLASS} />
            </FormField>

            <FormField id="email" label="E-mail" required>
              <input id="email" name="email" type="email" required autoComplete="email" placeholder="seu@email.com" className={INPUT_CLASS} />
            </FormField>

            <FormField id="confirmEmail" label="Confirmar e-mail" required error={errors.email}>
              <input
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                required
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "confirmEmail-error" : undefined}
                className={INPUT_CLASS}
              />
            </FormField>

            <FormField id="password" label="Senha" required hint="Mínimo de 8 caracteres.">
              <PasswordInput
                id="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                aria-describedby="password-hint"
              />
            </FormField>

            <FormField id="confirmPassword" label="Confirmar senha" required error={errors.password}>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                label="confirmação da senha"
                required
                minLength={8}
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "confirmPassword-error" : undefined}
              />
            </FormField>
          </div>
        </Section>

        <Section title="Sobre você">
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <FormField id="cpf" label="CPF" required>
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
                className={`${INPUT_CLASS} tabular-nums`}
              />
            </FormField>

            <FormField id="phoneNumber" label="Telefone" required>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                autoComplete="tel-national"
                inputMode="numeric"
                placeholder="(00) 00000-0000"
                onChange={(event) => {
                  event.target.value = maskPhone(event.target.value);
                }}
                className={`${INPUT_CLASS} tabular-nums`}
              />
            </FormField>

            <FormField id="course" label="Curso" required className="sm:col-span-2">
              <input id="course" name="course" type="text" required placeholder="Ex.: Direito" className={INPUT_CLASS} />
            </FormField>

            <FormField id="gender" label="Gênero" required>
              <select id="gender" name="gender" required defaultValue="" className={INPUT_CLASS}>
                <option value="" disabled>
                  Selecione
                </option>
                <option value="Feminino">Feminino</option>
                <option value="Masculino">Masculino</option>
                <option value="Outro">Outro</option>
                <option value="Prefiro não informar">Prefiro não informar</option>
              </select>
            </FormField>

            <FormField id="birthDate" label="Data de nascimento" required>
              <input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                autoComplete="bday"
                max={new Date().toISOString().slice(0, 10)}
                className={INPUT_CLASS}
              />
            </FormField>
          </div>
        </Section>

        <Section title="Endereço">
          <input type="hidden" name="country" value="Brasil" />

          <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-6">
            {ADDRESS_FIELDS.map((addressField) => (
              <FormField
                key={addressField.name}
                id={addressField.name}
                label={addressField.label}
                required
                className={addressField.span}
              >
                <input
                  id={addressField.name}
                  name={addressField.name}
                  type="text"
                  required
                  autoComplete={addressField.autoComplete}
                  placeholder={addressField.placeholder}
                  inputMode={addressField.name === "zipcode" ? "numeric" : undefined}
                  onChange={
                    addressField.name === "zipcode"
                      ? (event) => {
                          event.target.value = maskCep(event.target.value);
                        }
                      : undefined
                  }
                  className={`${INPUT_CLASS} ${addressField.name === "zipcode" ? "tabular-nums" : ""}`}
                />
              </FormField>
            ))}
          </div>
        </Section>

        <div className="mt-9 border-t border-gray-200 pt-7">
          <div className="flex items-start gap-3">
            <input
              id="terms"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              aria-invalid={Boolean(errors.terms)}
              aria-describedby={errors.terms ? "terms-error" : undefined}
              className="mt-0.5 h-[1.125rem] w-[1.125rem] shrink-0 cursor-pointer rounded accent-purple-600"
            />

            <label htmlFor="terms" className="cursor-pointer text-sm leading-5 text-gray-700">
              Li e aceito os <span className="font-medium text-purple-700">Termos de Uso</span> e a{" "}
              <span className="font-medium text-purple-700">Política de Privacidade</span>
            </label>
          </div>

          {errors.terms && (
            <p id="terms-error" className="mt-2 pl-[1.875rem] text-xs text-red-600">
              {errors.terms}
            </p>
          )}
        </div>

        {errors.form && (
          <p role="alert" className="mt-6 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span className="whitespace-pre-line">{errors.form}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-7 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-purple-600 text-sm font-semibold text-white shadow-[0_1px_2px_rgb(16_24_40/0.08)] transition hover:bg-purple-700 active:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:px-8"
        >
          {submitting && <Loader2 size={17} className="animate-spin" aria-hidden="true" />}
          {submitting ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-8 border-t border-gray-200 pt-6 text-sm text-gray-600">
        Já possui uma conta?{" "}
        <Link href="/login" className="font-semibold text-purple-700 underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
