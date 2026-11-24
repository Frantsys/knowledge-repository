"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Search, Share2, Users } from "lucide-react";
import { createUser } from "@/lib/api/signup";
import { toast } from "@/components/toast";
import AuthShell from "@/components/auth-shell";
import FormField from "@/components/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
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

const STEPS = ["Acesso", "Sobre você", "Endereço"];

type AddressLookup = { logradouro?: string; bairro?: string; localidade?: string; uf?: string; erro?: boolean };

// No celular, cada seção é uma etapa: só a etapa atual aparece (no desktop, todas ficam visíveis)
function Section({
  title,
  first = false,
  hiddenOnMobile = false,
  sectionRef,
  children,
}: {
  title: string;
  first?: boolean;
  hiddenOnMobile?: boolean;
  sectionRef?: React.Ref<HTMLFieldSetElement>;
  children: React.ReactNode;
}) {
  return (
    <fieldset
      ref={sectionRef}
      className={cn(!first && "mt-9 border-t border-border pt-7 max-sm:mt-0 max-sm:border-0 max-sm:pt-0", hiddenOnMobile && "max-sm:hidden")}
    >
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
  const [step, setStep] = useState(0);
  const [cepStatus, setCepStatus] = useState<"loading" | "notfound" | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRefs = useRef<(HTMLFieldSetElement | null)[]>([]);

  // Confere e-mail e senha repetidos (usado ao sair da 1ª etapa e ao enviar)
  function accessErrors(formData: FormData) {
    const nextErrors: typeof errors = {};
    if (formData.get("email") !== formData.get("confirmEmail")) nextErrors.email = "Os e-mails não são iguais. Confira a digitação.";
    if (formData.get("password") !== formData.get("confirmPassword"))
      nextErrors.password = "As senhas não são iguais. Digite a mesma senha nos dois campos.";
    return nextErrors;
  }

  function goToStep(next: number) {
    setStep(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Avança só se os campos da etapa atual forem válidos (mesmas regras do envio)
  function nextStep() {
    const fields = sectionRefs.current[step]?.querySelectorAll<HTMLInputElement | HTMLSelectElement>("input, select") ?? [];
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return;
      }
    }

    if (step === 0) {
      const nextErrors = accessErrors(new FormData(formRef.current!));
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;
    }

    goToStep(step + 1);
  }

  // CEP completo: preenche rua, bairro, cidade e estado pelo ViaCEP e leva o foco ao número
  async function lookupCep(cep: string) {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) return;

    setCepStatus("loading");
    try {
      const response = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data: AddressLookup = await response.json();
      if (data.erro) {
        setCepStatus("notfound");
        return;
      }

      const form = formRef.current!;
      const fill = (name: string, value?: string) => {
        const input = form.elements.namedItem(name) as HTMLInputElement | null;
        if (input && value) input.value = value;
      };
      fill("street", data.logradouro);
      fill("district", data.bairro);
      fill("city", data.localidade);
      fill("state", data.uf);
      setCepStatus(null);
      (form.elements.namedItem("number") as HTMLInputElement | null)?.focus();
    } catch {
      // Sem conexão com o ViaCEP: a pessoa preenche o endereço à mão
      setCepStatus(null);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const nextErrors = accessErrors(formData);
    if (!acceptedTerms) nextErrors.terms = "Marque a caixa para aceitar os termos e continuar.";

    setErrors(nextErrors);
    // No celular, o erro de e-mail ou senha fica na 1ª etapa: volta para lá
    if (nextErrors.email || nextErrors.password) setStep(0);
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

          <p className="mt-4 text-base leading-relaxed text-white/80">
            Compartilhe materiais, ajude outros estudantes e aprenda em conjunto.
          </p>

          <ul className="mt-10 space-y-6">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <Icon size={20} strokeWidth={1.8} aria-hidden="true" className="mt-0.5 shrink-0 text-white/80" />
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-0.5 text-sm text-white/80">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      }
    >
      <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-brand-ink">Crie sua conta</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Comece a compartilhar conhecimento gratuitamente. Campos marcados com{" "}
        <span className="font-semibold text-destructive">*</span> são obrigatórios.
      </p>

      {/* Progresso das etapas (só no celular) */}
      <div className="mt-6 sm:hidden" aria-live="polite">
        <p className="text-xs font-medium text-muted-foreground">
          Etapa {step + 1} de {STEPS.length} · <span className="text-foreground">{STEPS[step]}</span>
        </p>
        <div className="mt-2 grid grid-cols-3 gap-1.5" aria-hidden="true">
          {STEPS.map((title, index) => (
            <span key={title} className={cn("h-1 rounded-full transition-colors", index <= step ? "bg-primary" : "bg-muted")} />
          ))}
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-9 max-sm:mt-6">
        <Section title="Acesso" first hiddenOnMobile={step !== 0} sectionRef={(el) => { sectionRefs.current[0] = el; }}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <FormField id="firstName" label="Nome" required>
              <Input id="firstName" name="firstName" type="text" required autoComplete="given-name" className="h-11" />
            </FormField>

            <FormField id="lastName" label="Sobrenome" required>
              <Input id="lastName" name="lastName" type="text" required autoComplete="family-name" className="h-11" />
            </FormField>

            <FormField id="email" label="E-mail" required>
              <Input id="email" name="email" type="email" required autoComplete="email" placeholder="seu@email.com" className="h-11" />
            </FormField>

            <FormField id="confirmEmail" label="Confirmar e-mail" required error={errors.email}>
              <Input
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                required
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "confirmEmail-error" : undefined}
                className="h-11"
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

        <Section title="Sobre você" hiddenOnMobile={step !== 1} sectionRef={(el) => { sectionRefs.current[1] = el; }}>
          <div className="grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2">
            <FormField id="cpf" label="CPF" required>
              <Input
                id="cpf"
                name="cpf"
                type="text"
                required
                inputMode="numeric"
                placeholder="000.000.000-00"
                onChange={(event) => {
                  event.target.value = maskCpf(event.target.value);
                }}
                className="h-11 tabular-nums"
              />
            </FormField>

            <FormField id="phoneNumber" label="Telefone" required>
              <Input
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
                className="h-11 tabular-nums"
              />
            </FormField>

            <FormField id="course" label="Curso" required className="sm:col-span-2">
              <Input id="course" name="course" type="text" required placeholder="Ex.: Direito" className="h-11" />
            </FormField>

            <FormField id="gender" label="Gênero" required>
              <Select name="gender" required>
                <SelectTrigger id="gender" className="h-11 w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                  <SelectItem value="Outro">Outro</SelectItem>
                  <SelectItem value="Prefiro não informar">Prefiro não informar</SelectItem>
                </SelectContent>
              </Select>
            </FormField>

            <FormField id="birthDate" label="Data de nascimento" required>
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                required
                autoComplete="bday"
                max={new Date().toISOString().slice(0, 10)}
                className="h-11"
              />
            </FormField>
          </div>
        </Section>

        <Section title="Endereço" hiddenOnMobile={step !== 2} sectionRef={(el) => { sectionRefs.current[2] = el; }}>
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
                <Input
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
                          lookupCep(event.target.value);
                        }
                      : undefined
                  }
                  className={cn("h-11", addressField.name === "zipcode" && "tabular-nums")}
                />
              </FormField>
            ))}
          </div>

          {cepStatus && (
            <p role="status" className="mt-3 text-xs text-muted-foreground">
              {cepStatus === "loading" ? "Buscando endereço pelo CEP..." : "CEP não encontrado. Preencha o endereço manualmente."}
            </p>
          )}
        </Section>

        {/* Navegação entre etapas (só no celular) */}
        {step < STEPS.length - 1 && (
          <div className="mt-8 flex gap-3 sm:hidden">
            {step > 0 && (
              <Button type="button" variant="outline" size="lg" className="h-11 flex-1" onClick={() => goToStep(step - 1)}>
                <ArrowLeft />
                Voltar
              </Button>
            )}
            <Button type="button" size="lg" className="h-11 flex-[2] font-semibold" onClick={nextStep}>
              Continuar
              <ArrowRight />
            </Button>
          </div>
        )}

        <div className={cn(step !== STEPS.length - 1 && "max-sm:hidden")}>
        <div className="mt-9 border-t border-border pt-7">
          <div className="flex items-start gap-3">
            <Checkbox
              id="terms"
              checked={acceptedTerms}
              onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
              aria-invalid={Boolean(errors.terms)}
              aria-describedby={errors.terms ? "terms-error" : undefined}
              className="relative mt-0.5 after:absolute after:-inset-3.5 after:content-['']"
            />

            <Label htmlFor="terms" className="inline cursor-pointer font-normal leading-5 text-foreground/90">
              Li e aceito os <span className="font-medium text-primary">Termos de Uso</span> e a{" "}
              <span className="font-medium text-primary">Política de Privacidade</span>
            </Label>
          </div>

          {errors.terms && (
            <p id="terms-error" className="mt-2 pl-7 text-xs text-destructive">
              {errors.terms}
            </p>
          )}
        </div>

        {errors.form && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle />
            <AlertDescription className="whitespace-pre-line">{errors.form}</AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={submitting}
          className="mt-7 h-11 w-full text-sm font-semibold sm:w-auto sm:px-8"
        >
          {submitting && <Loader2 className="animate-spin" aria-hidden="true" />}
          {submitting ? "Criando conta..." : "Criar conta"}
        </Button>

        <Button type="button" variant="ghost" className="mt-2 w-full text-muted-foreground sm:hidden" onClick={() => goToStep(step - 1)}>
          <ArrowLeft />
          Voltar
        </Button>
        </div>
      </form>

      <p className="mt-8 border-t border-border pt-6 text-sm text-muted-foreground">
        Já possui uma conta?{" "}
        <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
          Entrar
        </Link>
      </p>
    </AuthShell>
  );
}
