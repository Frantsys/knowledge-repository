"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { BookOpen, ChevronDown, Compass, Folder, Home, LogOut, Plus, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LinkProgress from "@/components/link-progress";
import PublishDialog from "@/components/publish-dialog";
import { Skeleton } from "@/components/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import UserAvatar from "@/components/user-avatar";
import { clearToken, getToken } from "@/lib/api/client";
import { useMe } from "@/lib/api/swr";
import { OPEN_PUBLISH_EVENT } from "@/lib/hooks";
import { cn } from "@/lib/utils";

const NAVIGATION = [
  { name: "Início", href: "/home", icon: Home },
  { name: "Explorar", href: "/explorar", icon: Compass },
  { name: "Meus materiais", href: "/meusmateriais", icon: Folder },
];

// Abas do celular: "Publicar" no centro (href null) e o Perfil no lugar do antigo menu da conta
const TABS = [
  NAVIGATION[0],
  NAVIGATION[1],
  { name: "Publicar", href: null, icon: Plus },
  { name: "Meus", href: "/meusmateriais", icon: Folder },
  { name: "Perfil", href: "/perfil", icon: UserRound },
];

function TabLink({
  href,
  label,
  icon: Icon,
  active,
  transitionTypes,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  active: boolean;
  transitionTypes: string[];
}) {
  return (
    <Link
      href={href}
      transitionTypes={transitionTypes}
      aria-current={active ? "page" : undefined}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors",
        active ? "text-primary" : "text-muted-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId="tabbar-active"
          className="absolute top-0 h-0.5 w-8 rounded-b bg-primary"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <Icon className="size-[22px]" strokeWidth={active ? 2.2 : 1.8} />
      {label}
      <LinkProgress />
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  // Usuário em cache (SWR), compartilhado com o Perfil: trocar nome ou foto lá atualiza aqui na hora
  const { data: me, isLoading: loadingMe } = useMe();
  const userName = me?.firstName ?? "";

  const [publishOpen, setPublishOpen] = useState(false);

  // Toda página logada renderiza a navbar: sem token, volta para o login
  useEffect(() => {
    if (!getToken()) {
      window.location.href = "/login";
    }
  }, []);

  // Telas como Início e Meus materiais têm botões "Publicar" que abrem o diálogo da navbar
  useEffect(() => {
    const open = () => setPublishOpen(true);
    window.addEventListener(OPEN_PUBLISH_EVENT, open);
    return () => window.removeEventListener(OPEN_PUBLISH_EVENT, open);
  }, []);

  const isActive = (path: string) => (path === "/home" ? pathname === "/home" || pathname === "/" : pathname.startsWith(path));

  // Direção da transição de página: aba à direita = para frente; aba à esquerda,
  // ou voltar de uma tela interna (material, perfil) para uma aba = para trás
  const currentIndex = NAVIGATION.findIndex((item) => isActive(item.href));

  function directionTo(index: number): string[] {
    if (index === currentIndex) return [];
    return currentIndex !== -1 && index > currentIndex ? ["nav-forward"] : ["nav-back"];
  }

  function openPublish() {
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

        </div>

      </header>

      {/* Barra de abas (celular): os destinos e o "Publicar" ao alcance do polegar */}
      <nav
        aria-label="Navegação principal"
        className="fixed inset-x-0 bottom-0 z-50 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
        style={{ viewTransitionName: "site-tabbar" }}
      >
        <div className="mx-auto grid h-16 max-w-md grid-cols-5">
          {TABS.map((item) =>
            item.href === null ? (
              <div key="publish" className="flex items-center justify-center">
                <Button
                  onClick={openPublish}
                  aria-label="Publicar material"
                  className="size-12 rounded-2xl shadow-md shadow-primary/25"
                >
                  <Plus className="size-6" />
                </Button>
              </div>
            ) : (
              <TabLink
                key={item.href}
                href={item.href}
                label={item.name}
                icon={item.icon}
                active={isActive(item.href)}
                transitionTypes={item.href === "/perfil" ? ["nav-forward"] : directionTo(NAVIGATION.findIndex((nav) => nav.href === item.href))}
              />
            )
          )}
        </div>
      </nav>

      <PublishDialog open={publishOpen} onOpenChange={setPublishOpen} course={me?.course} />
    </>
  );
}
