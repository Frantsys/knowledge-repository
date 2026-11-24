// Campo de formulário das telas de acesso: rótulo (negrito + * quando obrigatório), dica e erro ligados ao input
export const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 shadow-[0_1px_2px_rgb(16_24_40/0.04)] outline-none transition placeholder:text-gray-500 hover:border-gray-400 focus:border-purple-600 focus:ring-4 focus:ring-purple-600/15 aria-[invalid=true]:border-red-500 aria-[invalid=true]:focus:ring-red-500/15";

export default function FormField({
  id,
  label,
  required = false,
  hint,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={`mb-1.5 block text-sm text-gray-800 ${required ? "font-semibold" : "font-medium"}`}>
        {label}
        {required && <span aria-hidden="true" className="text-red-600"> *</span>}
      </label>

      {children}

      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-gray-600">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
