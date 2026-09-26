"use client";

import { useRef, useState } from "react";

import {
  User,
  Mail,
  GraduationCap,
  Phone,
  CreditCard,
  ShieldCheck,
  CalendarDays,
  MapPin,
  Pencil,
  X,
  Save,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Camera,
  ImagePlus,
  Trash2,
} from "lucide-react";

import Navbar from "@/components/navbar";

type UserProfile = {
  id: number;
  cpf: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  course: string;
  role: string;
  createdAt: string;
  isActive: boolean;
  city: string;
  state: string;
  profileImage: string | null;
};

const initialUser: UserProfile = {
  id: 1,
  cpf: "123.456.789-00",
  firstName: "Gilberto",
  lastName: "Silva",
  email: "gilberto.silva@email.com",
  phoneNumber: "(83) 99999-9999",
  course: "Análise e Desenvolvimento de Sistemas",
  role: "ROLE_STUDENT",
  createdAt: "2026-03-15",
  isActive: true,
  city: "Patos",
  state: "PB",
  profileImage: null,
};

/*
 * GET /v1/api/users/me
 *
 * PUT /v1/api/users/me
 *
 * POST /v1/api/users/change-password
 *
 * Foto de perfil:
 *
 * const formData = new FormData();
 * formData.append("profileImage", file);
 *
 */

function getRoleLabel(role: string) {
  switch (role) {
    case "ROLE_STUDENT":
      return "Estudante";

    case "ROLE_TEACHER":
      return "Professor";

    case "ROLE_ADMIN":
      return "Administrador";

    default:
      return "Usuário";
  }
}

