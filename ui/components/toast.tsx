"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

type ToastItem = {
  id: number;
  message: string;
  type: "success" | "error";
  action?: { label: string; onClick: () => void };
};

type Listener = (item: ToastItem) => void;

const listeners = new Set<Listener>();
let nextId = 1;

// Feedback não bloqueante no lugar de alert(); o Toaster fica no layout raiz e sobrevive à navegação
export function toast(message: string, options: Omit<ToastItem, "id" | "message"> = { type: "success" }) {
  const item = { id: nextId++, message, ...options };
  listeners.forEach((listener) => listener(item));
}

export default function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const listener: Listener = (item) => {
      setItems((current) => [...current, item]);
      // Com ação (ex.: Desfazer) fica mais tempo na tela para dar tempo de reagir
      setTimeout(() => dismiss(item.id), item.action ? 8000 : 5000);
    };

    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  function dismiss(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[200] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
    >
      {items.map((item) => (
        <div
          key={item.id}
          role={item.type === "error" ? "alert" : "status"}
          className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 shadow-lg"
        >
          {item.type === "error" ? (
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
          ) : (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
          )}

          <p className="flex-1 whitespace-pre-line leading-5">{item.message}</p>

          {item.action && (
            <button
              type="button"
              onClick={() => {
                item.action?.onClick();
                dismiss(item.id);
              }}
              className="shrink-0 rounded-md px-2 py-0.5 text-sm font-semibold text-purple-700 hover:bg-purple-50"
            >
              {item.action.label}
            </button>
          )}

          <button
            type="button"
            onClick={() => dismiss(item.id)}
            aria-label="Fechar aviso"
            className="shrink-0 rounded-md p-0.5 text-gray-500 hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
