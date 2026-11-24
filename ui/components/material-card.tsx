import Link from "next/link";
import { CalendarDays } from "lucide-react";

import LinkProgress from "@/components/link-progress";
import { Skeleton } from "@/components/skeleton";
import SubjectCover from "@/components/subject-cover";
import UserAvatar from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { type Material } from "@/lib/api/materials";
import { cn } from "@/lib/utils";

export function formatMaterialDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(date));
}

// Card único de material, usado no Início, no Explorar e em Meus materiais.
// Sempre na mesma ordem: disciplina, título, descrição (compacto), autor e data.
// "cover" tem a capa colorida da disciplina; "compact" é só texto, para listas maiores.
export default function MaterialCard({
  material,
  variant = "compact",
  actions,
  className,
}: {
  material: Material;
  variant?: "cover" | "compact";
  /** Botões sobre o card (ex.: menu de ações de Meus materiais), acima do link esticado */
  actions?: React.ReactNode;
  className?: string;
}) {
  const subject = (
    <Badge
      variant="secondary"
      className={cn("max-w-full", variant === "cover" ? "bg-card/95 text-primary shadow-sm" : "bg-accent text-accent-foreground")}
    >
      <span className="truncate">{material.subject}</span>
    </Badge>
  );

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-[border-color,box-shadow] duration-200 focus-within:ring-2 focus-within:ring-ring hover:border-primary/40 hover:shadow-md",
        className
      )}
    >
      {variant === "cover" && (
        <SubjectCover subject={material.subject} className="h-32 sm:h-36">
          <div className="absolute left-3 top-3 max-w-[70%]">{subject}</div>
        </SubjectCover>
      )}

      <div className="flex flex-1 flex-col p-5">
        {variant === "compact" && <div className="mb-3">{subject}</div>}

        <h3 className="line-clamp-2 text-base font-bold leading-snug">
          {/* Link "esticado": o card inteiro é clicável e navegável por teclado */}
          <Link
            href={`/materiais/${material.id}`}
            transitionTypes={["nav-forward"]}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {material.title}
            <LinkProgress />
          </Link>
        </h3>

        {variant === "compact" && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{material.body}</p>}

        <div className="mt-auto flex items-center justify-between gap-3 pt-4 text-xs text-muted-foreground">
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar
              avatarUrl={material.user?.avatarUrl}
              name={material.createdBy}
              className="size-6 text-[10px]"
              fallbackClassName="bg-accent text-accent-foreground"
            />
            <span className="truncate">
              por <span className="font-semibold text-foreground">{material.createdBy}</span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1.5">
            <CalendarDays className="size-3.5" />
            {formatMaterialDate(material.createdAt)}
          </span>
        </div>
      </div>

      {actions && <div className="absolute right-3 top-3 z-10">{actions}</div>}
    </article>
  );
}

// Esqueleto com a mesma estrutura do card (para listas carregando)
export function MaterialCardSkeleton({ variant = "compact", className }: { variant?: "cover" | "compact"; className?: string }) {
  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border bg-card", className)}>
      {variant === "cover" && <Skeleton className="h-32 rounded-none sm:h-36" />}
      <div className="flex flex-1 flex-col p-5">
        {variant === "compact" && <Skeleton className="mb-3 h-5 w-20" />}
        <Skeleton className="h-5 w-3/4" />
        {variant === "compact" && <Skeleton className="mt-3 h-4 w-full" />}
        <div className="mt-auto flex items-center justify-between pt-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
