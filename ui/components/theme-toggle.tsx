"use client";

import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// O tema só é conhecido no navegador: até montar, assume claro (evita divergência na hidratação)
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

// Tema efetivo (resolve o do sistema na primeira visita) e a troca entre claro e escuro
function useThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = useMounted() && resolvedTheme === "dark";
  return {
    isDark,
    toggle: () => setTheme(isDark ? "light" : "dark"),
    label: isDark ? "Ativar modo claro" : "Ativar modo escuro",
  };
}

// Ícone que gira ao trocar: mostra o tema para o qual o botão leva
function ToggleIcon({ isDark }: { isDark: boolean }) {
  const Icon = isDark ? Sun : Moon;
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span
        key={isDark ? "sun" : "moon"}
        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="flex"
      >
        <Icon className="size-4" />
      </motion.span>
    </AnimatePresence>
  );
}

// Escolha explícita Claro / Escuro (celular): alvos grandes e o estado visível de uma vez
export function ThemeChoice({ className }: { className?: string }) {
  const { isDark } = useThemeToggle();
  const { setTheme } = useTheme();

  return (
    <div role="radiogroup" aria-label="Tema" className={cn("grid grid-cols-2 gap-1 rounded-xl bg-muted p-1", className)}>
      {[
        { value: "light", label: "Claro", icon: Sun, active: !isDark },
        { value: "dark", label: "Escuro", icon: Moon, active: isDark },
      ].map(({ value, label, icon: Icon, active }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={active}
          onClick={() => setTheme(value)}
          className="relative flex h-10 items-center justify-center gap-2 rounded-lg text-sm font-medium text-muted-foreground transition-colors aria-checked:text-foreground"
        >
          {active && (
            <motion.span
              layoutId="theme-choice-pill"
              transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
              className="absolute inset-0 rounded-lg bg-background shadow-sm ring-1 ring-foreground/10"
            />
          )}
          <Icon className="relative size-4" />
          <span className="relative">{label}</span>
        </button>
      ))}
    </div>
  );
}

// Botão de ícone (desktop: navbar e telas de login e cadastro)
export function ThemeToggle({ className, variant = "outline" }: { className?: string; variant?: "outline" | "ghost" }) {
  const { isDark, toggle, label } = useThemeToggle();

  return (
    <Button
      type="button"
      variant={variant}
      size="icon"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={cn("rounded-full", className)}
    >
      <ToggleIcon isDark={isDark} />
    </Button>
  );
}
