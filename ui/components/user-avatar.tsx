import { avatarSrc, type UserProfile } from "@/lib/api/perfil";

// Foto do usuário (ou a inicial, sem foto). O tamanho e o arredondamento vêm de className.
export default function UserAvatar({
  user,
  className = "",
}: {
  user: Pick<UserProfile, "avatarUrl" | "firstName"> | null;
  className?: string;
}) {
  const src = avatarSrc(user);
  const initial = (user?.firstName ?? "").charAt(0).toUpperCase();

  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden bg-purple-600 font-semibold text-white ${className}`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element -- imagem vem da API (outro host), sem otimização do Next
        <img src={src} alt="" className="h-full w-full object-cover" />
      ) : (
        initial
      )}
    </span>
  );
}
