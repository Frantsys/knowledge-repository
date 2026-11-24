"use client";

import { useRef, useState } from "react";
import {
  LogOut,
  Palette,
  Trash2,
  AlertCircle,
  ArrowUpRight,
  CalendarDays,
  Camera,
  CheckCircle2,
  CreditCard,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  ShieldCheck,
  User,
} from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import PasswordInput from "@/components/password-input";
import { toast } from "@/components/toast";
import { ThemeChoice } from "@/components/theme-toggle";
import UserAvatar from "@/components/user-avatar";
import { clearToken } from "@/lib/api/client";
import { changePassword, removeAvatar, updateUser, uploadAvatar, type UserProfile } from "@/lib/api/perfil";
import { setMe, useMe } from "@/lib/api/swr";
import { maskPhone } from "@/lib/masks";
import ProfileSkeleton from "./profile-skeleton";

const STATES: [string, string][] = [
  ["AC", "Acre"], ["AL", "Alagoas"], ["AP", "Amapá"], ["AM", "Amazonas"], ["BA", "Bahia"], ["CE", "Ceará"],
  ["DF", "Distrito Federal"], ["ES", "Espírito Santo"], ["GO", "Goiás"], ["MA", "Maranhão"], ["MT", "Mato Grosso"],
  ["MS", "Mato Grosso do Sul"], ["MG", "Minas Gerais"], ["PA", "Pará"], ["PB", "Paraíba"], ["PR", "Paraná"],
  ["PE", "Pernambuco"], ["PI", "Piauí"], ["RJ", "Rio de Janeiro"], ["RN", "Rio Grande do Norte"],
  ["RS", "Rio Grande do Sul"], ["RO", "Rondônia"], ["RR", "Roraima"], ["SC", "Santa Catarina"], ["SP", "São Paulo"],
  ["SE", "Sergipe"], ["TO", "Tocantins"],
];

const MIN_PASSWORD = 8;

function roleLabel(role: string) {
  switch (role) {
    case "ROLE_STUDENT":
      return "Estudante";
    case "ROLE_MODERATOR":
      return "Moderador";
    case "ROLE_ADMIN":
      return "Administrador";
    default:
      return "Usuário";
  }
}

