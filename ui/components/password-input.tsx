"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { INPUT_CLASS } from "./form-field";

// Senha com botão de mostrar/ocultar; repassa os demais atributos para o <input>
export default function PasswordInput({
  label = "senha",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={`${INPUT_CLASS} pr-11`} />

      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
        aria-pressed={visible}
        className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-500 transition hover:bg-gray-100 hover:text-purple-700"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}
