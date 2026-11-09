import { redirect } from "next/navigation";

// A raiz não tem conteúdo próprio: leva para o início (a navbar manda para /login se não houver sessão)
export default function Root() {
  redirect("/home");
}
