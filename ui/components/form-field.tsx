import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Campo de formulário das telas de acesso (Label do shadcn/ui): rótulo em negrito + * quando obrigatório,
// dica e erro ligados ao campo. O campo em si é um <Input>/<Select> do shadcn passado como filho.
export default function FormField({
  id,
  label,
  required = false,
  hint,
  error,
  action,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  /** Link ou botão na mesma linha do rótulo, à direita (ex.: "Esqueci minha senha") */
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className={required ? "font-semibold" : "font-medium"}>
          {label}
          {required && <span aria-hidden="true" className="-ml-1 text-destructive">*</span>}
        </Label>
        {action}
      </div>

      {children}

      {error ? (
        <p id={`${id}-error`} className="text-xs text-destructive">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