function formatDay(isoDate: string) {
  return new Date(`${isoDate.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR");
}

type ProfileForm = { firstName: string; lastName: string; phoneNumber: string; course: string; city: string; state: string };
const EMPTY_PASSWORDS = { currentPassword: "", newPassword: "", confirmPassword: "" };

export default function PerfilPage() {
  // Mesmo cache da navbar (SWR): sem nova busca e sem mostrar dados vazios enquanto carrega
  const { data: me, error, mutate } = useMe();

  // Sem isso, uma falha no /me deixava o esqueleto na tela para sempre
  if (!me && error) {
    return (
      <main role="alert" className="flex min-h-[calc(100dvh-4rem)] flex-col items-center justify-center bg-background px-6 text-center">
        <h1 className="text-xl font-semibold text-brand-ink">Não foi possível carregar seu perfil</h1>
        <p className="mt-2 max-w-sm whitespace-pre-line text-sm text-muted-foreground">{error.message}</p>
        <Button size="lg" variant="outline" className="mt-5" onClick={() => mutate()}>
          Tentar novamente
        </Button>
      </main>
    );
  }

  if (!me) {
    return <ProfileSkeleton />;
  }

  return <Profile me={me} />;
}

function Profile({ me }: { me: UserProfile }) {
  const fullName = `${me.firstName} ${me.lastName}`;
  const location = [me.address?.city, me.address?.state].filter(Boolean).join(" - ");

  // Foto ---------------------------------------------------------------
  const [avatarBusy, setAvatarBusy] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // A foto é salva assim que escolhida: a API confere tipo e tamanho de novo
  async function handleAvatarSelected(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast("Formato não suportado. Envie uma imagem JPG, PNG ou WEBP.", { type: "error" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast("A imagem deve ter no máximo 5 MB.", { type: "error" });
      return;
    }

    setAvatarBusy(true);

    try {
      setMe(await uploadAvatar(file));
      toast("Foto de perfil atualizada.");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Não foi possível enviar a foto.", { type: "error" });
    } finally {
      setAvatarBusy(false);
    }
  }

  async function handleAvatarRemove() {
    setAvatarBusy(true);

    try {
      setMe(await removeAvatar());
      toast("Foto de perfil removida.");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Não foi possível remover a foto.", { type: "error" });
    } finally {
      setAvatarBusy(false);
    }
  }

  // Editar perfil ------------------------------------------------------
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>({ firstName: "", lastName: "", phoneNumber: "", course: "", city: "", state: "" });

  function openEdit() {
    setForm({
      firstName: me.firstName,
      lastName: me.lastName,
      phoneNumber: me.phoneNumber,
      course: me.course,
      city: me.address?.city ?? "",
      state: me.address?.state ?? "",
    });
    setEditOpen(true);
  }

  function updateField(field: keyof ProfileForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);

    try {
      const updated = await updateUser(me.id, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber.trim(),
        course: form.course.trim(),
        address: me.address ? { ...me.address, city: form.city.trim(), state: form.state.trim() } : undefined,
      });

      setMe(updated);
      setEditOpen(false);
      toast("Perfil atualizado.");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Não foi possível salvar o perfil.", { type: "error" });
    } finally {
      setSaving(false);
    }
  }

  // Alterar senha ------------------------------------------------------
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwords, setPasswords] = useState(EMPTY_PASSWORDS);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  function openPassword() {
    setPasswords(EMPTY_PASSWORDS);
    setPasswordError("");
    setPasswordSuccess(false);
    setPasswordOpen(true);
  }

  function updatePassword(field: keyof typeof EMPTY_PASSWORDS, value: string) {
    setPasswords((current) => ({ ...current, [field]: value }));
    setPasswordError("");
    setPasswordSuccess(false);
  }

  async function handleChangePassword(event: React.FormEvent) {
    event.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (!passwords.currentPassword) return setPasswordError("Informe sua senha atual.");
    if (!passwords.newPassword) return setPasswordError("Informe a nova senha.");
    if (passwords.newPassword.length < MIN_PASSWORD) return setPasswordError(`A nova senha deve ter pelo menos ${MIN_PASSWORD} caracteres.`);
    if (passwords.newPassword !== passwords.confirmPassword) return setPasswordError("A nova senha e a confirmação não são iguais.");

    setChangingPassword(true);

    try {
      await changePassword(passwords.currentPassword, passwords.newPassword);
      setPasswordSuccess(true);
      setPasswords(EMPTY_PASSWORDS);
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Não foi possível alterar a senha.");
    } finally {
      setChangingPassword(false);
    }
  }

  const statusDot = me.isActive ? "bg-emerald-500" : "bg-muted-foreground";

  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-background">
      <main className="page-container pt-8 pb-16 lg:pt-10">
        {/* Título */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-brand-ink sm:text-3xl">Meu perfil</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
              Gerencie suas informações pessoais e a segurança da sua conta.
            </p>
          </div>
        </div>

        {/* Cartão de identidade */}
        <Card className="gap-0 overflow-hidden rounded-3xl py-0">
          <div aria-hidden="true" className="relative h-32 overflow-hidden bg-gradient-to-r from-[#32106f] via-[#6025b5] to-[#8b5cf6] sm:h-40">
            <div className="absolute -right-12 -top-28 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -right-2 -top-16 h-52 w-52 rounded-full border border-white/10" />
            <div className="absolute -bottom-32 left-[42%] h-64 w-64 rounded-full bg-white/[0.06]" />
          </div>

          <div className="relative flex flex-col gap-5 px-5 pb-6 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pb-8">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="relative -mt-12 shrink-0 sm:-mt-14">
                <UserAvatar
                  avatarUrl={me.avatarUrl}
                  name={me.firstName}
                  className="size-24 rounded-3xl border-4 border-card text-2xl shadow-lg sm:size-32 sm:text-3xl [&_[data-slot=avatar-fallback]]:rounded-3xl [&_[data-slot=avatar-image]]:rounded-3xl"
                  fallbackClassName="bg-gradient-to-br from-purple-500 to-indigo-700 text-white"
                />

                {avatarBusy && (
                  <span role="status" aria-label="Salvando foto" className="absolute inset-1 flex items-center justify-center rounded-[1.25rem] bg-black/45">
                    <Loader2 className="size-6 animate-spin text-white" aria-hidden="true" />
                  </span>
                )}

                <Button
                  type="button"
                  size="icon-lg"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarBusy}
                  aria-label={me.avatarUrl ? "Trocar foto de perfil" : "Adicionar foto de perfil"}
                  title={me.avatarUrl ? "Trocar foto" : "Adicionar foto"}
                  className="absolute -bottom-1.5 -right-1.5 size-10 rounded-2xl border-4 border-card shadow-md"
                >
                  <Camera />
                </Button>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleAvatarSelected}
                  className="sr-only"
                  tabIndex={-1}
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0 flex-1 pt-4 sm:pt-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h2 className="break-words text-xl font-bold tracking-tight sm:text-2xl">{fullName}</h2>
                  <Badge variant="secondary" className="gap-1.5 bg-accent text-accent-foreground">
                    <ShieldCheck />
                    {roleLabel(me.role)}
                  </Badge>
                </div>

                <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="size-4 shrink-0" />
                  <span className="truncate">{me.email}</span>
                </p>

                <p className="mt-2 text-xs text-muted-foreground">Membro desde {formatDay(me.createdAt)}</p>

                {me.avatarUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleAvatarRemove}
                    disabled={avatarBusy}
                    className="mt-2 -ml-2.5 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 />
                    Remover foto
                  </Button>
                )}
              </div>
            </div>

            <Button size="lg" onClick={openEdit} className="h-11 w-full px-5 font-semibold sm:w-auto">
              <Pencil />
              Editar perfil
            </Button>
          </div>
        </Card>

        <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
          {/* Informações pessoais */}
          <Card className="gap-0 rounded-3xl p-5 sm:p-7">
            <div className="mb-5">
              <div>
                <h2 className="flex items-center gap-2 text-base font-bold sm:text-lg">
                  <span className="flex size-9 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                    <User className="size-[18px]" />
                  </span>
                  Informações pessoais
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">Confira os dados vinculados à sua conta.</p>
              </div>
            </div>

            <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
              <ProfileInfo icon={<User />} label="Nome completo" value={fullName} />
              <ProfileInfo icon={<Mail />} label="E-mail" value={me.email} />
              <ProfileInfo icon={<GraduationCap />} label="Curso" value={me.course} />
              <ProfileInfo icon={<Phone />} label="Telefone" value={me.phoneNumber} />
              <ProfileInfo icon={<CreditCard />} label="CPF" value={me.cpf} />
              <ProfileInfo icon={<ShieldCheck />} label="Tipo de usuário" value={roleLabel(me.role)} />
              <ProfileInfo icon={<MapPin />} label="Localização" value={location} />
              <ProfileInfo icon={<CalendarDays />} label="Data de cadastro" value={formatDay(me.createdAt)} />
            </div>
          </Card>

          {/* Lateral: status e segurança */}
          <div className="space-y-5">
            <Card className="gap-0 rounded-3xl p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
                </span>
                <div className="min-w-0 flex-1 pt-0.5">
                  <h2 className="text-sm font-bold">Status da conta</h2>
                  <p className="mt-2 flex items-center gap-2 text-xs font-semibold">
                    <span className={`size-2 rounded-full ${statusDot}`} />
                    {me.isActive ? "Conta ativa" : "Conta inativa"}
                  </p>
                </div>
              </div>
              <p className="mt-5 text-xs leading-6 text-muted-foreground">
                {me.isActive
                  ? "Sua conta está ativa e disponível para uso na plataforma."
                  : "Sua conta está inativa no momento. Entre em contato com o suporte caso precise de ajuda."}
              </p>
            </Card>

            <Card className="gap-0 rounded-3xl p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Lock className="size-5" />
                </span>
                <div className="pt-0.5">
                  <h2 className="text-sm font-bold">Segurança</h2>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">Mantenha sua senha protegida e atualizada.</p>
                </div>
              </div>

              <Separator className="my-5" />

              <Button variant="outline" size="lg" onClick={openPassword} className="h-11 w-full justify-start font-semibold text-primary hover:text-primary">
                <Lock />
                Alterar senha
                <ArrowUpRight className="ml-auto" />
              </Button>
            </Card>

            <Card className="gap-0 rounded-3xl p-5 md:hidden">
              <div className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
                  <Palette className="size-5" />
                </span>
                <div className="pt-0.5">
                  <h2 className="text-sm font-bold">Aparência</h2>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">Escolha o tema do aplicativo.</p>
                </div>
              </div>
              <ThemeChoice className="mt-5" />

              <Separator className="my-5" />

              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  clearToken();
                  window.location.href = "/login";
                }}
                className="h-11 w-full justify-start font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut />
                Sair da conta
              </Button>
            </Card>
          </div>
        </div>
      </main>

      {/* Editar perfil */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-2xl">
          <form onSubmit={handleSaveProfile}>
            <DialogHeader className="border-b px-6 py-5">
              <DialogTitle className="text-base font-bold">Editar perfil</DialogTitle>
              <DialogDescription>Atualize suas informações pessoais.</DialogDescription>
            </DialogHeader>

            <div className="grid max-h-[65vh] gap-5 overflow-y-auto px-6 py-5 sm:grid-cols-2">
              <EditField id="edit-first-name" label="Nome" value={form.firstName} onChange={(value) => updateField("firstName", value)} autoComplete="given-name" />
              <EditField id="edit-last-name" label="Sobrenome" value={form.lastName} onChange={(value) => updateField("lastName", value)} autoComplete="family-name" />
              <EditField
                id="edit-phone"
                label="Telefone"
                value={form.phoneNumber}
                onChange={(value) => updateField("phoneNumber", maskPhone(value))}
                inputMode="numeric"
                autoComplete="tel-national"
              />
              <EditField id="edit-course" label="Curso" value={form.course} onChange={(value) => updateField("course", value)} />
              <EditField id="edit-city" label="Cidade" value={form.city} onChange={(value) => updateField("city", value)} autoComplete="address-level2" />

              <div className="space-y-2">
                <Label htmlFor="edit-state">Estado</Label>
                <Select value={form.state} onValueChange={(value) => updateField("state", value)}>
                  <SelectTrigger id="edit-state" className="h-11 w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATES.map(([uf, nome]) => (
                      <SelectItem key={uf} value={uf}>
                        {nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="edit-cpf">CPF</Label>
                <div className="relative">
                  <Input id="edit-cpf" value={me.cpf} disabled className="h-11 pr-28 tabular-nums" />
                  <Badge variant="secondary" className="absolute right-2 top-1/2 -translate-y-1/2">
                    Não editável
                  </Badge>
                </div>
              </div>
            </div>

            <DialogFooter className="mx-0 mb-0 px-6 py-4">
              <Button type="button" variant="ghost" size="lg" onClick={() => setEditOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="lg" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" /> : <Save />}
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Alterar senha */}
      <Dialog open={passwordOpen} onOpenChange={setPasswordOpen}>
        <DialogContent className="gap-0 p-0 sm:max-w-md">
          <form onSubmit={handleChangePassword}>
            <DialogHeader className="border-b px-6 py-5">
              <DialogTitle className="text-base font-bold">Alterar senha</DialogTitle>
              <DialogDescription>Atualize a senha da sua conta.</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 px-6 py-5">
              {passwordSuccess && (
                <Alert className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                  <CheckCircle2 />
                  <AlertTitle>Senha alterada com sucesso!</AlertTitle>
                  <AlertDescription className="text-current/80">A nova senha já vale para os próximos acessos.</AlertDescription>
                </Alert>
              )}

              {passwordError && (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertDescription>{passwordError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="current-password">Senha atual</Label>
                <PasswordInput
                  id="current-password"
                  label="senha atual"
                  value={passwords.currentPassword}
                  onChange={(event) => updatePassword("currentPassword", event.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nova senha</Label>
                <PasswordInput
                  id="new-password"
                  label="nova senha"
                  value={passwords.newPassword}
                  onChange={(event) => updatePassword("newPassword", event.target.value)}
                  autoComplete="new-password"
                  aria-describedby="new-password-hint"
                />
                <p id="new-password-hint" className="text-xs text-muted-foreground">
                  Mínimo de {MIN_PASSWORD} caracteres. Evite repetir senhas de outros serviços.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                <PasswordInput
                  id="confirm-password"
                  label="confirmação da senha"
                  value={passwords.confirmPassword}
                  onChange={(event) => updatePassword("confirmPassword", event.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <DialogFooter className="mx-0 mb-0 px-6 py-4">
              <Button type="button" variant="ghost" size="lg" onClick={() => setPasswordOpen(false)}>
                {passwordSuccess ? "Fechar" : "Cancelar"}
              </Button>
              <Button type="submit" size="lg" disabled={changingPassword || passwordSuccess}>
                {changingPassword ? <Loader2 className="animate-spin" /> : <Lock />}
                {changingPassword ? "Alterando..." : "Alterar senha"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ProfileInfo({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl px-2 py-2.5 transition-colors hover:bg-muted/60 sm:items-start sm:py-4">
      <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl border bg-accent text-accent-foreground [&_svg]:size-[18px]">
        {icon}
      </span>
      <div className="min-w-0 flex-1 pt-0.5">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words text-sm font-semibold leading-5 sm:mt-1.5">{value || "Não informado"}</p>
      </div>
    </div>
  );
}

function EditField({
  id,
  label,
  value,
  onChange,
  ...props
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(event) => onChange(event.target.value)} className="h-11" {...props} />
    </div>
  );
}
