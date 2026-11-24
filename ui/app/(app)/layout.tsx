import Navbar from "@/components/navbar";
import PageTransition from "@/components/page-transition";

// Layout das telas logadas: a navbar fica montada entre as páginas (sem piscar nem buscar o usuário de novo)
// e só o conteúdo abaixo dela faz a transição
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <Navbar />
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
