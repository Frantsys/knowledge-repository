import { useEffect } from "react";

// Fecha modais/menus com Esc enquanto estiverem abertos
export function useEscapeKey(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onEscape();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, onEscape]);
}

// O modal "Publicar material" mora na navbar; telas com botão "Publicar" pedem para abri-lo por este evento
export const OPEN_PUBLISH_EVENT = "open-publish-modal";

export function requestPublishModal() {
  window.dispatchEvent(new Event(OPEN_PUBLISH_EVENT));
}

// Tipos de arquivo aceitos no upload (mesma lista no texto de ajuda e no atributo accept)
export const ACCEPTED_FILES = ".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.zip";
export const ACCEPTED_FILES_HINT = "PDF, Word, PowerPoint, Excel, TXT, imagem ou ZIP · até 10 MB";
export const MAX_FILE_BYTES = 10 * 1024 * 1024; // spring.servlet.multipart.max-file-size da API

// Disciplinas oferecidas ao publicar e editar um material
export const SUBJECTS = ["Direito", "Tecnologia", "Administração", "Engenharia", "Outros"];
