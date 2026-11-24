import { Skeleton as ShadcnSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// Skeleton do shadcn/ui (bg-muted, acompanha o tema claro/escuro) com um brilho que percorre o bloco.
// SkeletonGroup só aparece depois de 150ms (classe skeleton-delayed no globals.css):
// quando a resposta é rápida, o esqueleto nunca chega a piscar na tela.

export function Skeleton({ className }: { className?: string }) {
  return <ShadcnSkeleton aria-hidden="true" className={cn("skeleton-shimmer", className)} />;
}

export function SkeletonGroup({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-label={label} aria-busy="true" className={cn("skeleton-delayed", className)}>
      {children}
    </div>
  );
}