export default function PerfilPage() {
  const [user, setUser] = useState<UserProfile>(initialUser);

  const [editModalOpen, setEditModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    firstName: initialUser.firstName,
    lastName: initialUser.lastName,
    email: initialUser.email,
    phoneNumber: initialUser.phoneNumber,
    course: initialUser.course,
    city: initialUser.city,
    state: initialUser.state,
  });

  const [profileImage, setProfileImage] = useState<string | null>(
    initialUser.profileImage
  );

  const [selectedImageFile, setSelectedImageFile] =
    useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  function handleOpenEdit() {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      course: user.course,
      city: user.city,
      state: user.state,
    });

    setEditModalOpen(true);
  }

  function handleInputChange(
    field: keyof typeof formData,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImageSelect(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve possuir no máximo 5 MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    if (profileImage?.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }

    setSelectedImageFile(file);
    setProfileImage(imageUrl);

    /*
     * API futuramente:
     *
     * const formData = new FormData();
     * formData.append("profileImage", file);
     *
     * await updateProfileImage(token, formData);
     */
  }

  function handleRemoveImage() {
    if (profileImage?.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }

    setProfileImage(null);
    setSelectedImageFile(null);

    /*
     * API futuramente:
     *
     * await removeProfileImage(token);
     */
  }

  function handleOpenImageSelector() {
    fileInputRef.current?.click();
  }

  function handleSaveProfile() {
    /*
     * API futuramente:
     *
     * const updatedUser = await updateProfile(
     *   token,
     *   formData
     * );
     *
     * setUser(updatedUser);
     *
     * await updateProfileImage(token, selectedImageFile);
     */

    setUser((current) => ({
      ...current,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      course: formData.course,
      city: formData.city,
      state: formData.state,
      profileImage: profileImage,
    }));

    setSelectedImageFile(null);
    setEditModalOpen(false);
  }

  function handleOpenPasswordModal() {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordError("");
    setPasswordSuccess(false);

    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);

    setPasswordModalOpen(true);
  }

  function handlePasswordChange(
    field: keyof typeof passwordData,
    value: string
  ) {
    setPasswordData((current) => ({
      ...current,
      [field]: value,
    }));

    setPasswordError("");
    setPasswordSuccess(false);
  }

  function handleChangePassword() {
    setPasswordError("");
    setPasswordSuccess(false);

    if (!passwordData.currentPassword) {
      setPasswordError("Informe sua senha atual.");
      return;
    }

    if (!passwordData.newPassword) {
      setPasswordError("Informe a nova senha.");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(
        "A nova senha deve possuir pelo menos 6 caracteres."
      );
      return;
    }

    if (!passwordData.confirmPassword) {
      setPasswordError("Confirme sua nova senha.");
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "A nova senha e a confirmação não são iguais."
      );
      return;
    }

    /*
     * API futuramente:
     *
     * await changePassword(token, {
     *   currentPassword: passwordData.currentPassword,
     *   newPassword: passwordData.newPassword,
     * });
     */

    setPasswordSuccess(true);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }

  function handleClosePasswordModal() {
    setPasswordModalOpen(false);

    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setPasswordError("");
    setPasswordSuccess(false);
  }

  const fullName = `${user.firstName} ${user.lastName}`;

  const initials = `${user.firstName.charAt(
    0
  )}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#f7f6fb]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* CABEÇALHO */}
        <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-purple-600">
            Minha conta
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Meu perfil
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-500">
            Visualize suas informações pessoais e mantenha seus
            dados atualizados.
          </p>
        </div>

        {/* CARD PRINCIPAL DO PERFIL */}
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* ÁREA ROXA */}
          <div
            className="
              relative h-28 overflow-hidden
              bg-gradient-to-r from-purple-800
              via-purple-600 to-indigo-500
              sm:h-32
            "
          >
            <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-white/10" />

            <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/5" />

            <div className="absolute right-8 top-5 h-16 w-16 rounded-full border border-white/10 sm:right-10 sm:top-8 sm:h-20 sm:w-20" />
          </div>

          {/* =================================================
              ÁREA BRANCA

              Avatar + informações ficam NA MESMA LINHA.
          ================================================== */}

          <div className="relative px-5 pb-6 pt-0 sm:px-8">

            <div
              className="
                flex flex-wrap
                items-center
                justify-between
                gap-4
              "
            >

              {/* AVATAR + INFORMAÇÕES */}
              <div className="flex min-w-0 flex-1 items-center gap-4">

                {/* AVATAR */}
                <div className="-mt-12 shrink-0 sm:-mt-14">
                  <div className="relative">

                    <div
                      className="
                        flex h-24 w-24
                        items-center justify-center
                        overflow-hidden rounded-2xl
                        border-4 border-white
                        bg-purple-600
                        text-2xl font-bold
                        text-white shadow-lg
                        sm:h-28 sm:w-28
                      "
                    >
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={`Foto de perfil de ${fullName}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleOpenEdit}
                      className="
                        absolute -bottom-2 -right-2
                        flex h-9 w-9
                        items-center justify-center
                        rounded-full
                        border-2 border-white
                        bg-purple-600
                        text-white shadow-md
                        transition
                        hover:bg-purple-700
                      "
                      aria-label="Alterar foto de perfil"
                    >
                      <Camera size={16} />
                    </button>
                  </div>
                </div>

                {/* =================================================
                    INFORMAÇÕES AO LADO DO AVATAR

                    Gilberto Silva
                    Estudante
                    email
                ================================================== */}

                <div className="min-w-0 flex-1 py-4">

                  <div className="flex flex-wrap items-center gap-2">

                    <h2 className="text-lg font-bold text-gray-900 sm:text-2xl">
                      {fullName}
                    </h2>

                    <span className="shrink-0 rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-semibold text-purple-600">
                      {getRoleLabel(user.role)}
                    </span>
                  </div>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              {/* BOTÃO EDITAR */}
              <button
                type="button"
                onClick={handleOpenEdit}
                className="
                  flex h-10 shrink-0
                  items-center justify-center gap-2
                  rounded-lg
                  border border-purple-500
                  bg-white px-4
                  text-sm font-medium
                  text-purple-600
                  transition
                  hover:bg-purple-50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-purple-500/20
                "
              >
                <Pencil size={16} />
                Editar perfil
              </button>
            </div>
          </div>
        </section>

        {/* INFORMAÇÕES */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">

            <div className="mb-7">

              <h2 className="text-lg font-semibold text-gray-900">
                Informações pessoais
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Dados cadastrados na sua conta.
              </p>
            </div>

            <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">

              <ProfileInfo
                icon={<User size={17} />}
                label="Nome completo"
                value={fullName}
              />

              <ProfileInfo
                icon={<Mail size={17} />}
                label="E-mail"
                value={user.email}
              />

              <ProfileInfo
                icon={<GraduationCap size={17} />}
                label="Curso"
                value={user.course}
              />

              <ProfileInfo
                icon={<Phone size={17} />}
                label="Telefone"
                value={user.phoneNumber}
              />

              <ProfileInfo
                icon={<CreditCard size={17} />}
                label="CPF"
                value={user.cpf}
              />

              <ProfileInfo
                icon={<ShieldCheck size={17} />}
                label="Tipo de usuário"
                value={getRoleLabel(user.role)}
              />

              <ProfileInfo
                icon={<MapPin size={17} />}
                label="Localização"
                value={`${user.city} - ${user.state}`}
              />

              <ProfileInfo
                icon={<CalendarDays size={17} />}
                label="Data de cadastro"
                value={new Date(user.createdAt).toLocaleDateString(
                  "pt-BR"
                )}
              />

            </div>
          </section>

          {/* SIDEBAR */}
          <div className="space-y-6">

            {/* STATUS */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Status da conta
                  </h2>

                  <div className="mt-2 flex items-center gap-2">

                    <span className="h-2 w-2 rounded-full bg-green-500" />

                    <span className="text-xs font-semibold text-green-600">
                      {user.isActive
                        ? "Conta ativa"
                        : "Conta inativa"}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-relaxed text-gray-500">
                Sua conta está ativa e disponível para utilização
                na plataforma.
              </p>
            </section>

            {/* SEGURANÇA */}
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

              <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Lock size={18} />
                </div>

                <div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    Segurança
                  </h2>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Seus dados pessoais são protegidos pela
                    plataforma.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenPasswordModal}
                className="
                  mt-4 w-full rounded-lg
                  border border-gray-200
                  px-3 py-2.5 text-xs
                  font-medium text-gray-700
                  transition
                  hover:border-purple-300
                  hover:bg-purple-50
                  hover:text-purple-600
                "
              >
                Alterar senha
              </button>
            </section>
          </div>
        </div>
      </main>

      {/* INPUT DA FOTO */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* =====================================================
          MODAL EDITAR PERFIL
      ====================================================== */}

      {editModalOpen && (
        <div
          className="
            fixed inset-0 z-[100]
            flex items-center justify-center
            bg-black/40 p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setEditModalOpen(false);
            }
          }}
        >
          <div
            className="
              w-full max-w-2xl
              overflow-hidden
              rounded-2xl
              bg-white
              shadow-2xl
            "
          >

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">

              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  Editar perfil
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Atualize suas informações pessoais.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg text-gray-500
                  transition
                  hover:bg-gray-100
                  hover:text-gray-700
                "
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">

              {/* FOTO */}
              <div
                className="
                  mb-6 flex flex-col
                  items-center rounded-xl
                  border border-gray-100
                  bg-gray-50/70 p-5
                  sm:flex-row sm:items-center
                  sm:gap-5
                "
              >

                <div className="relative shrink-0">

                  <div
                    className="
                      flex h-24 w-24
                      items-center justify-center
                      overflow-hidden rounded-2xl
                      bg-purple-600
                      text-2xl font-bold
                      text-white shadow-sm
                    "
                  >
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Pré-visualização da foto de perfil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div
                    className="
                      absolute -bottom-2 -right-2
                      flex h-8 w-8
                      items-center justify-center
                      rounded-full border-2
                      border-white
                      bg-purple-600
                      text-white
                    "
                  >
                    <Camera size={14} />
                  </div>
                </div>

                <div className="mt-4 text-center sm:mt-0 sm:text-left">

                  <p className="text-sm font-semibold text-gray-900">
                    Foto de perfil
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Adicione uma foto para personalizar seu
                    perfil. Caso não tenha uma, suas iniciais
                    serão exibidas.
                  </p>

                  <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">

                    <button
                      type="button"
                      onClick={handleOpenImageSelector}
                      className="
                        flex h-9 items-center gap-2
                        rounded-lg bg-purple-600
                        px-3 text-xs font-medium
                        text-white transition
                        hover:bg-purple-700
                      "
                    >
                      <ImagePlus size={15} />

                      {profileImage
                        ? "Trocar foto"
                        : "Adicionar foto"}
                    </button>

                    {profileImage && (
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="
                          flex h-9 items-center gap-2
                          rounded-lg border
                          border-gray-200
                          bg-white px-3
                          text-xs font-medium
                          text-gray-600
                          transition
                          hover:border-red-200
                          hover:bg-red-50
                          hover:text-red-600
                        "
                      >
                        <Trash2 size={15} />
                        Remover
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-[10px] text-gray-400">
                    JPG, PNG ou WEBP • máximo 5 MB
                  </p>
                </div>
              </div>

              {/* CAMPOS */}
              <div className="grid gap-5 sm:grid-cols-2">

                <EditField
                  label="Nome"
                  value={formData.firstName}
                  onChange={(value) =>
                    handleInputChange("firstName", value)
                  }
                />

                <EditField
                  label="Sobrenome"
                  value={formData.lastName}
                  onChange={(value) =>
                    handleInputChange("lastName", value)
                  }
                />

                <EditField
                  label="E-mail"
                  type="email"
                  value={formData.email}
                  onChange={(value) =>
                    handleInputChange("email", value)
                  }
                />

                <EditField
                  label="Telefone"
                  value={formData.phoneNumber}
                  onChange={(value) =>
                    handleInputChange("phoneNumber", value)
                  }
                />

                <div className="sm:col-span-2">
                  <EditField
                    label="Curso"
                    value={formData.course}
                    onChange={(value) =>
                      handleInputChange("course", value)
                    }
                  />
                </div>

                <EditField
                  label="Cidade"
                  value={formData.city}
                  onChange={(value) =>
                    handleInputChange("city", value)
                  }
                />

                <div>
                  <label
                    htmlFor="profile-state"
                    className="mb-1.5 block text-xs font-medium text-gray-700"
                  >
                    Estado
                  </label>

                  <select
                    id="profile-state"
                    value={formData.state}
                    onChange={(event) =>
                      handleInputChange(
                        "state",
                        event.target.value
                      )
                    }
                    className="
                      h-10 w-full rounded-lg
                      border border-gray-300
                      bg-white px-3 text-sm
                      text-gray-800 outline-none
                      transition
                      focus:border-purple-500
                      focus:ring-2
                      focus:ring-purple-500/10
                    "
                  >
                    <option value="PB">Paraíba</option>
                    <option value="PE">Pernambuco</option>
                    <option value="RN">
                      Rio Grande do Norte
                    </option>
                    <option value="CE">Ceará</option>
                    <option value="BA">Bahia</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                  </select>
                </div>

                <div className="sm:col-span-2">

                  <label className="mb-1.5 block text-xs font-medium text-gray-700">
                    CPF
                  </label>

                  <div className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3">

                    <CreditCard
                      size={15}
                      className="text-gray-400"
                    />

                    <span className="text-sm text-gray-500">
                      {user.cpf}
                    </span>

                    <span className="ml-auto text-[10px] font-medium text-gray-400">
                      Não editável
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTÕES */}
            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="
                  h-10 rounded-lg px-4
                  text-xs font-medium
                  text-gray-600
                  transition hover:bg-gray-100
                "
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                className="
                  flex h-10 items-center
                  justify-center gap-2
                  rounded-lg bg-purple-600
                  px-5 text-xs font-medium
                  text-white transition
                  hover:bg-purple-700
                  focus:outline-none
                  focus:ring-2
                  focus:ring-purple-500/20
                "
              >
                <Save size={15} />
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL ALTERAR SENHA
      ====================================================== */}

      {passwordModalOpen && (
        <div
          className="
            fixed inset-0 z-[110]
            flex items-center justify-center
            bg-black/40 p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              handleClosePasswordModal();
            }
          }}
        >
          <div
            className="
              w-full max-w-md
              overflow-hidden rounded-2xl
              bg-white shadow-2xl
            "
          >

            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Lock size={18} />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Alterar senha
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Atualize a senha da sua conta.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClosePasswordModal}
                className="
                  flex h-8 w-8
                  items-center justify-center
                  rounded-lg text-gray-500
                  transition hover:bg-gray-100
                  hover:text-gray-700
                "
                aria-label="Fechar"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 sm:p-6">

              {passwordSuccess && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-3">

                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div>
                    <p className="text-sm font-medium text-green-700">
                      Senha alterada com sucesso!
                    </p>

                    <p className="mt-1 text-xs text-green-600">
                      A nova senha foi definida para sua conta.
                    </p>
                  </div>
                </div>
              )}

              {passwordError && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3">

                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <p className="text-xs leading-relaxed text-red-600">
                    {passwordError}
                  </p>
                </div>
              )}

              <div className="space-y-5">

                <PasswordField
                  id="current-password"
                  label="Senha atual"
                  value={passwordData.currentPassword}
                  visible={showCurrentPassword}
                  onChange={(value) =>
                    handlePasswordChange(
                      "currentPassword",
                      value
                    )
                  }
                  onToggle={() =>
                    setShowCurrentPassword(
                      (current) => !current
                    )
                  }
                />

                <PasswordField
                  id="new-password"
                  label="Nova senha"
                  value={passwordData.newPassword}
                  visible={showNewPassword}
                  onChange={(value) =>
                    handlePasswordChange(
                      "newPassword",
                      value
                    )
                  }
                  onToggle={() =>
                    setShowNewPassword(
                      (current) => !current
                    )
                  }
                />

                <PasswordField
                  id="confirm-password"
                  label="Confirmar nova senha"
                  value={passwordData.confirmPassword}
                  visible={showConfirmPassword}
                  onChange={(value) =>
                    handlePasswordChange(
                      "confirmPassword",
                      value
                    )
                  }
                  onToggle={() =>
                    setShowConfirmPassword(
                      (current) => !current
                    )
                  }
                />

                <p className="text-xs leading-relaxed text-gray-400">
                  A senha deve possuir pelo menos 6 caracteres.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">

              <button
                type="button"
                onClick={handleClosePasswordModal}
                className="
                  h-10 rounded-lg px-4
                  text-xs font-medium
                  text-gray-600
                  transition hover:bg-gray-100
                "
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleChangePassword}
                disabled={passwordSuccess}
                className="
                  flex h-10 items-center
                  justify-center gap-2
                  rounded-lg bg-purple-600
                  px-5 text-xs font-medium
                  text-white transition
                  hover:bg-purple-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <Lock size={15} />
                Alterar senha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   COMPONENTE - INFORMAÇÃO DO PERFIL
