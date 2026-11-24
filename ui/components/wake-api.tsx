"use client";

import { useEffect } from "react";
import { API_URL } from "@/lib/api/client";

// Em hospedagens que hibernam a API (ex.: Render gratuito), a primeira requisição espera 30-60 s.
// Chamando o /health ao abrir as telas de acesso, a API acorda enquanto a pessoa ainda preenche o formulário.
export default function WakeApi() {
  useEffect(() => {
    fetch(`${API_URL}/v1/api/health`).catch(() => {});
  }, []);

  return null;
}
