import { toast as sonner } from "sonner";

type ToastOptions = {
  type: "success" | "error";
  action?: { label: string; onClick: () => void };
};

// Feedback não bloqueante no lugar de alert(), sobre o Sonner (toast do shadcn/ui).
// - sucesso some em 4s; erro e avisos com ação (ex.: Desfazer) ficam 8s para dar tempo de ler e reagir
// - a mensagem é o id: dispará-la de novo não duplica o aviso, só reinicia o tempo
// - o Sonner pausa o tempo com o cursor em cima e anuncia o aviso para leitores de tela
export function toast(message: string, options: ToastOptions = { type: "success" }) {
  const duration = options.action || options.type === "error" ? 8000 : 4000;
  const show = options.type === "error" ? sonner.error : sonner.success;

  show(message, {
    id: `${options.type}:${message}`,
    duration,
    action: options.action ? { label: options.action.label, onClick: options.action.onClick } : undefined,
  });
}