========================================================= */

function ProfileInfo({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-xs font-medium text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-gray-800">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   COMPONENTE - CAMPO DE EDIÇÃO
========================================================= */

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="
          h-10 w-full rounded-lg
          border border-gray-300
          bg-white px-3
          text-sm text-gray-800
          outline-none transition
          placeholder:text-gray-400
          focus:border-purple-500
          focus:ring-2
          focus:ring-purple-500/10
        "
      />
    </div>
  );
}

/* =========================================================
   COMPONENTE - CAMPO DE SENHA
========================================================= */

function PasswordField({
  id,
  label,
  value,
  visible,
  onChange,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  visible: boolean;
  onChange: (value: string) => void;
  onToggle: () => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="relative">

        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="
            h-10 w-full rounded-lg
            border border-gray-300
            bg-white px-3 pr-10
            text-sm text-gray-800
            outline-none transition
            placeholder:text-gray-400
            focus:border-purple-500
            focus:ring-2
            focus:ring-purple-500/10
          "
          placeholder="Digite sua senha"
        />

        <button
          type="button"
          onClick={onToggle}
          className="
            absolute right-0 top-0
            flex h-10 w-10
            items-center justify-center
            text-gray-400 transition
            hover:text-purple-600
          "
          aria-label={
            visible
              ? "Ocultar senha"
              : "Mostrar senha"
          }
        >
          {visible ? (
            <EyeOff size={17} />
          ) : (
            <Eye size={17} />
          )}
        </button>
      </div>
    </div>
  );
}