import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Explorar" };

// A página lê ?q= com useSearchParams, que exige um limite de Suspense na pré-renderização
export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense>{children}</Suspense>;
}
