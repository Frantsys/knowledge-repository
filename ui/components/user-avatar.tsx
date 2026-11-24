"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { API_URL } from "@/lib/api/client";
import { cn } from "@/lib/utils";

// Foto de uma pessoa (autor de material, de comentário ou o próprio usuário), com o Avatar do shadcn/ui:
// a inicial do nome aparece enquanto a foto carrega ou quando não há foto.
// className define tamanho e fonte; fallbackClassName, as cores do círculo com a inicial.
export default function UserAvatar({
  avatarUrl,
  name,
  className = "",
  fallbackClassName = "bg-primary text-primary-foreground",
}: {
  avatarUrl: string | null | undefined;
  name: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <Avatar className={cn("after:hidden", className)}>
      {avatarUrl && (
        <AvatarImage src={`${API_URL}${avatarUrl}`} alt="" className="animate-in fade-in-0 duration-150" />
      )}
      <AvatarFallback className={cn("font-semibold", fallbackClassName)}>{initial}</AvatarFallback>
    </Avatar>
  );
}
