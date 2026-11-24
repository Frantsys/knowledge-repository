import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Mesmo nome de lib/api/client.ts (SESSION_COOKIE); o proxy não deve importar módulos da aplicação
const SESSION_COOKIE = "banca_session";
const PUBLIC_PATHS = ["/login", "/signup"];

// Sem cookie de sessão, vai direto para o login no servidor, sem renderizar a tela inicial antes.
// Quem já está logado e abre /login ou /signup vai para o início.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!hasSession && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (hasSession && isPublic) {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Ignora arquivos estáticos, imagens otimizadas e qualquer caminho com extensão (favicon, imagens do public/)
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
