import { API_URL } from "@/lib/api/client";

// Foto de uma pessoa (autor de material, de comentário ou o próprio usuário) ou a inicial do nome, sem foto.
// className define tamanho, arredondamento e fonte; fallbackClassName, as cores do círculo com a inicial.
export default function UserAvatar({
  avatarUrl,
  name,
  className = "",
  fallbackClassName = "bg-purple-600 text-white",
}: {
  avatarUrl: string | null | undefined;
  name: string;
  className?: string;
  fallbackClassName?: string;
}) {
  const initial = name.trim().charAt(0).toUpperCase();

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden font-semibold ${avatarUrl ? "bg-gray-100" : fallbackClassName} ${className}`}
    >
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element -- imagem vem da API (outro host), sem otimização do Next
        <img src={`${API_URL}${avatarUrl}`} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
