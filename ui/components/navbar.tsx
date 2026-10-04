"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookOpen,
  Compass,
  Folder,
  Home,
  Bell,
  Plus,
  ChevronDown,
  Menu,
  X,
  FileText,
  Upload,
  Settings,
  LogOut,
  Clock3,
  CheckCircle2,
} from "lucide-react";

import { AnimatePresence, motion } from "motion/react";

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /*
   * ---------------------------------------------------------
   * FECHAR DROPDOWNS AO CLICAR FORA
   * ---------------------------------------------------------
   */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * FECHAR MENU MOBILE AO TROCAR DE PÁGINA
   * ---------------------------------------------------------
   */

  useEffect(() => {
    setMenuOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  /*
   * ---------------------------------------------------------
   * FUNÇÃO PARA SABER A PÁGINA ATUAL
   * ---------------------------------------------------------
   */

  const isActive = (path: string) => {
    if (path === "/home") {
      return pathname === "/home" || pathname === "/";
    }

    return pathname.startsWith(path);
  };

  /*
   * ---------------------------------------------------------
   * NAVEGAÇÃO
   * ---------------------------------------------------------
   */

  const navigation = [
    {
      name: "Início",
      href: "/home",
      icon: Home,
    },
    {
      name: "Explorar",
      href: "/explorar",
      icon: Compass,
    },
    {
      name: "Meus materiais",
      href: "/meusmateriais",
      icon: Folder,
    },
  ];

  /*
   * ---------------------------------------------------------
   * PUBLICAR MATERIAL
   * ---------------------------------------------------------
   */

  function openPublishModal() {
    setMenuOpen(false);
    setNotificationsOpen(false);
    setProfileOpen(false);
    setPublishModalOpen(true);
  }

  /*
   * ---------------------------------------------------------
   * LOGOUT
   * ---------------------------------------------------------
   */

  function handleLogout() {
    localStorage.removeItem("token");

    window.location.href = "/login";
  }

  return (
    <>
      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="relative z-50 h-16 w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-full items-center px-4 sm:px-6 lg:px-7">

          {/* =================================================
              LOGO
          ================================================== */}

          <Link
            href="/home"
            className="
              flex
              min-w-0
              items-center
              gap-2
              rounded-md
              outline-none
              transition
              hover:opacity-80
              focus-visible:ring-2
              focus-visible:ring-purple-500
            "
          >
            <div
              className="
                flex
                h-8
                w-8
                shrink-0
                items-center
                justify-center
                text-purple-700
              "
            >
              <BookOpen
                size={23}
                strokeWidth={2.5}
              />
            </div>

            <span
              className="
                whitespace-nowrap
                text-sm
                font-semibold
                text-gray-900
              "
            >
              Banca de Materiais
            </span>
          </Link>

          {/* =================================================
              NAVEGAÇÃO DESKTOP
          ================================================== */}

          <nav
            className="
              hidden
              flex-1
              items-center
              justify-center
              gap-5
              md:flex
              lg:gap-8
            "
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    relative
                    flex
                    h-16
                    items-center
                    gap-1.5
                    text-xs
                    font-medium
                    outline-none
                    transition-colors
                    duration-200
                    focus-visible:text-purple-600
                    ${
                      active
                        ? "text-purple-600"
                        : "text-gray-700 hover:text-purple-600"
                    }
                  `}
                >
                  <motion.div
                    whileHover={{
                      y: -1,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                  >
                    <Icon
                      size={item.name === "Meus materiais" ? 17 : 16}
                      strokeWidth={active ? 2.2 : 1.9}
                    />
                  </motion.div>

                  <span>{item.name}</span>

                  {/* Indicador animado */}

                  {active && (
                    <motion.span
                      layoutId="navbar-active"
                      className="
                        absolute
                        bottom-0
                        left-0
                        right-0
                        h-0.5
                        rounded-t
                        bg-purple-600
                      "
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 35,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* =================================================
              AÇÕES DESKTOP
          ================================================== */}

          <div className="ml-auto hidden items-center gap-3 md:flex">

            {/* ===============================================
                PUBLICAR
            ================================================ */}

            <motion.button
              type="button"
              onClick={openPublishModal}
              whileHover={{
                y: -1,
              }}
              whileTap={{
                scale: 0.97,
              }}
              transition={{
                duration: 0.15,
              }}
              className="
                flex
                h-8
                items-center
                justify-center
                gap-1.5
                rounded-md
                border
                border-purple-500
                px-2.5
                text-xs
                font-medium
                text-purple-600
                transition
                hover:bg-purple-50
                focus:outline-none
                focus:ring-2
                focus:ring-purple-500/20
                lg:px-3
              "
            >
              <Plus size={16} />

              <span className="hidden lg:inline">
                Publicar material
              </span>
            </motion.button>

            {/* ===============================================
                NOTIFICAÇÕES
            ================================================ */}

            <div
              ref={notificationRef}
              className="relative"
            >
              <motion.button
                type="button"
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setProfileOpen(false);
                }}
                whileTap={{
                  scale: 0.92,
                }}
                className="
                  relative
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-md
                  text-gray-600
                  transition
                  hover:bg-gray-100
                  hover:text-purple-600
                  focus:outline-none
                  focus:ring-2
                  focus:ring-purple-500/20
                "
                aria-label="Notificações"
              >
                <Bell size={17} />

                {/* Indicador de nova notificação */}

                <span
                  className="
                    absolute
                    right-1.5
                    top-1
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-purple-600
                  "
                />
              </motion.button>

              {/* Dropdown */}

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    transition={{
                      duration: 0.18,
                      ease: "easeOut",
                    }}
                    className="
                      absolute
                      right-0
                      top-11
                      w-[340px]
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      shadow-xl
                    "
                  >
                    {/* Cabeçalho */}

                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-gray-100
                        px-4
                        py-3
                      "
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">
                          Notificações
                        </h3>

                        <p className="mt-0.5 text-xs text-gray-500">
                          Suas atualizações recentes
                        </p>
                      </div>

                      <button
                        type="button"
                        className="
                          text-xs
                          font-medium
                          text-purple-600
                          hover:underline
                        "
                      >
                        Marcar como lidas
                      </button>
                    </div>

                    {/* Notificação */}

                    <div
                      className="
                        flex
                        gap-3
                        border-b
                        border-gray-100
                        px-4
                        py-3
                        transition
                        hover:bg-gray-50
                      "
                    >
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-purple-100
                          text-purple-600
                        "
                      >
                        <FileText size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900">
                          Novo material disponível
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-gray-500">
                          Um novo material foi publicado na comunidade.
                        </p>

                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock3 size={11} />
                          Há 10 minutos
                        </div>
                      </div>
                    </div>

                    {/* Notificação */}

                    <div
                      className="
                        flex
                        gap-3
                        px-4
                        py-3
                        transition
                        hover:bg-gray-50
                      "
                    >
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-green-100
                          text-green-600
                        "
                      >
                        <CheckCircle2 size={17} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-900">
                          Material publicado
                        </p>

                        <p className="mt-1 text-xs leading-relaxed text-gray-500">
                          Seu material foi publicado com sucesso.
                        </p>

                        <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-400">
                          <Clock3 size={11} />
                          Ontem
                        </div>
                      </div>
                    </div>

                    {/* Rodapé */}

                    <div className="border-t border-gray-100 px-4 py-3">
                      <button
                        type="button"
                        className="
                          w-full
                          text-center
                          text-xs
                          font-medium
                          text-purple-600
                          hover:underline
                        "
                      >
                        Ver todas as notificações
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ===============================================
                PERFIL
            ================================================ */}

            <div
              ref={profileRef}
              className="relative"
            >
              <motion.button
                type="button"
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationsOpen(false);
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-md
                  px-1.5
                  py-1
                  text-gray-700
                  transition
                  hover:bg-gray-50
                  focus:outline-none
                  focus:ring-2
                  focus:ring-purple-500/20
                "
              >
                {/* Avatar */}

                <div
                  className="
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    bg-purple-600
                    text-xs
                    font-semibold
                    text-white
                  "
                >
                  G
                </div>

                <span className="hidden text-xs font-medium lg:inline">
                  Gilberto
                </span>

                <motion.div
                  animate={{
                    rotate: profileOpen ? 180 : 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                >
                  <ChevronDown
                    size={14}
                    className="text-gray-500"
                  />
                </motion.div>
              </motion.button>

              {/* Dropdown do perfil */}

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      scale: 0.97,
                    }}
                    transition={{
                      duration: 0.18,
                      ease: "easeOut",
                    }}
                    className="
                      absolute
                      right-0
                      top-11
                      w-56
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      p-1.5
                      shadow-xl
                    "
                  >
                    {/* Informações da conta */}

                    <Link
                      href="/perfil"
                      onClick={() => setProfileOpen(false)}
                      className="
                        mb-1
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        bg-gray-50
                        px-3
                        py-3
                        transition
                        hover:bg-purple-50
                      "
                    >
                      <div
                        className="
                          flex
                          h-9
                          w-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-purple-600
                          text-sm
                          font-semibold
                          text-white
                        "
                      >
                        G
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-gray-900">
                          Gilberto
                        </p>

                        <p className="truncate text-[11px] text-gray-500">
                          Minha conta
                        </p>
                      </div>
                    </Link>

                    {/* Perfil */}

                    <Link
                      href="/perfil"
                      onClick={() => setProfileOpen(false)}
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-xs
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-purple-50
                        hover:text-purple-600
                      "
                    >
                      <Settings size={16} />

                      Configurações
                    </Link>

                    {/* Publicar */}

                    <button
                      type="button"
                      onClick={openPublishModal}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-xs
                        font-medium
                        text-gray-700
                        transition
                        hover:bg-purple-50
                        hover:text-purple-600
                      "
                    >
                      <Upload size={16} />

                      Publicar material
                    </button>

                    {/* Separador */}

                    <div className="my-1 border-t border-gray-100" />

                    {/* Sair */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="
                        flex
                        w-full
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-2.5
                        text-left
                        text-xs
                        font-medium
                        text-red-600
                        transition
                        hover:bg-red-50
                      "
                    >
                      <LogOut size={16} />

                      Sair
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* =================================================
              BOTÃO MOBILE
          ================================================== */}

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="
              ml-auto
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-md
              text-gray-700
              transition
              hover:bg-gray-100
              md:hidden
            "
            aria-label={
              menuOpen
                ? "Fechar menu"
                : "Abrir menu"
            }
          >
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{
                    opacity: 0,
                    rotate: -90,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: 90,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{
                    opacity: 0,
                    rotate: 90,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: -90,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* ===================================================
            MENU MOBILE
        ==================================================== */}

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className="
                absolute
                left-0
                right-0
                top-16
                overflow-hidden
                border-b
                border-gray-200
                bg-white
                shadow-lg
                md:hidden
              "
            >
              <div className="space-y-1 p-3">

                {/* Links */}

                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={`
                        flex
                        items-center
                        gap-3
                        rounded-lg
                        px-3
                        py-3
                        text-sm
                        font-medium
                        transition
                        ${
                          active
                            ? "bg-purple-50 text-purple-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }
                      `}
                    >
                      <Icon size={18} />

                      {item.name}
                    </Link>
                  );
                })}

                {/* Publicar */}

                <motion.button
                  type="button"
                  whileTap={{
                    scale: 0.98,
                  }}
                  onClick={openPublishModal}
                  className="
                    mt-2
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    border
                    border-purple-500
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    text-purple-600
                    transition
                    hover:bg-purple-50
                  "
                >
                  <Plus size={18} />

                  Publicar material
                </motion.button>

                {/* Perfil */}

                <Link
                  href="/perfil"
                  onClick={() => setMenuOpen(false)}
                  className="
                    mt-2
                    flex
                    items-center
                    gap-3
                    border-t
                    border-gray-100
                    px-3
                    pt-4
                    transition
                    hover:bg-gray-50
                  "
                >
                  <div
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-purple-600
                      text-sm
                      font-semibold
                      text-white
                    "
                  >
                    G
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Gilberto
                    </p>

                    <p className="text-xs text-gray-500">
                      Minha conta
                    </p>
                  </div>

                  <Settings
                    size={18}
                    className="
                      ml-auto
                      text-gray-500
                    "
                  />
                </Link>

                {/* Sair */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3
                    py-3
                    text-left
                    text-sm
                    font-medium
                    text-red-600
                    transition
                    hover:bg-red-50
                  "
                >
                  <LogOut size={18} />

                  Sair
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* =====================================================
          MODAL PUBLICAR MATERIAL
      ====================================================== */}

      <AnimatePresence>
        {publishModalOpen && (
          <motion.div
            className="
              fixed
              inset-0
              z-[100]
              flex
              items-center
              justify-center
              bg-black/40
              p-4
              backdrop-blur-sm
            "
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setPublishModalOpen(false);
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 20,
                scale: 0.96,
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 25,
              }}
              className="
                w-full
                max-w-[560px]
                overflow-hidden
                rounded-2xl
                bg-white
                shadow-2xl
              "
            >
              {/* ===========================================
                  CABEÇALHO DO MODAL
              ============================================ */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  border-b
                  border-gray-100
                  px-5
                  py-4
                  sm:px-6
                "
              >
                <div>
                  <h2 className="text-base font-semibold text-gray-900">
                    Publicar material
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500">
                    Compartilhe um material com a comunidade.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPublishModalOpen(false)}
                  className="
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-md
                    text-gray-500
                    transition
                    hover:bg-gray-100
                    hover:text-gray-700
                  "
                  aria-label="Fechar"
                >
                  <X size={18} />
                </button>
              </div>

              {/* ===========================================
                  CONTEÚDO
              ============================================ */}

              <div className="space-y-5 p-5 sm:p-6">

                {/* Título */}

                <div>
                  <label
                    htmlFor="material-title"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-gray-700
                    "
                  >
                    Título
                  </label>

                  <input
                    id="material-title"
                    type="text"
                    placeholder="Ex.: Resumo de Direito Penal"
                    className="
                      h-10
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-3
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-purple-500
                      focus:ring-2
                      focus:ring-purple-500/10
                    "
                  />
                </div>

                {/* Descrição */}

                <div>
                  <label
                    htmlFor="material-description"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-gray-700
                    "
                  >
                    Descrição
                  </label>

                  <textarea
                    id="material-description"
                    rows={3}
                    placeholder="Descreva brevemente o material..."
                    className="
                      w-full
                      resize-none
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-3
                      py-2.5
                      text-sm
                      text-gray-900
                      outline-none
                      transition
                      placeholder:text-gray-400
                      focus:border-purple-500
                      focus:ring-2
                      focus:ring-purple-500/10
                    "
                  />
                </div>

                {/* Categoria */}

                <div>
                  <label
                    htmlFor="material-category"
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-gray-700
                    "
                  >
                    Categoria
                  </label>

                  <select
                    id="material-category"
                    className="
                      h-10
                      w-full
                      rounded-lg
                      border
                      border-gray-300
                      bg-white
                      px-3
                      text-sm
                      text-gray-700
                      outline-none
                      transition
                      focus:border-purple-500
                      focus:ring-2
                      focus:ring-purple-500/10
                    "
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecione uma categoria
                    </option>

                    <option value="direito">
                      Direito
                    </option>

                    <option value="tecnologia">
                      Tecnologia
                    </option>

                    <option value="administracao">
                      Administração
                    </option>

                    <option value="engenharia">
                      Engenharia
                    </option>

                    <option value="outros">
                      Outros
                    </option>
                  </select>
                </div>

                {/* Upload */}

                <div>
                  <label
                    className="
                      mb-1.5
                      block
                      text-xs
                      font-medium
                      text-gray-700
                    "
                  >
                    Arquivo
                  </label>

                  <label
                    htmlFor="material-file"
                    className="
                      flex
                      cursor-pointer
                      flex-col
                      items-center
                      justify-center
                      rounded-xl
                      border-2
                      border-dashed
                      border-gray-300
                      px-5
                      py-7
                      text-center
                      transition
                      hover:border-purple-400
                      hover:bg-purple-50/50
                    "
                  >
                    <div
                      className="
                        mb-2
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-purple-100
                        text-purple-600
                      "
                    >
                      <Upload size={19} />
                    </div>

                    <p className="text-xs font-medium text-gray-700">
                      Clique para selecionar um arquivo
                    </p>

                    <p className="mt-1 text-[11px] text-gray-400">
                      PDF, DOC, DOCX ou PPTX
                    </p>

                    <input
                      id="material-file"
                      type="file"
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* ===========================================
                  RODAPÉ
              ============================================ */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-2
                  border-t
                  border-gray-100
                  bg-gray-50/50
                  px-5
                  py-4
                  sm:flex-row
                  sm:justify-end
                  sm:px-6
                "
              >
                <button
                  type="button"
                  onClick={() => setPublishModalOpen(false)}
                  className="
                    h-10
                    rounded-lg
                    px-4
                    text-xs
                    font-medium
                    text-gray-600
                    transition
                    hover:bg-gray-100
                  "
                >
                  Cancelar
                </button>

                <motion.button
                  type="button"
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="
                    flex
                    h-10
                    items-center
                    justify-center
                    gap-2
                    rounded-lg
                    bg-purple-600
                    px-5
                    text-xs
                    font-medium
                    text-white
                    transition
                    hover:bg-purple-700
                  "
                >
                  <Upload size={15} />

                  Publicar material
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}