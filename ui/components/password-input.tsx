"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Senha com botão de mostrar/ocultar (Input e Button do shadcn/ui); repassa os demais atributos para o <input>
export default function PasswordInput({
  label = "senha",
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className={cn("h-11 pr-11", className)} />

      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? `Ocultar ${label}` : `Mostrar ${label}`}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 h-full w-11 rounded-l-none text-muted-foreground hover:bg-transparent hover:text-foreground dark:hover:bg-transparent"
      >
        {visible ? <EyeOff /> : <Eye />}
      </Button>
    </div>
  );
}
