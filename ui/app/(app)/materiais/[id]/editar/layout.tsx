import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Editar material · Banca de Materiais" } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
