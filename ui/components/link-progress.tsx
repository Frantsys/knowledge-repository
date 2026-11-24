"use client";

import { createPortal } from "react-dom";
import { useLinkStatus } from "next/link";

// Barra fina de progresso logo abaixo da navbar enquanto a navegação do <Link> pai está pendente.
// Substitui o loading.tsx da rota: sem ele, a página atual fica na tela até a próxima estar pronta e a
// transição anima de uma vez (com loading.tsx, animava só a troca para a tela de carregamento vazia).
// Vai para o body por portal porque cards com transform viram "containing block" de position: fixed.
export default function LinkProgress() {
  const { pending } = useLinkStatus();

  if (!pending || typeof document === "undefined") return null;

  return createPortal(
    <div role="status" aria-label="Carregando página" className="link-progress fixed inset-x-0 top-16 z-40 h-0.5 overflow-hidden bg-accent">
      <span className="page-progress block h-full w-1/3 bg-primary" />
    </div>,
    document.body
  );
}
