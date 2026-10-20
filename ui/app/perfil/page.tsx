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
 ArrowUpRight,
 Sparkles,
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
 firstName: "Eliza",
 lastName: "Medeiros",
 email: "eliza.medeiros@email.com",
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
   <div className="min-h-screen bg-[#f8f7fc] text-gray-900">
     <Navbar />


     <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
       <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
         <div>
           <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-purple-700">
             <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100">
               <User size={15} />
             </span>
             <span className="uppercase tracking-[0.16em]">
               Minha conta
             </span>
           </div>


           <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
             Meu perfil
           </h1>


           <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
             Gerencie suas informações pessoais e suas
             preferências de segurança em um só lugar.
           </p>
         </div>


         <div className="flex w-fit items-center gap-2 rounded-xl border border-purple-100 bg-white px-3.5 py-2.5 shadow-sm">
           <span className="relative flex h-2.5 w-2.5">
             <span
               className={`absolute inline-flex h-full w-full rounded-full opacity-40 ${
                 user.isActive ? "bg-emerald-500" : "bg-gray-400"
               }`}
             />
             <span
               className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                 user.isActive ? "bg-emerald-500" : "bg-gray-400"
               }`}
             />
           </span>
           <span className="text-xs font-semibold text-gray-700">
             {user.isActive ? "Conta ativa" : "Conta inativa"}
           </span>
         </div>
       </div>


       <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_8px_35px_-20px_rgba(55,35,100,0.24)]">
         <div className="relative h-32 overflow-hidden bg-gradient-to-r from-[#32106f] via-[#6025b5] to-[#8b5cf6] sm:h-40">
           <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />


           <div className="absolute -right-12 -top-28 h-72 w-72 rounded-full border border-white/10" />
           <div className="absolute -right-2 -top-16 h-52 w-52 rounded-full border border-white/10" />
           <div className="absolute -bottom-32 left-[42%] h-64 w-64 rounded-full bg-white/[0.06]" />
           <div className="absolute right-[30%] top-5 h-12 w-12 rounded-2xl border border-white/10 rotate-12" />


           <div className="absolute left-6 top-5 flex items-center gap-2 text-xs font-medium text-white/80 sm:left-8 sm:top-7">
             <Sparkles size={14} />
             <span>Seu espaço pessoal</span>
           </div>
         </div>


         <div className="relative px-5 pb-6 pt-0 sm:px-8 sm:pb-8">
           <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
             <div className="flex min-w-0 items-center gap-4 sm:gap-5">
               <div className="-mt-12 shrink-0 sm:-mt-14">
                 <div className="relative">
                   <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-br from-purple-500 to-indigo-700 text-2xl font-bold text-white shadow-lg shadow-purple-950/15 sm:h-32 sm:w-32 sm:text-3xl">
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
                     className="absolute -bottom-1.5 -right-1.5 flex h-10 w-10 items-center justify-center rounded-2xl border-4 border-white bg-purple-600 text-white shadow-md transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                     aria-label="Alterar foto de perfil"
                   >
                     <Camera size={16} />
                   </button>
                 </div>
               </div>


               <div className="min-w-0 flex-1 pb-1 pt-4 sm:pt-5">
                 <div className="flex flex-wrap items-center gap-2.5">
                   <h2 className="break-words text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
                     {fullName}
                   </h2>


                   <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-100 bg-purple-50 px-3 py-1 text-[11px] font-semibold text-purple-700">
                     <ShieldCheck size={13} />
                     {getRoleLabel(user.role)}
                   </span>
                 </div>


                 <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-gray-500">
                   <Mail size={15} className="shrink-0 text-purple-400" />
                   <span className="truncate">{user.email}</span>
                 </p>


                 <p className="mt-2 text-xs text-gray-400">
                   Membro desde{" "}
                   {new Date(`${user.createdAt}T12:00:00`).toLocaleDateString(
                     "pt-BR"
                   )}
                 </p>
               </div>
             </div>
             <button
               type="button"
               onClick={handleOpenEdit}
               className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white shadow-sm shadow-purple-600/20 transition hover:-translate-y-0.5 hover:bg-purple-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
             >
               <Pencil size={16} />
               Editar perfil
               <ArrowUpRight size={15} className="ml-1 text-purple-200" />
             </button>
           </div>
         </div>
       </section>


       <div className="mt-7 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_310px]">
         <section className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-[0_8px_35px_-24px_rgba(55,35,100,0.20)] sm:p-7">
           <div className="mb-7 flex items-start justify-between gap-3">
             <div>
               <div className="flex items-center gap-2">
                 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                   <User size={17} />
                 </div>


                 <h2 className="text-base font-bold text-gray-950 sm:text-lg">
                   Informações pessoais
                 </h2>
               </div>


               <p className="mt-2 text-sm text-gray-500">
                 Confira os dados vinculados à sua conta.
               </p>
             </div>


             <button
               type="button"
               onClick={handleOpenEdit}
               className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-500 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
               aria-label="Editar informações pessoais"
             >
               <Pencil size={15} />
             </button>
           </div>


           <div className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
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
               value={new Date(`${user.createdAt}T12:00:00`).toLocaleDateString(
                 "pt-BR"
               )}
             />
           </div>
         </section>


         <div className="space-y-5">
           <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_8px_35px_-24px_rgba(55,35,100,0.20)]">
             <div className="h-1 bg-gradient-to-r from-emerald-400 to-teal-500" />


             <div className="p-5 sm:p-6">
               <div className="flex items-start gap-3">
                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                   <CheckCircle2 size={20} />
                 </div>


                 <div className="min-w-0 flex-1 pt-0.5">
                   <h2 className="text-sm font-bold text-gray-950">
                     Status da conta
                   </h2>


                   <div className="mt-2 flex items-center gap-2">
                     <span
                       className={`h-2 w-2 rounded-full ${
                         user.isActive ? "bg-emerald-500" : "bg-gray-400"
                       }`}
                     />


                     <span
                       className={`text-xs font-semibold ${
                         user.isActive ? "text-emerald-700" : "text-gray-500"
                       }`}
                     >
                       {user.isActive ? "Conta ativa" : "Conta inativa"}
                     </span>
                   </div>
                 </div>
               </div>


               <p className="mt-5 text-xs leading-6 text-gray-500">
                 {user.isActive
                   ? "Sua conta está ativa e disponível para utilização na plataforma."
                   : "Sua conta está inativa no momento. Entre em contato com o suporte caso precise de ajuda."}
               </p>
             </div>
           </section>


           <section className="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-[0_8px_35px_-24px_rgba(55,35,100,0.20)]">
             <div className="h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />


             <div className="p-5 sm:p-6">
               <div className="flex items-start gap-3">
                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                   <Lock size={19} />
                 </div>


                 <div className="pt-0.5">
                   <h2 className="text-sm font-bold text-gray-950">
                     Segurança
                   </h2>


                   <p className="mt-2 text-xs leading-5 text-gray-500">
                     Mantenha suas credenciais protegidas e atualizadas.
                   </p>
                 </div>
               </div>


               <div className="my-5 border-t border-gray-100" />


               <div className="mb-4 flex items-center gap-2 text-xs text-gray-500">
                 <ShieldCheck size={15} className="text-purple-500" />
                 <span>Proteção de acesso à conta</span>
               </div>


               <button
                 type="button"
                 onClick={handleOpenPasswordModal}
                 className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50/60 px-4 text-sm font-semibold text-purple-700 transition hover:border-purple-300 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
               >
                 <Lock size={15} />
                 Alterar senha
                 <ArrowUpRight size={15} className="ml-auto" />
               </button>
             </div>
           </section>


           <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50/70 p-4">
             <div className="flex items-start gap-3">
               <div>
                 <p className="text-xs font-semibold text-purple-900">
                   Mantenha seus dados atualizados
                 </p>


                 <p className="mt-1 text-xs leading-5 text-purple-700/80">
                   Informações corretas ajudam a manter seu cadastro organizado.
                 </p>
               </div>
             </div>
           </div>
         </div>
       </div>
     </main>


     <input
       ref={fileInputRef}
       type="file"
       accept="image/jpeg,image/png,image/webp"
       onChange={handleImageSelect}
       className="hidden"
     />


     {editModalOpen && (
       <div
         className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/50 p-3 backdrop-blur-sm sm:p-5"
         onMouseDown={(event) => {
           if (event.target === event.currentTarget) {
             setEditModalOpen(false);
           }
         }}
       >
         <div
           role="dialog"
           aria-modal="true"
           aria-labelledby="edit-profile-title"
           className="w-full max-w-2xl overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl shadow-gray-950/20"
         >
           <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-7">
             <div className="flex items-center gap-3">
               <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                 <Pencil size={19} />
               </div>


               <div>
                 <h2
                   id="edit-profile-title"
                   className="text-base font-bold text-gray-950"
                 >
                   Editar perfil
                 </h2>


                 <p className="mt-1 text-xs text-gray-500">
                   Atualize suas informações pessoais.
                 </p>
               </div>
             </div>


             <button
               type="button"
               onClick={() => setEditModalOpen(false)}
               className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
               aria-label="Fechar"
             >
               <X size={19} />
             </button>
           </div>


           <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-7">
             <div className="mb-7 flex flex-col items-center gap-4 rounded-2xl border border-gray-200/80 bg-gray-50/70 p-5 sm:flex-row sm:items-center sm:gap-5">
               <div className="relative shrink-0">
                 <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500 to-indigo-700 text-2xl font-bold text-white shadow-md">
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


                 <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-xl border-2 border-white bg-purple-600 text-white shadow-sm">
                   <Camera size={15} />
                 </div>
               </div>


               <div className="w-full min-w-0 text-center sm:text-left">
                 <p className="text-sm font-bold text-gray-950">
                   Foto de perfil
                 </p>


                 <p className="mt-1.5 text-xs leading-5 text-gray-500">
                   Personalize seu perfil com uma foto. Caso não tenha uma,
                   suas iniciais serão exibidas.
                 </p>


                 <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                   <button
                     type="button"
                     onClick={handleOpenImageSelector}
                     className="flex h-10 items-center gap-2 rounded-xl bg-purple-600 px-4 text-xs font-semibold text-white transition hover:bg-purple-700"
                   >
                     <ImagePlus size={15} />
                     {profileImage ? "Trocar foto" : "Adicionar foto"}
                   </button>


                   {profileImage && (
                     <button
                       type="button"
                       onClick={handleRemoveImage}
                       className="flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                     >
                       <Trash2 size={15} />
                       Remover
                     </button>
                   )}
                 </div>


                 <p className="mt-2.5 text-[11px] text-gray-400">
                   JPG, PNG ou WEBP · Máximo 5 MB
                 </p>
               </div>
             </div>


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
                   className="mb-2 block text-xs font-semibold text-gray-700"
                 >
                   Estado
                 </label>


                 <select
                   id="profile-state"
                   value={formData.state}
                   onChange={(event) =>
                     handleInputChange("state", event.target.value)
                   }
                   className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition hover:border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                 >
                   <option value="PB">Paraíba</option>
                   <option value="PE">Pernambuco</option>
                   <option value="RN">Rio Grande do Norte</option>
                   <option value="CE">Ceará</option>
                   <option value="BA">Bahia</option>
                   <option value="SP">São Paulo</option>
                   <option value="RJ">Rio de Janeiro</option>
                 </select>
               </div>


               <div className="sm:col-span-2">
                 <label className="mb-2 block text-xs font-semibold text-gray-700">
                   CPF
                 </label>


                 <div className="flex h-11 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-3.5">
                   <CreditCard size={16} className="text-gray-400" />


                   <span className="text-sm font-medium text-gray-500">
                     {user.cpf}
                   </span>


                   <span className="ml-auto rounded-lg bg-gray-200/70 px-2 py-1 text-[10px] font-semibold text-gray-500">
                     Não editável
                   </span>
                 </div>
               </div>
             </div>
           </div>


           <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
             <button
               type="button"
               onClick={() => setEditModalOpen(false)}
               className="h-11 rounded-xl px-5 text-sm font-semibold text-gray-600 transition hover:bg-gray-200/70"
             >
               Cancelar
             </button>


             <button
               type="button"
               onClick={handleSaveProfile}
               className="flex h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
             >
               <Save size={16} />
               Salvar alterações
             </button>
           </div>
         </div>
       </div>
     )}


     {passwordModalOpen && (
       <div
         className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/50 p-3 backdrop-blur-sm sm:p-5"
         onMouseDown={(event) => {
           if (event.target === event.currentTarget) {
             handleClosePasswordModal();
           }
         }}
       >
         <div
           role="dialog"
           aria-modal="true"
           aria-labelledby="change-password-title"
           className="w-full max-w-md overflow-hidden rounded-3xl border border-white/50 bg-white shadow-2xl shadow-gray-950/20"
         >
           <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
             <div className="flex items-center gap-3">
               <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                 <Lock size={19} />
               </div>


               <div>
                 <h2
                   id="change-password-title"
                   className="text-base font-bold text-gray-950"
                 >
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
               className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
               aria-label="Fechar"
             >
               <X size={19} />
             </button>
           </div>


           <div className="p-5 sm:p-6">
             {passwordSuccess && (
               <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                 <CheckCircle2
                   size={19}
                   className="mt-0.5 shrink-0 text-emerald-600"
                 />


                 <div>
                   <p className="text-sm font-semibold text-emerald-800">
                     Senha alterada com sucesso!
                   </p>


                   <p className="mt-1 text-xs leading-5 text-emerald-700">
                     A nova senha foi definida para sua conta.
                   </p>
                 </div>
               </div>
             )}


             {passwordError && (
               <div
                 role="alert"
                 className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
               >
                 <AlertCircle
                   size={19}
                   className="mt-0.5 shrink-0 text-red-600"
                 />


                 <p className="text-xs leading-5 text-red-700">
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
                   handlePasswordChange("currentPassword", value)
                 }
                 onToggle={() =>
                   setShowCurrentPassword((current) => !current)
                 }
               />


               <PasswordField
                 id="new-password"
                 label="Nova senha"
                 value={passwordData.newPassword}
                 visible={showNewPassword}
                 onChange={(value) =>
                   handlePasswordChange("newPassword", value)
                 }
                 onToggle={() =>
                   setShowNewPassword((current) => !current)
                 }
               />


               <PasswordField
                 id="confirm-password"
                 label="Confirmar nova senha"
                 value={passwordData.confirmPassword}
                 visible={showConfirmPassword}
                 onChange={(value) =>
                   handlePasswordChange("confirmPassword", value)
                 }
                 onToggle={() =>
                   setShowConfirmPassword((current) => !current)
                 }
               />


               <div className="flex items-start gap-2 rounded-xl bg-gray-50 p-3.5">
                 <ShieldCheck
                   size={16}
                   className="mt-0.5 shrink-0 text-purple-500"
                 />


                 <p className="text-xs leading-5 text-gray-500">
                   A senha deve possuir pelo menos 6 caracteres.
                   Escolha uma senha que você não utilize em outros serviços.
                 </p>
               </div>
             </div>
           </div>


           <div className="flex flex-col-reverse gap-2 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
             <button
               type="button"
               onClick={handleClosePasswordModal}
               className="h-11 rounded-xl px-5 text-sm font-semibold text-gray-600 transition hover:bg-gray-200/70"
             >
               Cancelar
             </button>


             <button
               type="button"
               onClick={handleChangePassword}
               disabled={passwordSuccess}
               className="flex h-11 items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
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
   <div className="group flex min-w-0 items-start gap-3 rounded-2xl px-2 py-4 transition hover:bg-purple-50/50">
     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-purple-100/80 bg-purple-50 text-purple-600 transition group-hover:bg-white">
       {icon}
     </div>


     <div className="min-w-0 flex-1 pt-0.5">
       <p className="text-xs font-medium text-gray-400">
         {label}
       </p>


       <p className="mt-1.5 break-words text-sm font-semibold leading-5 text-gray-800">
         {value || "Não informado"}
       </p>
     </div>
   </div>
 );
}




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
 const id = `edit-${label
   .normalize("NFD")
   .replace(/[\u0300-\u036f]/g, "")
   .toLowerCase()
   .replace(/[^a-z0-9]+/g, "-")}`;


 return (
   <div>
     <label
       htmlFor={id}
       className="mb-2 block text-xs font-semibold text-gray-700"
     >
       {label}
     </label>


     <input
       id={id}
       type={type}
       value={value}
       onChange={(event) => onChange(event.target.value)}
       className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
     />
   </div>
 );
}




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
       className="mb-2 block text-xs font-semibold text-gray-700"
     >
       {label}
     </label>


     <div className="relative">
       <input
         id={id}
         type={visible ? "text" : "password"}
         value={value}
         onChange={(event) => onChange(event.target.value)}
         className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 pr-12 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
         placeholder="Digite sua senha"
         autoComplete="current-password"
       />


       <button
         type="button"
         onClick={onToggle}
         className="absolute right-1 top-1 flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-purple-50 hover:text-purple-600"
         aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
       >
         {visible ? <EyeOff size={17} /> : <Eye size={17} />}
       </button>
     </div>
   </div>
 );
}
