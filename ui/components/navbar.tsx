"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { BookOpen, ChevronDown, Compass, Folder, Home, LogOut, Menu, Plus, UserRound, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import LinkProgress from "@/components/link-progress";
import PublishDialog from "@/components/publish-dialog";
import { Skeleton } from "@/components/skeleton";
import { ThemeChoice, ThemeToggle } from "@/components/theme-toggle";
import UserAvatar from "@/components/user-avatar";
import { clearToken, getToken } from "@/lib/api/client";
import { useMe } from "@/lib/api/swr";
import { OPEN_PUBLISH_EVENT, useEscapeKey } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const NAVIGATION = [
  { name: "Início", href: "/home", icon: Home },
  { name: "Explorar", href: "/explorar", icon: Compass },
  { name: "Meus materiais", href: "/meusmateriais", icon: Folder },
];

export default function Navbar() {
  const pathname = usePathname();

  // Usuário em cache (SWR), compartilhado com o Perfil: trocar nome ou foto lá atualiza aqui na hora
  const { data: me, isLoading: loadingMe } = useMe();
  const userName = me?.firstName ?? "";

  const [menuOpen, setMenuOpen] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);

  // Toda página logada renderiza a navbar: sem token, volta para o login
  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/login";
    }
  }, []);

  // Telas como Início e Meus materiais têm botões "Publicar" que abrem o diálogo da navbar
  useEffect(() => {
    const open = () => {
      setMenuOpen(false);
      setPublishOpen(true);
    };
    window.addEventListener(OPEN_PUBLISH_EVENT, open);
    return () => window.removeEventListener(OPEN_PUBLISH_EVENT, open);
  }, []);

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useEscapeKey(menuOpen, closeMenu);

  // Bloqueia a rolagem da página com o menu do celular aberto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Ajuste durante a renderização (sem efeito): ao mudar de página, fecha o menu do celular
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  const isActive = (path: string) => (path === "/home" ? pathname === "/home" || pathname === "/" : pathname.startsWith(path));

  // Direção da transição de página: aba à direita = para frente; aba à esquerda,
  // ou voltar de uma tela interna (material, perfil) para uma aba = para trás
  const currentIndex = NAVIGATION.findIndex((item) => isActive(item.href));

  function directionTo(index: number): string[] {
    if (index === currentIndex) return [];
    return currentIndex !== -1 && index > currentIndex ? ["nav-forward"] : ["nav-back"];
  }

  function openPublish() {
    setMenuOpen(false);
    setPublishOpen(true);
  }

  function handleLogout() {
    clearToken();
    window.location.href = "/login";
  }

  return (
    <>
      <header
        className="relative z-50 h-16 w-full border-b bg-card"
        style={{ viewTransitionName: "site-header" }}
      >
        <div className="page-container flex h-full items-center">
          {/* Logo */}
          <Link
            href="/home"
            transitionTypes={directionTo(0)}
            className="flex min-w-0 items-center gap-2 rounded-md transition-opacity hover:opacity-80"
          >
            <BookOpen className="size-6 shrink-0 text-primary" strokeWidth={2.5} />
            <span className="whitespace-nowrap text-base font-semibold">Banca de Materiais</span>
            <LinkProgress />
          </Link>

          {/* Navegação (desktop) */}
          <nav className="hidden flex-1 items-center justify-center gap-5 md:flex lg:gap-8">
            {NAVIGATION.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  transitionTypes={directionTo(index)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex h-16 items-center gap-2 text-sm font-medium transition-colors",
                    active ? "text-primary" : "text-foreground/80 hover:text-primary"
                  )}
                >
                  <Icon className="size-[18px]" strokeWidth={active ? 2.2 : 1.9} />
                  <span>{item.name}</span>

                  {/* Hover: prévia discreta do indicador de aba ativa, abrindo do centro (o ícone fica parado) */}
                  {!active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-center scale-x-0 rounded-t bg-primary/30 transition-transform duration-200 ease-out group-hover:scale-x-100"
                    />
                  )}

                  {active && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute inset-x-0 bottom-0 h-0.5 rounded-t bg-primary"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}

                  <LinkProgress />
                </Link>
              );
            })}
          </nav>

          {/* Ações (desktop) */}
          <div className="ml-auto hidden items-center gap-3 md:flex">
            <Button
              variant="outline"
              onClick={openPublish}
              aria-label="Publicar material"
              title="Publicar material"
              className="h-9 border-primary/60 px-3 text-primary hover:bg-accent hover:text-primary dark:border-primary/50"
            >
              <Plus />
              <span className="hidden lg:inline">Publicar material</span>
            </Button>

            <ThemeToggle variant="ghost" className="size-9 text-muted-foreground hover:text-foreground" />

            {/* Menu da conta: perfil e sair (o "Publicar" e o tema estão nos botões ao lado) */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 gap-2 px-1.5" aria-label={`Menu da conta de ${userName}`}>
                  {/* Enquanto o /me carrega: esqueleto em vez de um círculo vazio */}
                  {loadingMe ? (
                    <Skeleton className="size-8 rounded-full" />
                  ) : (
                    <UserAvatar avatarUrl={me?.avatarUrl} name={userName} className="size-8 text-sm" />
                  )}
                  {loadingMe ? (
                    <Skeleton className="hidden h-4 w-16 lg:block" />
                  ) : (
                    <span className="hidden text-sm font-medium lg:inline">{userName}</span>
                  )}
                  <ChevronDown className="text-muted-foreground transition-transform duration-200 group-aria-expanded/button:rotate-180" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="gap-3 py-2">
                    <Link href="/perfil" transitionTypes={["nav-forward"]}>
                      <UserAvatar avatarUrl={me?.avatarUrl} name={userName} className="size-9 text-sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{userName}</span>
                        <span className="block truncate text-xs text-muted-foreground">Ver meu perfil</span>
                      </span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
                  <LogOut />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Botão do menu (celular) */}
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-auto md:hidden"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>

        {/* Menu (celular) */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-x-0 top-16 overflow-hidden border-b bg-card shadow-lg md:hidden"
            >
              <div className="space-y-1 p-3">
                {NAVIGATION.map((item, index) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      transitionTypes={directionTo(index)}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                        active ? "bg-accent text-accent-foreground" : "hover:bg-muted"
                      )}
                    >
                      <Icon className="size-[18px]" />
                      {item.name}
                    </Link>
                  );
                })}

                <Button
                  variant="outline"
                  onClick={openPublish}
                  className="mt-2 h-11 w-full border-primary/60 text-primary hover:bg-accent hover:text-primary"
                >
                  <Plus />
                  Publicar material
                </Button>

                <Separator className="my-3" />

                <Link
                  href="/perfil"
                  transitionTypes={["nav-forward"]}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                >
                  <UserAvatar avatarUrl={me?.avatarUrl} name={userName} className="size-9 text-sm" />
                  <span>
                    <span className="block text-sm font-medium">{userName}</span>
                    <span className="block text-xs text-muted-foreground">Ver meu perfil</span>
                  </span>
                  <UserRound className="ml-auto size-[18px] text-muted-foreground" />
                </Link>

                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">Tema</span>
                  <ThemeChoice className="w-48" />
                </div>

                <Button variant="ghost" onClick={handleLogout} className="h-11 w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive">
                  <LogOut />
                  Sair
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} course={me?.course} />
    </>
  );
}
