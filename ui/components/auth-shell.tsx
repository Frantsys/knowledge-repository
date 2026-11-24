import { BookOpen } from "lucide-react";
import { ThemeChoice, ThemeToggle } from "@/components/theme-toggle";

// Linhas de caderno: pauta horizontal + margem vertical, o motivo visual das telas de acesso
const NOTEBOOK_STYLE: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(90deg, transparent 1.25rem, rgb(255 255 255 / 0.14) 1.25rem, rgb(255 255 255 / 0.14) calc(1.25rem + 1px), transparent calc(1.25rem + 1px))",
    "repeating-linear-gradient(180deg, transparent 0, transparent calc(2rem - 1px), rgb(255 255 255 / 0.055) calc(2rem - 1px), rgb(255 255 255 / 0.055) 2rem)",
  ].join(", "),
};

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <BookOpen size={26} strokeWidth={2} aria-hidden="true" />
      <span className="text-base font-semibold tracking-tight">Banca de Materiais</span>
    </div>
  );
}

// Estrutura comum de login e cadastro: painel da marca à esquerda (fixo no desktop) e formulário à direita.
// No celular o painel vira uma faixa compacta no topo, rolando junto com a página.
export default function AuthShell({
  aside,
  children,
  wide = false,
}: {
  aside: React.ReactNode;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`min-h-dvh bg-background lg:grid ${wide ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]" : "lg:grid-cols-2"}`}>
      <header
        className="relative overflow-hidden bg-[linear-gradient(160deg,#1f0050_0%,#3a0ea6_55%,#5b21d6_100%)] text-white lg:sticky lg:top-0 lg:h-dvh"
      >
        <div aria-hidden="true" className="absolute inset-0" style={NOTEBOOK_STYLE} />

        <div className="relative flex h-full flex-col px-6 py-5 sm:px-10 lg:px-14 lg:py-12">
          <Brand />

          <div className="hidden flex-1 flex-col justify-center lg:flex">{aside}</div>
        </div>
      </header>

      <main className="relative flex justify-center px-6 py-10 sm:px-10 lg:items-center lg:py-14">
        {/* Tema claro/escuro também nas telas de acesso */}
        <ThemeToggle className="absolute right-6 top-6 hidden sm:inline-flex" />
        <div className={`w-full ${wide ? "max-w-2xl" : "max-w-sm"}`}>
          <ThemeChoice className="mb-8 ml-auto w-48 sm:hidden" />
          {children}
        </div>
      </main>
    </div>
  );
}
