"use client";

import { useState } from "react";
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
} from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="relative z-50 h-16 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full items-center px-4 sm:px-6 lg:px-7">

        {/* Logo */}
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center text-purple-600">
            <BookOpen size={22} strokeWidth={2.5} />
          </div>

          <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
            Banca de Materiais
          </span>
        </div>

        {/* Navegação Desktop */}
        <nav className="hidden flex-1 items-center justify-center gap-5 md:flex lg:gap-8">

          <a
            href="#"
            className="relative flex h-16 items-center gap-1.5 text-xs font-medium text-purple-600"
          >
            <Home size={16} />

            <span>Início</span>

            {/* Indicador da página atual */}
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-t bg-purple-600" />
          </a>

          <a
            href="#"
            className="flex h-16 items-center gap-1.5 text-xs font-medium text-gray-700 transition hover:text-purple-600"
          >
            <Compass size={17} />

            <span>Explorar</span>
          </a>

          <a
            href="#"
            className="flex h-16 items-center gap-1.5 whitespace-nowrap text-xs font-medium text-gray-700 transition hover:text-purple-600"
          >
            <Folder size={17} />

            <span>Meus materiais</span>
          </a>

        </nav>

        {/* Ações Desktop */}
        <div className="ml-auto hidden items-center gap-3 md:flex">

          {/* Publicar */}
          <button
            className="
              flex h-8 items-center justify-center gap-1.5
              rounded-md border border-purple-500
              px-2.5
              text-xs font-medium text-purple-600
              transition hover:bg-purple-50
              lg:px-3
            "
          >
            <Plus size={16} />

            {/* Some o texto em telas menores */}
            <span className="hidden lg:inline">
              Publicar material
            </span>
          </button>

          {/* Notificação */}
          <button
            className="
              flex h-8 w-8 items-center justify-center
              rounded-md
              text-gray-600
              transition hover:bg-gray-100 hover:text-purple-600
            "
            aria-label="Notificações"
          >
            <Bell size={17} />
          </button>

          {/* Perfil */}
          <button
            className="
              flex items-center gap-1.5
              rounded-md
              text-gray-700
              transition hover:bg-gray-50
            "
          >
            <div
              className="
                flex h-7 w-7 items-center justify-center
                rounded-full bg-purple-600
                text-xs font-semibold text-white
              "
            >
              G
            </div>

            <span className="hidden text-xs font-medium lg:inline">
              Gilberto
            </span>

            <ChevronDown size={14} className="text-gray-500" />
          </button>

        </div>

        {/* Botão Mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="
            ml-auto flex h-9 w-9
            items-center justify-center
            rounded-md
            text-gray-700
            transition hover:bg-gray-100
            md:hidden
          "
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Menu Mobile */}
      {menuOpen && (
        <div
          className="
            absolute left-0 right-0 top-16
            border-b border-gray-200
            bg-white
            p-3
            shadow-lg
            md:hidden
          "
        >

          {/* Início */}
          <a
            href="#"
            className="
              flex items-center gap-3
              rounded-md
              bg-purple-50
              px-3 py-3
              text-sm font-medium
              text-purple-600
            "
            onClick={() => setMenuOpen(false)}
          >
            <Home size={18} />
            Início
          </a>

          {/* Explorar */}
          <a
            href="#"
            className="
              flex items-center gap-3
              rounded-md
              px-3 py-3
              text-sm font-medium
              text-gray-700
              transition hover:bg-gray-50
            "
            onClick={() => setMenuOpen(false)}
          >
            <Compass size={18} />
            Explorar
          </a>

          {/* Meus materiais */}
          <a
            href="#"
            className="
              flex items-center gap-3
              rounded-md
              px-3 py-3
              text-sm font-medium
              text-gray-700
              transition hover:bg-gray-50
            "
            onClick={() => setMenuOpen(false)}
          >
            <Folder size={18} />
            Meus materiais
          </a>

          {/* Publicar */}
          <button
            className="
              mt-2 flex w-full
              items-center justify-center gap-2
              rounded-md
              border border-purple-500
              px-3 py-2.5
              text-sm font-medium
              text-purple-600
              transition hover:bg-purple-50
            "
          >
            <Plus size={18} />
            Publicar material
          </button>

          {/* Perfil */}
          <button
            className="
              mt-2 flex w-full
              items-center gap-3
              border-t border-gray-100
              px-3 py-3
              pt-4
              text-left
            "
          >
            <div
              className="
                flex h-8 w-8 items-center justify-center
                rounded-full bg-purple-600
                text-xs font-semibold text-white
              "
            >
              G
            </div>

            <span className="text-sm font-medium text-gray-700">
              Gilberto
            </span>

            <ChevronDown
              size={15}
              className="ml-auto text-gray-400"
            />
          </button>

        </div>
      )}
    </header>
  );
}