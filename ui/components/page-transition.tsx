"use client";

/// <reference types="react/experimental" />
import { ViewTransition } from "react";
import { usePathname } from "next/navigation";

// Cada rota é uma "cena": a key troca a cada navegação, então o conteúdo antigo sai e o novo entra.
// O tipo da navegação (vindo de <Link transitionTypes>) escolhe a direção; sem tipo (ex.: router.back), só esmaece.
const ANIMATION = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  default: "page-fade",
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ViewTransition key={pathname} enter={ANIMATION} exit={ANIMATION} default="none">
      <div>{children}</div>
    </ViewTransition>
  );
}
